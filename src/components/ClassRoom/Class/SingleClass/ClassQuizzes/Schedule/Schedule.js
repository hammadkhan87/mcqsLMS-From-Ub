import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


import "./Schedule.scss";
import { Button, Modal, Select } from "antd";
import Quizes from "./Quizes/Quizes";
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
import { toast } from "react-hot-toast";

const { Option } = Select;

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const Schedule = ({ classroom }) => {
  const localData = localStorage.getItem("userData");

  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const t_id = localData ? JSON.parse(localData).id : null;
  const t_name = localData ? JSON.parse(localData).name : null;
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importantDocs, setImportantDocs] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [likeDocs, setLikeDocs] = useState([]);
  const [selectedLike, setSelectedLike] = useState("");
  const [selectedLikeQuizId, setSelectedLikeQuizId] = useState("");
  const [lessonQuizData, setLessonQuizData] = useState([]);
  const [lessonfolderdata, setLessonFolderData] = useState([]);
  const [selectedLessonQuiz, setSelectedLessonQuiz] = useState(null);
  const [selectedLessonfolder, setSelectedLessonFolder] = useState(null);
  const [teacherFolders, setTeacherFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFolderName, setSelectedFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [finalselectedid, setFinalselectedid] = useState("");
  const [finalselectedlessonname, setFinalselectedname] = useState("");
  const [sheduledquizes, setsheduledquizes] = useState([]);
  const date = new Date(); // Replace this with your actual date value
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  console.log(startDateTime);

 

  const handleStartDateTimeChange = (event) => {
    const newtime = new Date(event.target.value);
    const utcDateTime = newtime.toISOString();

    setStartDateTime(utcDateTime);
  };

  const handleEndDateTimeChange = (event) => {
    const newtime = new Date(event.target.value);
    const utcDateTime = newtime.toISOString();
    setEndDateTime(utcDateTime);
  };

  const fetchImportantDocs = async () => {
    try {
      const importantRef = collection(db, "lessonQuiz");
      const q = query(importantRef, where("userId", "==", t_id),where("Folder","==","Important"));
      const snapshot = await getDocs(q);
      const docs = snapshot?.docs?.map((doc) => ({
        quizId: doc.id,
        lessonName:doc.data().lessonName,
      }));
      setImportantDocs(docs);
    } catch (error) {
      console.log("Error fetching important documents:", error);
    }
  };

  const fetchLikeDocs = async () => {
    try {
      const likeRef = collection(db, "lessonQuiz");
      const q = query(likeRef, where("userId", "==", t_id),where("Folder","==","Like"));
      const snapshot = await getDocs(q);
      const docs = snapshot?.docs?.map((doc) => ({
        quizId: doc.id,
        lessonName:doc.data().lessonName,
      }));
      setLikeDocs(docs);
    } catch (error) {
      console.log("Error fetching like documents:", error);
    }
  };

  const fetchLessonQuiz = async () => {
    try {
      const lessonQuizRef = collection(db, "lessonQuiz");
      const q = query(
        lessonQuizRef,
        where("Folder", "==", "Dynamic"),
        where("refId", "==", t_id)
      );
      const snapshot = await getDocs(q);
      const data = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        quizId :doc.id,
        lessonName:doc.data().lessonName,

      }));
      setLessonQuizData(data);
    } catch (error) {
      console.log("Error fetching lessonQuiz documents:", error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSelectedLessonFolder("");
    setSelectedFolder("");
    setSelectedLesson("");
    setSelectedLike("");
    setSelectedLessonQuiz("");
    setFinalselectedid("");
    setFinalselectedname("");
    setStartDateTime("");
    setEndDateTime("");
    setIsModalOpen(false);
  };

  const handleLessonSelect = (value) => {
    setSelectedLessonFolder("");
    setSelectedFolder("");
    setSelectedLike("");
    setSelectedLessonQuiz("");
    setSelectedLesson(value);
    const selectedDoc = importantDocs.find((doc) => doc.lessonName === value);
    if (selectedDoc) {
      setSelectedQuizId(selectedDoc.quizId);
      console.log(selectedDoc.quizId);
      setFinalselectedid(selectedDoc.quizId);
      setFinalselectedname(selectedDoc.lessonName);
      console.log(selectedDoc.lessonName);
    } else {
      setSelectedQuizId("");
    }
  };

  const handleLikeSelect = (value) => {
    setSelectedLessonFolder("");
    setSelectedFolder("");
    setSelectedLessonQuiz("");
    setSelectedLesson("");

    setSelectedLike(value);
    const selectedDoc = likeDocs.find((doc) => doc.lessonName === value);
    if (selectedDoc) {
      setSelectedLikeQuizId(selectedDoc.quizId);
      console.log(selectedDoc.quizId);
      console.log(selectedDoc.lessonName);
      setFinalselectedid(selectedDoc.quizId);
      setFinalselectedname(selectedDoc.lessonName);
    } else {
      setSelectedLikeQuizId("");
    }
  };

  const handleLessonQuizSelect = (value) => {
    setSelectedLessonFolder("");
    setSelectedFolder("");
    setSelectedLesson("");
    setSelectedLike("");
    setSelectedLessonQuiz(value);
    const selectedQuiz = lessonQuizData.find(
      (quiz) => quiz.lessonName === value
    );
    if (selectedQuiz) {
      setFinalselectedid(selectedQuiz.id);
      setFinalselectedname(selectedQuiz.lessonName);
      // console.log("Selected Lesson Quiz ID:", selectedQuiz.id);
      // console.log("Selected Lesson Quiz name:", selectedQuiz.lessonName);
    }
  };

  const fetchTeacherFolders = async () => {
    try {
      const foldersRef = collection(db, "teacherFolders");
      const q = query(foldersRef, where("userId", "==", t_id));
      const snapshot = await getDocs(q);
      const folders = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeacherFolders(folders);
    } catch (error) {
      console.log("Error fetching teacher folders:", error);
    }
  };

  const fetchFolderQuiz = async (folderValue, refId) => {
    try {
      const lessonQuizRef = collection(db, "lessonQuiz");
      const q = query(
        lessonQuizRef,
        where("Folder", "==", folderValue),
        where("refId", "==", refId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        lessonName:doc.data().lessonName,
      }));
      setLessonFolderData(data);
    } catch (error) {
      console.log("Error fetching lessonQuiz documents:", error);
    }
  };
  const fetchFutureObjects = async (documentId) => {
    const classRef = doc(db, "classes", documentId);

    const documentSnapshot = await getDoc(classRef);

    if (documentSnapshot.exists()) {
      const quizes = documentSnapshot.data().quizes;

      const futureObjects = quizes?.filter((quiz) => {
        const startDateTime = new Date(quiz.start);
        const currentDateTime = new Date();

        return startDateTime > currentDateTime;
      });
      setsheduledquizes(futureObjects);
      console.log("Future Objects:", futureObjects);
    } else {
      console.log("Document not found.");
    }
  };

  const handleFolderSelect = async (value) => {
    setSelectedLesson("");
    setSelectedLike("");
    setSelectedLessonQuiz("");
    setSelectedFolder(value);
    const selectedFolder = teacherFolders.find((folder) => folder.id === value);
    if (selectedFolder) {
      setSelectedFolderName(selectedFolder.name);
      setSelectedFolderId(selectedFolder.id);
      await fetchFolderQuiz(selectedFolder.name, t_id);
    } else {
      setSelectedFolderName("");
      setSelectedFolderId("");
      setLessonFolderData([]);
    }
  };
  const handleLessonFolderSelect = (value) => {
    setSelectedLesson("");
    setSelectedLike("");
    setSelectedLessonQuiz("");
    setSelectedLessonFolder(value);
    const selectedQuiz = lessonfolderdata.find(
      (quiz) => quiz.lessonName === value
    );
    if (selectedQuiz) {
      setFinalselectedid(selectedQuiz.id);
      setFinalselectedname(selectedQuiz.lessonName);
      console.log("Selected Lesson Quiz ID:", selectedQuiz.id);
      console.log("Selected Lesson Quiz Name:", selectedQuiz.lessonName);
    }
  };
  // console.log(selectedLesson);
  // console.log(selectedLessonQuiz);
  // console.log(selectedLike);
  console.log(finalselectedid);
  console.log(finalselectedlessonname);

  const SaveData = async () => {
    if (
      finalselectedid === "" ||
      finalselectedlessonname === "" ||
      startDateTime === null ||
      endDateTime === null ||
      startDateTime === "" ||
      endDateTime === ""
    ) {
      toast.error("Pls Enter all the data");
    } else {
      try {

        const classDocRef = doc(db, "classes", classroom.id);
        await updateDoc(classDocRef, {
          quizes: firebase.firestore.FieldValue.arrayUnion({
            quizId: finalselectedid,
            lessonName: finalselectedlessonname,
            start: startDateTime,
            end: endDateTime,
            
          }),
        });
        toast.success("Quiz added");
      } catch (error) {
        toast.error("Quiz not added");
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchFutureObjects(searchQuery);

    fetchImportantDocs();
    fetchLikeDocs();
    fetchLessonQuiz();
    fetchTeacherFolders();
    // Call the fetchLessonQuiz function with your dynamic values
  }, []);
  return (
    <div className="Schedule-main-div">
      <button className="add-btn-ab" onClick={showModal}>
        Add+
      </button>

      <div className="fetch-sheduled-quizes">
        <Quizes sheduledquizes={sheduledquizes} />
      </div>

      <Modal
        title="Add Schedule"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ display: "flex" }}>
          <div style={{ width: "70%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px",
              }}
            >
              <label>Teacher Folders:</label>
              <Select
                value={selectedFolder}
                onChange={handleFolderSelect}
                style={{ width: "100%" }}
              >
                {teacherFolders?.map((folder) => (
                  <Option key={folder.id} value={folder.id}>
                    {folder.name}
                  </Option>
                ))}
              </Select>
            </div>
            {selectedFolder && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "10px",
                }}
              >
                <label>Select Quiz:</label>
                <Select
                  style={{ width: "100%" }}
                  value={selectedLessonfolder}
                  onChange={handleLessonFolderSelect}
                >
                  {lessonfolderdata?.map((quiz) => (
                    <Option key={quiz.id} value={quiz.lessonName}>
                      {quiz.lessonName}
                    </Option>
                  ))}
                </Select>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px",
              }}
            >
              <label>Important:</label>
              <Select
                value={selectedLesson}
                onChange={handleLessonSelect}
                style={{ width: "100%" }}
              >
                {importantDocs?.map((doc) => (
                  <Option key={doc.id} value={doc.lessonName}>
                    {doc.lessonName}
                  </Option>
                ))}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px",
              }}
            >
              <label>Like:</label>
              <Select
                value={selectedLike}
                onChange={handleLikeSelect}
                style={{ width: "100%" }}
              >
                {likeDocs?.map((doc) => (
                  <Option key={doc.id} value={doc.lessonName}>
                    {doc.lessonName}
                  </Option>
                ))}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px",
              }}
            >
              <label>Saved:</label>
              <Select
                style={{ width: "100%" }}
                value={selectedLessonQuiz}
                onChange={handleLessonQuizSelect}
              >
                {lessonQuizData?.map((quiz) => (
                  <Option key={quiz.id} value={quiz.lessonName}>
                    {quiz.lessonName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontWeight: "bold", color: "blue" }}>
              Selected : {finalselectedlessonname}
            </p>
          </div>
        </div>
        <div className="datepicker-container">
          <div>
            <label htmlFor="" style={{ margin: "10px" }}>
              Enter Starting time
            </label>
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={handleStartDateTimeChange}
            />
          </div>
          {startDateTime && <p>{startDateTime}</p>}

          <label htmlFor="" style={{ margin: "10px" }}>
            Enter ending Date
          </label>
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={handleEndDateTimeChange}
          />
          {endDateTime && <p>{endDateTime}</p>}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "20px",
          }}
        >
          <button
            onClick={SaveData}
            style={{
              backgroundColor: "blue",
              width: "100px",
              marginLeft: "10px",
              color: "white",
              padding: "8px 12px",
              borderRadius: "5px",
            }}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "",
              marginLeft: "10px",
              color: "gray",
              padding: "8px 12px",
              width: "100px",
              borderRadius: "5px",
              border: "1px solid black",
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Schedule;
