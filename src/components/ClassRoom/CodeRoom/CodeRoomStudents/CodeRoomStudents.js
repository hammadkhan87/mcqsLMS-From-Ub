import React, { useEffect, useState } from "react";
import "./CodeRoomStudents.scss";
import { RxAvatar } from "react-icons/rx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { BsClockHistory } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
const CodeRoomStudents = () => {
  const localData = localStorage.getItem("userData");
  const teacherId = localData ? JSON.parse(localData).userId : null;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lessonId = searchParams.get("lessonId");
  const codeId = searchParams.get("codeId");

  const [lesson, setLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsResult, setStudentsResult] = useState([]);
  const fetchCodeStudents = async () => {
    try {
      // Use onSnapshot to listen for changes in the collection
      onSnapshot(
        query(
          collection(db, "coderoomstudents"),
          where("teacherRef", "==", teacherId),
          where("coderoomId", "==", codeId),
          orderBy("createdAt", "desc")
        ),
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudents(newData);
          // console.log(students, "students");
          // promiseToast.success("Code room fetched successfully");
        }
      );
    } catch (error) {
      console.error("Error fetching code room: ", error);
      toast.error("Error fetching code room")
      // promiseToast.error("Error fetching code room: " + error);
    }
  };
  const fetchStudentResult = async () => {
    try {
      // Use onSnapshot to listen for changes in the collection
      onSnapshot(
        query(
          collection(db, "result"),
          where("teacherRef", "==", teacherId),
          where("coderoomId", "==", codeId)
          // orderBy("createdAt", "desc")
        ),
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudentsResult(newData);
          // console.log(studentsResult, "students Result");
          // console.log(newData, "students Result");
          // promiseToast.success("Code room fetched successfully");
        }
      );
    } catch (error) {
      console.error("Error fetching code room: ", error);
      // promiseToast.error("Error fetching code room: " + error);
    }
  };
  function handleUpdate() {
    const examcollref = doc(db, "coderoom", codeId);
    updateDoc(examcollref, {
      started: "yes",
    })
      .then((response) => {
        toast.success("Quiz Started");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  function handleEnd() {
    const examcollref = doc(db, "coderoom", codeId);
    updateDoc(examcollref, {
      started: "end",
    })
      .then((response) => {
        toast.error("Quiz Ended");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  const fetchLesson = async () => {
    try {
      const docRef = doc(db, "lessonQuiz", lessonId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, retrieve the data
        setLesson(docSnap.data());
      } else {
        // Document does not exist
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  useEffect(() => {
   
    fetchLesson();
    fetchCodeStudents();
    fetchStudentResult();
    console.log(lesson);
  }, []);
  const navigate=useNavigate()
  return (
    <div className="coderoom_students_container">
      <div className="coderoom_students_container_students">
        <div className="coderoom_students_container_students_header">
          <div onClick={()=>navigate(-1)} className="coderoom_students_container_students_header_back">
            <BiArrowBack />
          </div>{" "}
          Participants ({students.length})
        </div>
        <div className="coderoom_students_container_students_list">
          {students.map((item, id) => {
            console.log(item, "students.item");
            const sing = studentsResult.find((elem) => {
              console.log(elem, "students Result.elem");
              return elem.username == item.username;
            });
            console.log(sing, "sing");
            return (
              <div
                key={id}
                className="coderoom_students_container_students_list_item"
              >
                <RxAvatar className="coderoom_students_container_students_list_item_image" />
                <div className="coderoom_students_container_students_list_item_name">
                  {item?.username}
                </div>
                <div className="coderoom_students_container_students_list_item_marks">
                  {sing ? `${sing?.percentage}%` : <BsClockHistory />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="coderoom_students_container_info">
        <div className="coderoom_students_container_info_title">
          <div className="coderoom_students_container_info_title_upper">
            {lesson?.lessonName}
          </div>
          <div className="coderoom_students_container_info_title_grade">
            Grade {lesson?.grade}
          </div>
        </div>
        <div className="coderoom_students_container_info2">
          <div className="coderoom_students_container_info2_points">
            <div className="coderoom_students_container_info2_points_heading">
              {lesson &&
                Math.round(lesson?.questions.length / lesson?.totalMarks)}
            </div>
            <div className="coderoom_students_container_info2_points_det">
              Points Per Question
            </div>
          </div>
          <div className="coderoom_students_container_info2_duration">
            <div className="coderoom_students_container_info2_duration_heading">
              {lesson &&
                Math.round(lesson?.questions.length / lesson?.totalDuration)}
            </div>
            <div className="coderoom_students_container_info2_duration_det">
              Duration Per Question
            </div>
          </div>
        </div>
        <div className="coderoom_students_container_info3">
          <div
            className="coderoom_students_container_info3_start"
            onClick={handleUpdate}
          >
            Start
          </div>
          <div
            onClick={handleEnd}
            className="coderoom_students_container_info3_end"
          >
            End
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRoomStudents;
