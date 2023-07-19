import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import "./SingleClass.scss";
import { SiGoogleclassroom } from "react-icons/si";
import firebase from "firebase/compat/app";
import { HiViewGrid } from "react-icons/hi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useEffect } from "react";
import {IoMenuOutline } from "react-icons/io5"
import {
  getDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db, firebaseConfig } from "../../../../firebase";
import DashBoard from "./ClassDashboard/DashBoard";
import ClassQuizzes from "./ClassQuizzes/ClassQuizzes"
import Settings from "./ClassSettings/Settings"


firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const SingleClass = ({showDrawer}) => {
  const localData = localStorage.getItem("userData");

  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const re_id = localData ? JSON.parse(localData).id : null;
  const t_name = localData ? JSON.parse(localData).name : null;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classid");
  // console.log("re_id", ref_id, "classid", searchQuery);
  const [classroom, setClassroom] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const fetchClassroom = async () => {
    try {
      // const classRef = collection(db, "classes");
      // const classDocRef = doc(classRef, searchQuery);
      // const classSnapshot = await getDoc(classDocRef);
  
      // if (classSnapshot.exists()) {
      //   const classData = classSnapshot.data();
      //   console.log(classData);
      //   setClassroom({
      //     id: classSnapshot.id, // Add the document ID to the class data
      //     ...classData
      //   });
    
      const collectionRef = collection(db, "classes"); // Replace "yourCollectionName" with the actual collection name
      const documentRef = doc(collectionRef, searchQuery); // Replace searchQuery with the specific document ID you want to fetch
      const snapshot = await getDoc(documentRef);
      
      if (snapshot.exists()) {
        const classData = {
          id: snapshot.id,
          className: snapshot.data().className
        };
        
        setClassroom(classData);
      } else {
        console.log("Class not found");
      }
    } catch (error) {
      console.log("Error fetching class data:", error);
    }
  }

  const handleSidebarClick = (component) => {
    setSelectedComponent(component);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "dashboard":
        return <DashBoard classroom={classroom} />;
      case "quizzes":
        return <ClassQuizzes classroom ={classroom} />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };
  useEffect(() => {
    fetchClassroom();
  }, []);


  return (
    <div className="main-singleclass-container">
      <div className="classroom_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
      <div className="sider-bar-main">
        <div className="icon_text">
          <SiGoogleclassroom className="icon-a" />
          <p>ClassRoom</p>
        </div>
        <div className="under-class-div">
          <p
            onClick={() => handleSidebarClick("dashboard")}
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              backgroundColor:
                selectedComponent === "dashboard" ? "lightblue" : "inherit",
            }}
          >
            <HiViewGrid
              style={{ color: "blue", fontSize: "16px", marginRight: "5px" }}
            />
            Dashboard
          </p>
          <p
            onClick={() => handleSidebarClick("quizzes")}
            style={{
              backgroundColor:
                selectedComponent === "quizzes" ? "lightblue" : "inherit",
            }}
          >
            Quizzes
          </p>
          <p
            onClick={() => handleSidebarClick("settings")}
            style={{
              backgroundColor:
                selectedComponent === "settings" ? "lightblue" : "inherit",
            }}
          >
            Settings
          </p>
        </div>
      </div>
      <div className="right-side-single-class">
        <div className="right-top-bar">
          <p className="grade-text">{classroom.className}</p>
          <p className="teacher-text">
            <FaChalkboardTeacher
              style={{ color: "blue", fontSize: "18px", marginRight: "5px" }}
            />
            {t_name}
          </p>
        </div>
        <div className="main-component-div">{renderSelectedComponent()}</div>
      </div>
    </div>
  );
};

export default SingleClass;
