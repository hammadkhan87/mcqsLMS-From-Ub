import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.scss";
import { IoReturnUpBackOutline } from "react-icons/io5";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
const Result = () => {
  console.log("Component rendered");
  const localData = localStorage.getItem("userData");
  // const username = localData ? JSON.parse(localData).username : null;
  const codeData = localStorage.getItem("codeData");
  const username = codeData ? JSON.parse(codeData).username : null;
  const codeId = codeData ? JSON.parse(codeData).coderoomId : null;
  const teacherRef = codeData ? JSON.parse(codeData).teacherRef : null;
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const lessonId = queryParams.get("lessonId");
  const chapterId = queryParams.get("chapterId");
  const lessonName = queryParams.get("lessonName");
  const score = queryParams.get("score");
  const questionsLength = queryParams.get("questionsLength");
  const teacherClassId = queryParams.get("classId");
  const teacherClassEnd = queryParams.get("classEndTime");

  useEffect(() => {
    const storeScoreToFirestore = async () => {
      try {
        const totalQuestions = questionsLength;
        const percentage = Math.round((score / totalQuestions) * 100);

        const querySnapshot = await getDocs(
          query(
            collection(db, "result"),
            where("userId", "==", userId)
            // where("lessonId", "==", lessonId)
          )
        );
        // User is taking the quiz for the first time, create a new document

        const docRef = await addDoc(collection(db, "result"), {
          ...(score && { score: score }),
          ...(totalQuestions && { totalQuestions: totalQuestions }),
          ...(percentage && { percentage: percentage }),
          ...(username && { username: username }),
          ...(teacherRef && { teacherRef: teacherRef }),
          ...(codeId && { coderoomId: codeId }),
          ...(lessonId && { lessonId: lessonId }),
          ...(chapterId && { chapterId: chapterId }),
          ...(lessonName && { lessonName: lessonName }),
          ...(teacherClassId && { classId: teacherClassId }),
          ...(userId && { userId: userId }),
          ...(teacherClassEnd && { teacherClassEndTime: teacherClassEnd }),
          givenAt: serverTimestamp(),
        });
        if (username) {
          localStorage.removeItem("codeData");
        }
        console.log("Score stored successfully with ID:", docRef?.id);
      } catch (error) {
        console.error("Error storing/updating score:", error);
      }
    };
    storeScoreToFirestore();
  }, []);
  return (
    <div className="quiz_result_container">
      <div className="quiz_result">
        <div className="quiz_result_header">
          <h2>Quiz completed!</h2>
        </div>
        <div className="quiz_result_body">
          <p>
            Your score: {score} out of {questionsLength}
          </p>
          <p>{/* Time taken: {timeTaken} {timeUnit} */}</p>
          {/* {location} */}
          <div
            onClick={() => navigate(`/selfstudy/ground/${lessonId}/${lessonName}`)}
            className="quiz_result_body_btn"
          >
            Play Again
          </div>
        </div>
        <div className="quiz_result_footer"></div>
      </div>
      <div className="back_button" onClick={() => navigate(-2)}>
        <IoReturnUpBackOutline />
      </div>
    </div>
  );
};

export default Result;
