import React from "react";
import "./AddtoClass.scss";
import { toast } from "react-hot-toast";
import { auth, db, firebaseConfig } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import {
  getDoc,
  writeBatch,
  arrayRemove,
  addDoc,
  deleteDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const AddtoClass = ({ classroom, classid }) => {
  const navigate = useNavigate();

  const localData = localStorage.getItem("userData");
  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const re_id = localData ? JSON.parse(localData)?.id : null;
  console.log(re_id)

  const [teacherData, setTeacherData] = useState([]);

  console.log(classid);

  const fetchTeacherData = async () => {
    try {
      console.log(classroom.teacherRef);
      const teacherDocRef = doc(db, "users", classroom.teacherRef);
      const teacherSnapshot = await getDoc(teacherDocRef);

      if (teacherSnapshot.exists()) {
        const teacherData = teacherSnapshot.data();
        setTeacherData(teacherData);
      } else {
        toast.error("Teacher not found");
      }
    } catch (error) {
      console.log("Error fetching teacher data:", error);
    }
  };
  console.log(classid)
  const handleJoinNow = async () => {
    try {
      // Check if the student is already in the class
      if (classroom.students.includes(re_id)) {
        toast.error("You are already in the class!");
        navigate(`/`);
        return;
      }
    
      // Add re_id to the students array in the class document
      const classDocRef = doc(db, "classes", classid);
      await updateDoc(classDocRef, {
        students: firebase.firestore.FieldValue.arrayUnion(re_id),
      });
    
      // Add classid to the classrooms array in the student document
      const studentDocRef = doc(db, "student", re_id);
      await updateDoc(studentDocRef, {
        classrooms: firebase.firestore.FieldValue.arrayUnion({
          classid: classid,
          classname: classroom.className,
          teacherid: classroom.teacherRef,
        }),
      });
    
      toast.success("Successfully joined the class!");
      navigate(`/`);
    } catch (error) {
      console.log("Error joining the class:", error);
      toast.error("Failed to join the class");
      navigate(`/`);
    }
    
  };

  useEffect(() => {
    // fetchTeacherData();
    if (classroom) {
      fetchTeacherData();
    }
  }, [classroom]);

  console.log(classroom);
  // console.log(teacherData);

  return (
    <div className="card-main-div">
      <div className="title-div">
        <p className="class-title">Add to class Room</p>
        <p className="class-name">{classroom?.className}</p>
        <p className="teacher-name">Created by {teacherData.name}</p>
      </div>
      <button onClick={handleJoinNow}>Join Now</button>
    </div>
  );
};

export default AddtoClass;
