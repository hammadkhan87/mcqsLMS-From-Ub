import React, { useEffect } from "react";
import "./SelfSingleChapter.scss";
import { Link } from "react-router-dom";
import { Button, Modal } from "antd";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
const SelfSingleChapter = ({ lessons, element, result, isLogin,grade }) => {
  const localData = localStorage.getItem("userData");
  const userId = localData ? JSON.parse(localData).userId : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredLessonsArray, setFilteredLessonsArray] = useState([]);
  const [lessonsArrayWithResult, setLessonsArrayWithResult] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState({});
  const showModal = (item) => {
    setIsModalOpen(true);
    setSelectedLesson(item);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const id = element.id;
  const filteredLessons = lessons.filter((lesson) => {
    return lesson.chapterId == id && lesson.grade == grade ;
  });
  const filteredResult = result.filter((item) => {
    return item.userId == userId;
  });

  // Function to retrieve lessons with stored results
  const getLessonsWithResults = async () => {
    try {
      // Array to store lessons with results
      const lessonsWithResults = [];

      // Get the query snapshot of lessons for the provided chapter ID
      const lessonsSnapshot = await getDocs(
        query(
          collection(db, "lessonQuiz"),
          where("chapterId", "==", element.id),
          where("grade", "array-contains", grade)

        )
      );

      // Iterate through the lessons
      for (const lessonDoc of lessonsSnapshot.docs) {
        const lessonId = lessonDoc.id;

        // Check if a result exists for the lesson
        const resultQuerySnapshot = await getDocs(
          query(
            collection(db, "result"),
            where("lessonId", "==", lessonId),
            where("userId", "==", userId)
          )
        );

        if (!resultQuerySnapshot.empty) {
          // Result exists, add the lesson to the array
          const lessonData = lessonDoc.data();
          setFilteredLessonsArray(
            lessonsWithResults.push({ id: lessonId, ...lessonData })
          );
        }
      }

      // Return the lessons with results
      return lessonsWithResults;
    } catch (error) {
      console.error("Error retrieving lessons with results:", error);
      return [];
    }
  };

  useEffect(() => {
    getLessonsWithResults();
  }, []);
  return (
    <div className="selfsinglechapter_container">
      <div className="selfsinglechapter_container_heading">
        {element.title}{" "}
        <span className="selfsinglechapter_container_heading_num">
          {isLogin &&
            `${filteredLessonsArray > 0 ? filteredLessonsArray : "0"}/ ${filteredLessons.length}`}
        </span>
      </div>
      <div className="selfsinglechapter_container_heading_lessons">
        {filteredLessons.map((lesson, key) => {
          const res = filteredResult.find((item) => {
            return item.lessonId == lesson.id;
          });
          let color = "red";
          if ((res?.percentage > 75) & (res?.percentage <= 100)) {
            color = "green";
          } else if ((res?.percentage > 50) & (res?.percentage <= 75)) {
            color = "orange";
          } else if ((res?.percentage >= 0) & (res?.percentage <= 50)) {
            color = "red";
          }
          return (
            <>
              <div
                key={key}
                onClick={() => showModal(lesson)}
                className="selfsinglechapter_container_lesson"
              >
                <p className="selfsinglechapter_container_lesson_name">
                  <Link to={`/selfstudy/ground/${lesson?.id}/${lesson?.lessonName}?id=${lesson?.id}`}>
                    {lesson?.lessonName}
                  </Link>
                </p>
                {res && (
                  <p
                    className={`selfsinglechapter_container_lesson_score ${color}`}
                  >
                    {res?.percentage}%
                  </p>
                )}
              </div>

              <Modal
                title=""
                className="self_modal"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div className="self_modal_header">
                  <img src={selectedLesson?.lessonImage} alt="" />
                </div>
                <div className="self_modal_body">
                  <div className="self_modal_body_length">
                    Total Question {selectedLesson?.questions?.length}
                  </div>
                  <div className="self_modal_body_difficulty"></div>
                  <Link
                    to={`/selfstudy/ground/${selectedLesson?.id}/${selectedLesson?.lessonName}?id=${selectedLesson?.id}`}
                  >
                    <div className="self_modal_body_play">Play</div>
                  </Link>
                </div>
              </Modal>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default SelfSingleChapter;
