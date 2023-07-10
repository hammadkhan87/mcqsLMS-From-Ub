import React, { useState, useEffect } from "react";
import "./Questions.scss";
import Question from "../Question/Question";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Result from "../Result/Result";

const Questions = ({ singleLesson }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [scoreStored, setScoreStored] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const questions = singleLesson.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const timeLimit = currentQuestion?.timeLimit || 30;
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (currentQuestionIndex === 0) {
  //     setStartTime((prevStartTime) => {
  //       const newStartTime = prevStartTime || new Date();
  //       console.log(newStartTime, "start time: useEffect");
  //       return newStartTime;
  //     });
  //   }
  // }, [currentQuestionIndex]);
  useEffect(() => {
    const newTimer = setTimeout(() => {
      handleNextQuestion();
    }, timeLimit * 1000);
    setTimer(newTimer);
    console.log(newTimer, "newTimer : useeffect");
    console.log(timeLimit, " time limit : useeffect");
    return () => {
      clearTimeout(newTimer);
    };
  }, [currentQuestionIndex, timeLimit]);

  const handleNextQuestion = (answer) => {
    const correctArray = currentQuestion?.options
      .filter((item) => item.correct)
      .map((item) => item.text);
    const isCorrect = correctArray?.includes(answer);
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedAnswer("");

    if (currentQuestionIndex + 1 >= questions.length && !scoreStored) {
      setEndTime(new Date());
      setScoreStored(true);
      clearTimeout(timer);
      storeScoreToFirestore();
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex >= questions.length && scoreStored) {
      setEndTime(new Date());
    }
  }, [currentQuestionIndex, questions.length, scoreStored]);

  useEffect(() => {
    if (scoreStored && endTime) {
      const totalTimeInSeconds = Math.floor((endTime - startTime) / 1000);
      console.log("startTime : " + startTime + " Endtime : " + endTime+" total time : "+totalTimeInSeconds);
      setDisplayTime(totalTimeInSeconds);
    }
  }, [scoreStored, startTime, endTime, currentQuestionIndex]);

  const onSelectAnswer = (answer) => {
    handleNextQuestion(answer);
  };

  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;

  const storeScoreToFirestore = async () => {
    try {
      const totalQuestions = questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      const docRef = await addDoc(collection(db, "result"), {
        score: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        userId: id,
        chapterId: singleLesson.chapterId,
        lessonName: singleLesson.lessonName,
        lessonId: singleLesson.id,
        timeTaken: `${displayTime} s`,
        timeUnit: "s",
      });
      console.log("Score stored successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error storing score:", error);
    }
  };

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return navigate(
      `result?score=${score}&questionsLength=${questions.length}&totalTime=${displayTime}&startTime=${startTime}&endTime=${endTime}&timer=${timer}`
    );
  }
  //   <Result
  //   score={score}
  //   totalQuestions={questions.length}
  //   timeTaken={`${displayTime} s`}
  //   timeUnit="s"
  //   totalTimeTaken={displayTime}
  // />
  return (
    <Question
      question={currentQuestion?.text}
      options={currentQuestion?.options}
      onSelectAnswer={onSelectAnswer}
      timeLimit={timeLimit}
      elapsedTime={displayTime}
    />
  );
};

export default Questions;
