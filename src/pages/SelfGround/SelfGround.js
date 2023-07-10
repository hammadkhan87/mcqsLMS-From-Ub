import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./SelfGround.scss";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
const SelfGround = () => {
  const localData = localStorage.getItem("userData");
  const userId = localData ? JSON.parse(localData).userId : null;

  let params = useParams();
  const { id } = params;

  const [lessons, setLessons] = useState([]);
  const [singleLesson, setSingleLesson] = useState({});
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
    setSingleLesson(
      lessons.find((lesson) => {
        return lesson.id == id;
      })
    );
  }, []);

  return (
    <div className="self_ground_container">
      <div className="self_ground_container_block">
        <div className="self_ground_total">
          {singleLesson?.questions?.length} Questions
        </div>
        <div className="self_ground_title">
          Lesson Name : {singleLesson?.lessonName}
        </div>
        {!userId && (
          <div className="self_ground_des">
            You are no registered your result will not be saved
          </div>
        )}

        <Link to={`/selfstudy/ground/play/${id}/${singleLesson?.lessonName}`}>
          <div className="self_ground_play">Play</div>
        </Link>
        <div className="self_ground_btns">
          {!userId && (
            <Link className="self_ground_reg" to="/signin">
              Login
            </Link>
          )}
          {!userId && <div className="self_ground_or">or</div>}
          {!userId && (
            <Link className="self_ground_reg self_ground_reg_reg" to="/signup">
              Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelfGround;
