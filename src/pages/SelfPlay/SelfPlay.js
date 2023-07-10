import React, { useEffect, useState } from "react";
import "./SelfPlay.scss";
import { useLocation, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Timer from "../../components/SelfPlay/Timer/Timer";
import Questions from "../../components/SelfPlay2/Questions/Questions";

const SelfPlay = () => {
  let params = useParams();
  const { id } = params;
  const [timer, setTimer] = useState(true);
  const [count, setCount] = useState(5);
  const [singleLesson, setSingleLesson] = useState({});
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacherClassId = searchParams.get("classId");
  const teacherClassQuizEnd = searchParams.get("classEndAt");
  const fetchedDataLessons = async (collectionName) => {
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      setSingleLesson({ ...data, id: docSnapshot.id });
  
    } else {
      console.log("Document not found!");
    }
  };
  useEffect(() => {
    fetchedDataLessons("lessonQuiz");
    
  }, []);

  return (
    <div className="self_play_container">
      {count === 5 ||
      count === 4 ||
      count === 3 ||
      count === 2 ||
      count === 1 ? (
        <Timer count={count} setCount={setCount} />
      ) : (
        <Questions singleLesson={singleLesson} teacherClassId={teacherClassId} teacherClassQuizEnd={teacherClassQuizEnd} />
      )}
    </div>
  );
};

export default SelfPlay;
