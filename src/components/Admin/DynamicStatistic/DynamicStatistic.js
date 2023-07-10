import React, { useEffect, useState } from "react";
import "./DynamicStatistic.scss";
import { RotateLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { auth, db, firebaseConfig } from "../../../firebase";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { firestore, Timestamp } from "firebase/firestore";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);

const DynamicStatistic = () => {
  const [totalteachers, setTotalTeachers] = useState("");
  const [totalteacherslastMonth, setTotalTeacherslastMonth] = useState("");
  const [totallessonQuiz, setTotallessonQuiz] = useState("");
  const [totalselfStudent, setTotalSelfStudent] = useState("");
  const [totalselfStudentLastmonth, setTotalSelfStudentLastMonth] =
    useState("");
  const [totallessonlastmonth, setTotallessonQuizLastMonth] = useState("");
  const[totalquizplay,setTotalQuizPlay]=useState("")
  const[totalquizplaylastmonth,setTotalQuizPlayLastMonth]=useState("")
  const [allStudents, setAllStudents] = useState([]);
  const [lastMonthStudents, setLastMonthStudents] = useState([]);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  startDate.setHours(0, 0, 0, 0);
  const fetchStudents = async () => {
    const classesRef = collection(db, "classes");
    const q = query(classesRef);

    const querySnapshot = await getDocs(q);

    let allStudentsArr = [];
    let lastMonthStudentsArr = [];

    querySnapshot.forEach((doc) => {
      // Check if the document has a "students" array field
      if (doc.data().students && Array.isArray(doc.data().students)) {
        const students = doc.data().students;
        allStudentsArr = allStudentsArr.concat(students);

        const createdAt = doc.data().createdAt.toDate();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        if (createdAt > oneMonthAgo) {
          lastMonthStudentsArr = lastMonthStudentsArr.concat(students);
        }
      }
    });

    setAllStudents(allStudentsArr);
    setLastMonthStudents(lastMonthStudentsArr);
  };

  
  // Create a Firestore Timestamp from the start date
  var startTimestamp = Timestamp.fromDate(startDate);;
  const getTeachersCount = async () => {
    try {
      const docRef = collection(db, "teacher");
      const querySnapshot = await getDocs(query(docRef));
      const query2Snapshot = await getDocs(
        query(docRef, where("createdAt", ">=", startTimestamp))
      );
      setTotalTeacherslastMonth(query2Snapshot?.size);

      //const teachersSnapshot = await db.collection('teacher').get();
      setTotalTeachers(querySnapshot.size);
    } catch (error) {
      toast.error("Error retrieving teachers");
      console.log(error);
      return 0;
    }
  };
  const getTotalQuizCount = async () => {
    try {
      const docRef = collection(db, "result");
      const querySnapshot = await getDocs(query(docRef));
      const query2Snapshot = await getDocs(
        query(docRef, where("givenAt", ">=", startTimestamp))
      );
      setTotalQuizPlayLastMonth(query2Snapshot?.size);

      //const teachersSnapshot = await db.collection('teacher').get();
      setTotalQuizPlay(querySnapshot?.size);
    } catch (error) {
      toast.error("Error retrieving teachers");
      console.log(error);
      return 0;
    }
  };

  const getTotallessonQuiz = async () => {
    try {
      const docRef = collection(db, "lessonQuiz");
      const querySnapshot = await getDocs(query(docRef));
      const query2Snapshot = await getDocs(
        query(docRef, where("createdAt", ">=", startTimestamp))
      );

      //const teachersSnapshot = await db.collection('teacher').get();
      setTotallessonQuizLastMonth(query2Snapshot?.size);

      setTotallessonQuiz(querySnapshot?.size);
    } catch (error) {
      toast.error("Error retrieving Quiz");
      console.log(error);
      return 0;
    }
  };
  const getTotalSelfStudent = async () => {
    try {
      const docRef = collection(db, "student");
      const querySnapshot = await getDocs(query(docRef));

      //const teachersSnapshot = await db.collection('teacher').get();
      const query2Snapshot = await getDocs(
        query(docRef, where("createdAt", ">=", startTimestamp))
      );
      setTotalSelfStudentLastMonth(query2Snapshot?.size);
      setTotalSelfStudent(querySnapshot?.size);
    } catch (error) {
      toast.error("Error retrieving Quiz");
      console.log(error);
      return 0;
    }
  };

  useEffect(() => {
    getTeachersCount();
    getTotallessonQuiz();
    getTotalSelfStudent();
    getTotalQuizCount();
    fetchStudents();
  }, []);
  return (
    <>
      <div className="main-container">
        <h2>Dynamic Statistic</h2>
        <div className="inner-container">
          <div className="card">
            <h4>Total Quiz Played</h4>
            <p>{totalquizplay}</p>
            <p>Last Month : {totalquizplaylastmonth}</p>
          </div>
          <div className="card">
            {" "}
            <h4>Total Teacher Sign Up</h4>
            <p>{totalteachers}</p>
            <p>Last Month : {totalteacherslastMonth}</p>
          </div>
          <div className="card">
            {" "}
            <h4>Self Student</h4>
            <p>{totalselfStudent}</p>
            <p>Last Month : {totalselfStudentLastmonth}</p>
          </div>
          <div className="card">
            {" "}
            <h4>Total Student in Classroom</h4>
            <p>{allStudents?.length}</p>
            <p>Last Month :{lastMonthStudents?.length}</p>
          </div>
          <div className="card">
            {" "}
            <h4>Total Quiz Lesson add</h4>
            <p>{totallessonQuiz}</p>
            <p>Last Month : {totallessonlastmonth}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicStatistic;
