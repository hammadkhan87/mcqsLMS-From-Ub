import React, { useEffect, useState } from "react";
import "./Folder.scss";
import Menu from "./Menu/Menu";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useLocation } from "react-router-dom";
import { IoIosImages } from "react-icons/io";
const Folder = ({ item }) => {
  const [quiziz, setQuiziz] = useState([]);

  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // Access specific query parameter values
  const paramName = queryParams.get("folderName");
  const paramId = queryParams.get("id");

  const fetchedQuiziz = async (collectionName) => {
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("refId", "==", id),
        where("foldersName", "==", paramName)
      )
    );
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setQuiziz(newData);
  };

  const handleDelete = async (itemId) => {
    try {
      const docRef = doc(db, "teacherFolders", itemId);
      await deleteDoc(docRef);
      setQuiziz((prevQuiziz) =>
        prevQuiziz?.filter((item) => item.id !== itemId)
      );
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    fetchedQuiziz("teacherFolderQuiz");
    console.log("quizFolder", quiziz);
  }, [paramName]);
  return (
    <div className="mylibrary_created">
      <div className="mylibrary_created_header">
        <div className="mylibrary_created_header_title">{paramName}</div>
        <div className="mylibrary_created_header_dots">
          <Menu
            paramName={paramName}
            paramId={paramId}
            handleDelete={handleDelete}
          />
        </div>
      </div>
      {quiziz.map((item, key) => {
         return (
          <>
            <div key={id} className="mylibrary_created_item">
              {item.lessonImage ? (
                <img
                  className="mylibrary_created_item_img"
                  src={item.lessonImage}
                  alt=""
                />
              ) : (
                <div className="mylibrary_created_item_icon">
                  <IoIosImages className="mylibrary_created_item_icon_el" />
                </div>
              )}
              <div className="mylibrary_created_item_det">
                <div className="mylibrary_created_item_det_dots">
                  {/* <Menu
                    handleLikeQuiz={handleLikeQuiz}
                    handleImportantQuiz={handleImportantQuiz}
                    id={item.id}
                    chapterId={item.chapterId}
                    subject={item.subject}
                    lessonName={item.lessonName}
                    grade={item.grade}
                    lessonImage={item.lessonImage}
                  /> */}
                </div>
                <div className="mylibrary_created_item_det_header">{}</div>
                <div className="mylibrary_created_item_det_name">
                  {item.lessonName}
                </div>
                <div className="mylibrary_created_item_det_det">
                  <div className="mylibrary_created_item_det_det_total">
                    Subject : {item.subject}
                  </div>
                  <div className="mylibrary_created_item_det_det_class">
                    Grade : {item.grade}
                  </div>
                </div>
                <div className="mylibrary_created_item_det_name">
                  {/* {item.chapterId} */}
                </div>
              </div>
            </div>
            <div className="mylibrary_created_item_det_name_line">
              {/* {item.chapterId} */}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default Folder;
