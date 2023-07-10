import React from "react";
import "./StudentPortal.scss";
import { useLocation } from "react-router-dom";
import im from "../../images/pngegg.png";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "firebase/compat/storage";
import { db, firebaseConfig } from "../../firebase";
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
import { toast } from "react-hot-toast";
import { writeBatch } from "firebase/firestore";

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const StudentPortal = () => {
  const [classes, setClasses] = useState([]);
  const localData = localStorage.getItem("userData");
  const roleA = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const re_id = localData ? JSON.parse(localData).id : null;
  const sname = localData ? JSON.parse(localData).name : null;
  const navigate = useNavigate();
  const [selectedclass, setSelectedClass] = useState("");

  const fetchClasses = async () => {
    try {
      const q = query(
        collection(db, "classes"),
        where("students", "array-contains", re_id)
      );
      const snapshot = await getDocs(q);

      const fetchedClasses = snapshot.docs.map((doc) => ({
        id: doc?.id,
        ...doc.data(),
      }));

      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Error fetching classes: ", error);
    }
  };
  const handleClassClick = (e, classObj) => {
    setSelectedClass(classObj);
    navigate(`student-class?classid=${classObj?.id}`);
  };

  useEffect(() => {
    fetchClasses();
    console.log(classes);
  }, []);
  console.log(classes);
  return (
    <div className="student-classes-main-div">
      <div className="student-classes">
        <div className="student-classes_header">
          <div className="student-classes_header_left">My Classes</div>
          <div className="student-classes_header_right">{sname}</div>
        </div>
        <div className="list-of-classes">
          {classes.map((classObj, index) => {
            const currentTime = new Date(); // Get the current date and time
            const filteredQuizzes = classObj?.quizes?.filter(
              (quiz) => new Date(quiz.end) > currentTime
            );
            const quizzesLength = filteredQuizzes?.length;
            return (
              <div
                className="inner-map-student-class"
                key={index}
                onClick={(e) => handleClassClick(e, classObj)}
              >
                <p className="class-name-text">{classObj.className}</p>
                <p className="class-avail-text">
                  Available quizzes:{quizzesLength}
                </p>
               
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
