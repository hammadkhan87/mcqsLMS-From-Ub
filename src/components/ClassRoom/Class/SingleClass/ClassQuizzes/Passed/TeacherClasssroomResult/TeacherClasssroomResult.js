import React from "react";
import "./TeacherClasssroomResult.scss";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { db, firebaseConfig } from "../../../../../../../firebase";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  ref,
  query,
  where,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { writeBatch } from "firebase/firestore";

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();


const TeacherClasssroomResult = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const classid = searchParams.get("classid");
  const quizId = searchParams.get("quizId");
  const [results, setResults] = useState([]);

  console.log(classid,quizId)


  useEffect(() => {
    const fetchResults = async () => {
      try {
        const firestore = firebase.firestore();
        const querySnapshot = await firestore
          .collection("result")
          .where("classId", "==", classid)
          .where("lessonId", "==", quizId)
          .get();

        const fetchedResults = [];
        for (const doc of querySnapshot.docs) {
          const resultData = doc.data();
          const studentSnapshot = await firestore
            .collection("student")
            .doc(resultData.userId)
            .get();

          const studentData = studentSnapshot.data();
          const resultWithStudent = {
            ...resultData,
            name: studentData.name,
          };
          fetchedResults.push(resultWithStudent);
        }

        setResults(fetchedResults);
      } catch (error) {
        console.log("Error fetching results:", error);
      }
    };

    fetchResults();
  }, [classid, quizId]);
  // console.log(results)
  return(
    <div className="main_class_result_container">
    {results ? (<>
     
      <div className="result_class_available_container">
        <h2 className="reluts_heading">Results</h2>
              {results?.map((res, index) => {
                const givenAtDate = res?.givenAt?.toDate();
                console.log(res, "res");
                return (
                  <div className="result_class_available" key={index}>
                    <div className="result_class_available_left">
                      <div className="result_class_available_title">
                        {res?.name}
                      </div>
                      <div className="result_class_available_time_title">
                        <div className="result_class_available_time_title_start">
                          givenAt :
                        </div>
                        <div className="result_class_available_time_title_end">
                          {givenAtDate ? givenAtDate.toLocaleString() : ""}
                        </div>
                      </div>
                      <div className="time">
                        <div className="result_class_available_start">
                          End :
                        </div>
                        <div className="result_class_available_end">
                          {new Date(
                            res?.teacherClassEndTime
                          ).toLocaleDateString()}
                          &nbsp;&nbsp;
                          {new Date(
                            res?.teacherClassEndTime
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div
                      // to={`/selfstudy/ground/play/${quiz.quizId}?classId=${searchQuery}`}
                      className="result_class_startbtn"
                      // onClick={() => handlePlayButtonClick(quiz)}
                    >
                      Score: {res.score}
                    </div>
                  </div>
                );
              })}
            </div>
    
    </>):(<p>No Results Found</p>)}
    

    </div>
  )
};

export default TeacherClasssroomResult;
