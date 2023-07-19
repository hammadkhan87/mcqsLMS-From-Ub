import React, { useState, useEffect, useMemo } from "react";
import "./Questions.scss";
import Question from "../Question/Question";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Result from "../Result/Result";

const Questions = ({ singleLesson, teacherClassId, teacherClassQuizEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [scoreStored, setScoreStored] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [selectedCorrect, setSelectedCorrect] = useState(false);
  const [timer, setTimer] = useState(null);
  const [quizEnd, setQuizEnd] = useState(false);
  const questions = singleLesson.questions;
  const totalDuration = singleLesson.totalDuration;
  // console.log(totalDuration);
  // console.log(questions.length);

  const questionduration = totalDuration % questions.length;
  // console.log(questionduration);
  const currentQuestion = questions[currentQuestionIndex];
  const timeLimit = questionduration * 60;
  const [timelimit, setTimeLimit] = useState(timeLimit);
  const [remainingTime, setRemainingTime] = useState(timelimit);

  // const memoizedRemainingTime = useMemo(() => remainingTime, [remainingTime]);

  const navigate = useNavigate(); // console.log(timelimit);
  // console.log(timelimit)
  useEffect(() => {
    if (timelimit > 0) {
      const newTimer = setTimeout(() => {
        handleNextQuestion();
        setRemainingTime(timelimit);
      }, timelimit * 1000);
      setTimer(newTimer);
      // console.log(newTimer, "newTimer : useeffect");
      // console.log(timelimit, " time limit : useeffect");
      return () => {
        clearTimeout(newTimer);
      };
    }
  }, [currentQuestionIndex]);
  // useEffect(() => {
  //   if (timelimit > 0) {
  //     const newTimer = setTimeout(() => {
  //       handleNextQuestion();
  //     }, timelimit * 1000);
  //     setTimer(newTimer);

  //     return () => {
  //       clearTimeout(newTimer);
  //     };
  //   }
  // }, [currentQuestionIndex]);
  // useEffect(() => {
  //   if (remainingTime > 0) {
  //     const timer = setTimeout(() => {
  //       handleNextQuestion();
  //     }, remainingTime * 1000);

  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }
  // }, [remainingTime]);

  const handleNextQuestion = async (answer) => {
    const correctArray = currentQuestion?.options
      .filter((item) => item.correct)
      .map((item) => item.text);

    const isCorrect = correctArray?.includes(answer);
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setSelectedCorrect(true);
    } else {
      setSelectedCorrect(false);
    }

    setSelectedAnswer("");

    if (currentQuestionIndex + 1 >= questions.length) {
      clearTimeout(timer);
      // await storeScoreToFirestore(); // Wait for score to be stored/updated
      setQuizEnd(true);
      setScoreStored(true);
    } else {
      setRemainingTime(questionduration * 60);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const onSelectAnswer = (answer) => {
    setTimeLimit(questionduration * 60);
    setRemainingTime(questionduration * 60);
    handleNextQuestion(answer);
  };

  const localData = localStorage.getItem("userData");
  const userId = localData ? JSON.parse(localData).userId : null;

  const startTimer = () => {
    const timer = setInterval(() => {
      setRemainingTime((remainingTime) => remainingTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  };

  // Call the startTimer function when currentQuestionIndex or handleNextQuestion change
  useState(() => {
    if (timelimit == 0) {
      return;
    } else {
      startTimer();
    }
  }, [currentQuestionIndex]);
  // useEffect(() => {
  //   startTimer();
  // }, [currentQuestionIndex, handleNextQuestion]);
  // useEffect(() => {
  //   const timer = startTimer(); // Call startTimer and store the returned timer reference

  //   return () => {
  //     clearInterval(timer); // Clear the interval when the component unmounts
  //   };
  // }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // const storeScoreToFirestore = async () => {
  //   try {
  //     const totalQuestions = questions.length;
  //     const percentage = Math.round((score / totalQuestions) * 100);
  //     console.log(
  //       percentage,
  //       "percentage",
  //       score,
  //       "score",
  //       totalQuestions,
  //       "totalQuestions"
  //     );
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(db, "result"),
  //         where("userId", "==", userId),
  //         where("lessonId", "==", singleLesson.id)
  //       )
  //     );

  //     if (!querySnapshot.empty) {
  //       // User has already taken the quiz, update the existing document
  //       const docRef = querySnapshot.docs[0].ref;
  //       await updateDoc(docRef, {
  //         score: score,
  //         totalQuestions: totalQuestions,
  //         percentage: percentage,
  //         timeTaken: `${displayTime} s`,
  //       });

  //       console.log("Score updated successfully");
  //     } else {
  //       // User is taking the quiz for the first time, create a new document
  //       const docRef = await addDoc(collection(db, "result"), {
  //         score: score,
  //         totalQuestions: totalQuestions,
  //         percentage: percentage,
  //         userId: userId,
  //         chapterId: singleLesson.chapterId,
  //         lessonName: singleLesson.lessonName,
  //         lessonId: singleLesson.id,
  //         timeTaken: `${displayTime} s`,
  //         timeUnit: "s",
  //       });
  //       console.log("Score stored successfully with ID:", docRef.id);
  //     }

  //     setScoreStored(true);
  //   } catch (error) {
  //     console.error("Error storing/updating score:", error);
  //   }
  // };
  const MemoizedQuestion = React.memo(Question);

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }
  // console.log(singleLesson);
  if (quizEnd) {
    return navigate(
      `result?lessonName=${singleLesson.lessonName}&chapterId=${singleLesson.chapterId}&userId=${userId}&lessonId=${singleLesson.id}&score=${score}&questionsLength=${questions.length}&classId=${teacherClassId}&classEndTime=${teacherClassQuizEnd}`
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {timeLimit > 0 && (
        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginLeft: "10px",
            color: "white",
          }}
        >
          {formatTime(remainingTime)}
        </div>
      )}

      <MemoizedQuestion
        question={currentQuestion?.text}
        options={currentQuestion?.options}
        onSelectAnswer={onSelectAnswer}
        selectedCorrect={selectedCorrect}
      />
    </div>
  );
};

export default Questions;
