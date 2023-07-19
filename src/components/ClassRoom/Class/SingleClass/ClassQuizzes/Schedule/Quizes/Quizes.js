import React from 'react'
import "./quizes.scss"
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import {db,firebaseConfig} from "../../../../../../../firebase"
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
const Quizes = ({sheduledquizes}) => {
  const location = useLocation()
  const date = new Date(); // Replace this with your actual date value
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classid");
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;


  const deleteQuiz = async (quizId,Name,start,end) => {
    const classRef = doc(db, "classes", searchQuery);
  
    try {
      const classSnapshot = await getDoc(classRef);
  
      if (classSnapshot.exists()) {
        // const classData = classSnapshot.data();
        const quizes = classSnapshot.data()?.quizes;
  
        if (quizes && Array.isArray(quizes)) {
          const updatedQuizes = quizes.filter((quiz) => quiz.quizId !== quizId && quiz.lessonName !==Name);
  
          await updateDoc(classRef, { quizes: updatedQuizes });
          console.log("Quiz deleted successfully");
          toast.success("Quiz deleted successfully")
        } else {
          console.log("Quizes array not found or is not an array");
          toast.error("Quiz not found");

        }
      } else {
        console.log("Document not found");
        toast.error("document not found")

      }
    } catch (error) {
      console.log("Error deleting quiz:", error);
    }
  };
  const handledeleteQuiz=(quizId,Name,start,end)=>{
   deleteQuiz(quizId,Name,start,end)
  }

  return (
    <div className='main-div-quizes'>

          {sheduledquizes?.map((classItem, index) => (
          <div
            key={index}
            className="inner-class-div-a"
            
          >
            <div className="inner-class-bar-a">
              <p className="single-class-name-a">{classItem.lessonName}</p>
              <p className="show-student-text-a">
                Starts at : {new Date(classItem.start).toLocaleDateString()} {new Date(classItem.start).toLocaleTimeString()}
              </p>
              <p className="show-student-text-b">
              {/* {const userTimezoneDateTime = new Date(utcDateTime).toLocaleString(undefined, {
                  timeZone: "user", // Use the user's local time zone
                  // Add additional options for formatting (e.g., dateStyle, timeStyle)
                });} */}
                End at :  {new Date(classItem.end).toLocaleDateString()} {new Date(classItem.end).toLocaleTimeString()}
              </p>
            </div>
            <button className='btn_delete' onClick={()=>handledeleteQuiz(classItem.id,classItem.lessonName,classItem.start,classItem.end)}>Delete</button>

          </div>
        ))}

    </div>
  )
}

export default Quizes