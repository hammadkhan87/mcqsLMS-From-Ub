import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Dashboard.scss";
import ClassQuizzes from "../ClassQuizzes/ClassQuizzes";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { db, firebaseConfig } from "../../../../../firebase";

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
  limit,
  serverTimestamp,
} from "firebase/firestore";
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const DashBoard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classid");

  const [sheduledquizes, setsheduledquizes] = useState([]);
  const [passedobjects, setPassedObjects] = useState([]);
  const [processedobjects, setProcessedObjects] = useState([]);
  const [viewMoreClicked, setViewMoreClicked] = useState(false); // Track if "View More" button is clicked

  const fetchProgressObjects = async (documentId) => {
    const classRef = doc(db, "classes", documentId);

    const documentSnapshot = await getDoc(classRef);

    if (documentSnapshot.exists()) {
      // const data = documentSnapshot.data();
      const quizes = documentSnapshot.data()?.quizes;

      const futureObjects = quizes?.filter((quiz) => {
        const startDateTime = new Date(quiz.start);
        const endDateTime = new Date(quiz.end);
        const currentDateTime = new Date();
        return currentDateTime > startDateTime && currentDateTime < endDateTime;
      });
      setProcessedObjects(futureObjects);
      // console.log("Future Objects:", futureObjects);
    } else {
      console.log("Document not found.");
    }
  };
  const fetchFutureObjects = async (documentId) => {
    const classRef = doc(db, "classes", documentId);
    const documentSnapshot = await getDoc(classRef);
    if (documentSnapshot.exists()) {
      const quizes = documentSnapshot.data()?.quizes;
      const futureObjects = quizes?.filter((quiz) => {
        const startDateTime = new Date(quiz.start);
        const currentDateTime = new Date();

        return startDateTime > currentDateTime;
      });
      setsheduledquizes(futureObjects);
      // console.log("Future Objects:", futureObjects);
    } else {
      console.log("Document not found.");
    }
  };
  const fetchPassedObjects = async (documentId) => {
    const classRef = doc(db, "classes", documentId);

    const documentSnapshot = await getDoc(classRef);

    if (documentSnapshot.exists()) {
      // const data = documentSnapshot.data();
      const quizes = documentSnapshot.data()?.quizes;

      const futureObjects = quizes?.filter((quiz) => {
        const endDateTime = new Date(quiz.end);
        const currentDateTime = new Date();

        return currentDateTime > endDateTime;
      });

      setPassedObjects(futureObjects);
      // console.log("Future Objects:", futureObjects);
    } else {
      console.log("Document not found.");
    }
  };
  const handleViewMore = () => {
    setViewMoreClicked(true);
  };
  const handleBackToDashboard = () => {
    setViewMoreClicked(false);
  };

  useEffect(() => {
    fetchFutureObjects(searchQuery);
    fetchPassedObjects(searchQuery);
    fetchProgressObjects(searchQuery);
  }, []);

  return (
    <div className="class-dashboard-div">
      {viewMoreClicked ? (
        <ClassQuizzes handleBack={handleBackToDashboard} />
      ) : (
        <>
          {" "}
          <div className="top-bar-dashboard"></div>
          <p
            style={{
              marginTop: "10px",
              marginLeft: "10px",
              fontWeight: "bold",
            }}
          >
            Your courses
          </p>
          <div className="body-dashboard">
            <div className="shedule-div-a">
              <h3>Schedule Quiz</h3>
              <div className="inner-main-div-shedul">
                {sheduledquizes?.slice(0, 5)?.map((classItem, index) => (
                  <div className="main-inner-div-map" key={index}>
                    <p>Unit : {classItem.lessonName}</p>
                  </div>
                ))}
                <button className="shedule-more-btn" onClick={handleViewMore}>
                  View More
                </button>
              </div>
            </div>
            <div className="progress-div-a">
              <h3>In Progress Quiz</h3>
              <div className="inner-main-div-process">
                {processedobjects?.slice(0, 5)?.map((classItem, index) => (
                  <div className="main-inner-div-map-g" key={index}>
                    <p>Unit : {classItem.lessonName}</p>
                  </div>
                ))}
                <button className="shedule-more-btn" onClick={handleViewMore}>
                  View More
                </button>
              </div>
            </div>
            <div className="passed-div-a">
              <h3>Passed Quiz</h3>
              <div className="inner-main-div-passed">
                {passedobjects?.slice(0, 5)?.map((classItem, index) => (
                  <div className="main-inner-div-map-p" key={index}>
                    <p>Unit : {classItem.lessonName}</p>
                  </div>
                ))}
                <button className="shedule-more-btn" onClick={handleViewMore}>
                  View More
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
