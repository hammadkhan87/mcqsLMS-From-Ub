import React, { useState, useEffect } from "react";
import "./SingleChapter.scss";
import { Button, Modal } from "antd";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  
} from "firebase/firestore";
import { db, firebaseConfig } from "../../../../firebase";
import firebase from "firebase/compat/app";
import { toast } from "react-hot-toast";

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const SingleChapter = ({ chapterName, grade }) => {
  const [chapters, setChapters] = useState([]);
  const [lessonsa, setLessonsa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonimage, setLessonimage] = useState(null);
  const [updatedname, setUpdatedName] = useState("");
  const [filterArray, setFilterArray] = useState([]);
  const [change,setChange] = useState("")

  const handleInputimage = (e) => {
    setLessonimage(e.target.files[0]);
  };

  const handleLessonName = (e) => {
    setUpdatedName(e.target.value);
  };

  const showModal = (value) => {
    setUpdatedName(value);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setUpdatedName("");
    setLessonimage(null);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setUpdatedName("");
    setLessonimage(null);
    setIsModalOpen(false);
  };

  const updateLesson = async (id) => {
    try {
      const lessonRef = doc(db, "lessonQuiz", id);
      const updatedData = {};

      if (updatedname) {
        updatedData.lessonName = updatedname;
      }

      if (lessonimage) {
        const lessonimgname = lessonimage.name;
        const storageRef = firebase.storage().ref();
        const imageRef = await storageRef
          .child(`lessonImages/${lessonimgname}`)
          .put(lessonimage);
        const imageURL = await storage
          .ref("lessonImages")
          .child(lessonimgname)
          .getDownloadURL();
        updatedData.lessonImage = imageURL;
      }

      await updateDoc(lessonRef, updatedData);
      toast.success("Data Updated");
      console.log("update successfully");
      setChange("aaa")

      handleCancel();
    } catch (error) {
      toast.error("Error updating lesson");
      console.error("Error updating lesson:", error);
    }
  };

  const deleteLesson = async (id) => {
    try {
      const lessonRef = doc(db, "lessonQuiz", id);
      await deleteDoc(lessonRef);
      toast.success("Lesson deleted successfully");
      console.log("Lesson deleted successfully");
      setChange("dd")
    } catch (error) {
      toast.error("Error deleting lesson");
      console.error("Error deleting lesson:", error);
    }
  };

  const deleteChapter = async (chapterId) => {
    try {
      const chapterRef = doc(db, "chapters", chapterId);
      const chapterQuery = query(
        collection(db, "lessonQuiz"),
        where("chapterId", "==", chapterId)
      );
      const chapterSnapshot = await getDocs(chapterQuery);

      const confirmation = window.confirm(
        "Are you sure you want to delete this chapter and its associated lessons?"
      );
      if (!confirmation) {
        console.log("Deletion canceled");
        return;
      }

      if (chapterSnapshot.empty) {
        await deleteDoc(chapterRef);
        console.log("Chapter deleted successfully");
        setChange("aba")

      } else {
        chapterSnapshot.forEach(async (snapshot) => {
          const lessonRef = doc(db, "lessonQuiz", snapshot.id);
          await deleteDoc(lessonRef);
        });

        await deleteDoc(chapterRef);
        console.log("Chapter and associated lessons deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const fetchedDataChapters = async (collectionName) => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, collectionName));
  //     const newData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     setChapters(newData);
  //   } catch (error) {
  //     console.error("Error fetching chapters:", error);
  //   }
  // };
  try {
      
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("subject", "==", chapterName),
        where("grade", "array-contains", grade)
        )
    );

    const newData = querySnapshot.docs.map((doc) => ({
      title: doc.data().title, // Retrieve only the 'title' field
      id: doc.id,
    }));

    //  console.log(newData);
    setChapters(newData);
    setFilterArray(newData);
    fetchedDataLessons("lessonQuiz", newData);

  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Error fetching Chapters")
  }
};


  const fetchedDataLessons = async (collectionName,filterArray) => {
    try {
      // const querySnapshot = await getDocs(collection(db, collectionName));
      // const newData = querySnapshot.docs.map((doc) => ({
      //   ...doc.data(),
      //   id: doc.id,
      // }));
      const filterIds = filterArray?.map((item) => item.id);
      if (filterIds && filterIds.length > 0) {

      const querySnapshot = await getDocs(
        query(collection(db, collectionName), where("chapterId", "in", filterIds))
      );
      console.log(querySnapshot.docs)
      const newData = querySnapshot.docs.map((doc) => ({
        // ...doc.data(),
        lessonName: doc.data().lessonName,
        chapterId: doc.data().chapterId,
        lessonImage: doc.data().lessonImage,
        id: doc.id,
      }));
      setLessonsa(newData);
    }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    fetchedDataChapters("chapters");

  }, [change,chapterName,grade]);

  // useEffect(() => {
  //   const filteredData = chapters.filter((chap) => {
  //     return chap.subject === chapterName && chap.grade.includes(grade);
  //   });
  //   setFilterArray(filteredData);
  // }, [chapters, chapterName, grade]);

  return (
    <> 
   {  lessonsa && filterArray?.map((element, key) => {
           const id = element.id;
        const filteredLessons = lessonsa.filter((lessona) => {
          return lessona.chapterId === id;
        });
        
         console.log(filteredLessons)
         console.log(lessonsa)
        return (
          <div className="selfsinglechapter_container" key={key}>
            <div className="selfsinglechapter_container_heading">
              {element.title}
              <button
                className="chp-delete"
                onClick={() => deleteChapter(element.id)}
              >
                Delete
              </button>
            </div>
            <div className="selfsinglechapter_container_heading_lessons">
              {filteredLessons?.map((lesson, key) => {
                return (
                  <div key={key} className="selfsinglechapter_container_lesson">
                    <div className="innerSingleChapter_container">
                      <p className="lesson_name_p">{lesson.lessonName}</p>
                      <div>
                        <button
                          className="btnac btne-edit"
                          onClick={() => showModal(lesson.lessonName)}
                        >
                          EditLesson
                        </button>
                        <button
                          className="btnac btne-delete"
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <Modal
              title=""
              className="self_modal"
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className="self_modal_header">
                <img
                  src={
                    lessonimage
                      ? URL.createObjectURL(lessonimage)
                      : lesson.lessonImage
                  }
                  alt=""
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleInputimage}
              />
              <div className="self_modal_body">
                <input
                  type="text"
                  value={updatedname}
                  onChange={handleLessonName}
                ></input>

                <div className="self_modal_body_difficulty">
                  <button
                    className="btnb btn-update"
                    onClick={() => updateLesson(lesson.id)}
                  >
                    Update Lesson
                  </button>
                  <button className="btnb btn-cancle" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
                  </div>
                  
                );
              })}
            </div>
         
          </div>
        );
      })}
    </>
  );
};

export default SingleChapter;
