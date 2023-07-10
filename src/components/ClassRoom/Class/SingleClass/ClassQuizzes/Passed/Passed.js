import React from "react";
import "./Passed.scss";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { db, firebaseConfig } from "../../../../../../firebase";

import {
  addDoc,
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const Passed = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classid");
  const [passedobjects, setPassedObjects] = useState([]);

  const fetchFutureObjects = async (documentId) => {
    const classRef = doc(db, "classes", documentId);

    const documentSnapshot = await getDoc(classRef);

    if (documentSnapshot.exists()) {
      const data = documentSnapshot.data();

      const futureObjects = data?.quizes?.filter((quiz) => {
        const endDateTime = new Date(quiz.end);
        const currentDateTime = new Date();

        return currentDateTime > endDateTime;
      });

      setPassedObjects(futureObjects);
      console.log("Future Objects:", futureObjects);
    } else {
      console.log("Document not found.");
    }
  };
  useEffect(() => {
    fetchFutureObjects(searchQuery);
  }, []);

  return (
    <div className="div-of-div-b">
      <div className="main-div-quizes-p">
        {passedobjects?.map((classItem, index) => {
          console.log(classItem);
          return (
            <div key={index} className="inner-class-div-a-p">
              <Link
                to={`teacher-classroom-result?quizId=${classItem.quizId}&classid=${searchQuery}`}
                className="inner-class-bar-a-p"
              >
                <p className="single-class-name-a-p">{classItem.lessonName}</p>
                <p className="show-student-text-a-p">
                  Started : {new Date(classItem.start).toLocaleDateString()}{" "}
                  {new Date(classItem.start).toLocaleTimeString()}
                </p>
                <p className="show-student-text-b-p">
                  End at : {new Date(classItem.end).toLocaleDateString()}{" "}
                  {new Date(classItem.end).toLocaleTimeString()}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Passed;
