import React from "react";
import "./StudentClass.scss";
import image from "../../../images/pngegg.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { db, firebaseConfig } from "../../../firebase";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StudentClass = () => {
  const localData = localStorage.getItem("userData");
  const roleA = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const re_id = localData ? JSON.parse(localData).id : null;
  const sname = localData ? JSON.parse(localData).name : null;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classid");

  const [classData, setClassData] = useState(null);
  const [value, setValue] = useState(0);
  const [play, setPlay] = useState(false);
  const [result, setResult] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchClass = async () => {
    try {
      const classRef = doc(collection(db, "classes"), searchQuery);
      const classSnapshot = await getDoc(classRef);

      if (classSnapshot.exists()) {
        setClassData({ id: classSnapshot?.id, ...classSnapshot.data() });
      } else {
        console.log("Class does not exist");
      }
    } catch (error) {
      console.error("Error fetching class:", error);
    }
  };

  const fetchedResult = async (collectionName) => {
    const lessonQuizRef = collection(db, "result");
    const q = query(
      lessonQuizRef,
      where("classId", "==", searchQuery),
      where("userId", "==", ref_id)
    );
    const snapshot = await getDocs(q);
    const data = snapshot?.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResult(data);
  };

  useEffect(() => {
    fetchedResult("lessonQuiz");
  }, []);
  useEffect(() => {
    fetchClass();
  }, []);

  const currentTime = new Date();
  const availableQuizzes = classData?.quizes
  ?.filter((quiz) => {
    const startTime = new Date(quiz.start);
    const endTime = new Date(quiz.end);
    const isPlayable = endTime > currentTime && startTime <= currentTime;

    // Check if any result in the `result` array has a matching `lessonId`
    const hasMatchingResult = result.some(
      (resultItem) => resultItem.lessonId === quiz.quizId
    );

    // Exclude the quiz if it has a matching result
    return isPlayable && !hasMatchingResult;
  })
  .map((quiz) => ({ ...quiz, play: true }));

console.log(availableQuizzes);

  return (
    <div className="student-class-main-div">
      <div className="side-bar-student-class">
        <img src={image} className="side-image" alt="" />
        <p className="student-class-s-name">{sname}</p>
        {classData && (
          <>
            <p className="student-class-name"> Class : {classData.className}</p>
            <p className="student-class-b-name">Created by</p>
            <p className="student-class-t-name">{classData.teachername}</p>
          </>
        )}
      </div>
      <div className="right-side-student-class">
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Available Quizzes" />
              <Tab label="Results" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div className="student_class_available_container">
              {availableQuizzes && availableQuizzes?.length > 0 ? (
                availableQuizzes.map((quiz) => {
                  // Check if the same userId and classId are present in the result
                  const isSameUserAndClass = result.some(
                    (item) =>
                      item.userId === ref_id && item.classId === searchQuery
                  );

                  // Hide the Start button if the same user and class are present
                  const showStartButton = !isSameUserAndClass && quiz?.play;
                  return (
                    <div className="student_class_available" key={quiz?.quizId}>
                      <div className="student_class_available_left">
                        <div className="student_class_available_title">
                          {quiz?.lessonName}
                        </div>
                        <div className="student_class_available_time_title">
                          <div className="student_class_available_time_title_start">
                            Start :
                          </div>
                          <div className="student_class_available_time_title_end">
                            {new Date(quiz?.start).toLocaleDateString()}
                            &nbsp;&nbsp;
                            {new Date(quiz?.start).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="time">
                          <div className="student_class_available_start">
                            End :
                          </div>
                          <div className="student_class_available_end">
                            {new Date(quiz?.end).toLocaleDateString()}
                            &nbsp;&nbsp;
                            {new Date(quiz?.end).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                         {/* {showStartButton && ( */}
                          <Link
                            to={`/selfstudy/ground/play/${quiz?.quizId}/${quiz?.lessonName}?classId=${searchQuery}&classEndAt=${quiz?.end}`}
                            className="student_class_startbtn"
                          >
                            Start
                          </Link>
                    
                      {/* )} */}
                    </div>
                  );
                })
              ) : (
                <p>No available quizzes</p>
              )}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="student_class_available_container">
              {result.map((res, index) => {
                const givenAtDate = res?.givenAt?.toDate();
                console.log(res, "res");
                return (
                  <div className="student_class_available" key={index}>
                    <div className="student_class_available_left">
                      <div className="student_class_available_title">
                        {res?.lessonName}
                      </div>
                      <div className="student_class_available_time_title">
                        <div className="student_class_available_time_title_start">
                          givenAt :
                        </div>
                        <div className="student_class_available_time_title_end">
                          {givenAtDate ? givenAtDate.toLocaleString() : ""}
                        </div>
                      </div>
                      <div className="time">
                        <div className="student_class_available_start">
                          End :
                        </div>
                        <div className="student_class_available_end">
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
                      className="student_class_startbtn"
                      // onClick={() => handlePlayButtonClick(quiz)}
                    >
                      Score: {res.score}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default StudentClass;
