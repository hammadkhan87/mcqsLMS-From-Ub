import Menu from "./Menu/Menu";
import "./CreatedByMe.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addDoc } from "firebase/firestore";
import { IoIosImages } from "react-icons/io";
import { useEffect, useState } from "react";
const CreatedByMe = () => {
  const [quiziz, setQuiziz] = useState([]);
  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;

  const fetchedQuiziz = async (collectionName) => {
    const querySnapshot = await getDocs(
      query(collection(db, collectionName), where("refId", "==", id))
    );
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setQuiziz(newData);
  };

  useEffect(() => {
    fetchedQuiziz("lessonQuiz");
  }, []);
  console.log(quiziz, "quiziz");
  const handleLikeQuiz = async (
    subject,
    lessonName,
    grade,
    lessonImage,
    questions,
    quizType,
    refId,
    role,
    totalDuration,
    totalMarks,
    createdAt
  ) => {
    console.log(questions, "function questions");
    console.log(quizType, "function quizTypes");

    console.log(refId, "function refId");

    if (Array.isArray(questions)) {
      try {
        const likesCollectionRef = collection(db, "lessonQuiz");
        await addDoc(likesCollectionRef, {
          userId: id,
          subject,
          lessonName,
          grade,
          lessonImage,
          questions,
          quizType,
          refId,
          role,
          totalDuration,
          totalMarks,
          createdAt,
          Folder: "Like",
        });
        console.log("Quiz added to likes collection");
      } catch (error) {
        console.error("Error adding quiz to likes collection:", error);
      }
    } else {
      console.error("Invalid data: questions is not an array");
    }
  };
  const handleImportantQuiz = async (
    quizId,
    subject,
    lessonName,
    grade,
    lessonImage,
    questions,
    quizType,
    refId,
    role,
    totalDuration,
    totalMarks,
    createdAt
  ) => {
    try {
      const likesCollectionRef = collection(db, "lessonQuiz");
      await addDoc(likesCollectionRef, {
        quizId,
        userId: id,
        subject,
        lessonName,
        grade,
        lessonImage,
        questions,
        quizType,
        refId,
        role,
        totalDuration,
        totalMarks,
        createdAt,
        Folder: "Important",
      });
      console.log("Quiz added to likes collection");
    } catch (error) {
      console.error("Error adding quiz to likes collection:", error);
    }
  };
  return (
    <div className="mylibrary_created">
      {quiziz.map((item, id) => {
        console.log(item.quizType, "item.quizTypeM");
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
                  <Menu
                    handleLikeQuiz={handleLikeQuiz}
                    handleImportantQuiz={handleImportantQuiz}
                    id={item?.id}
                    subject={item?.subject}
                    lessonName={item?.lessonName}
                    grade={item?.grade}
                    lessonImage={item?.lessonImage}
                    questions={item?.questions}
                    quizType={item?.quizType ||null}
                    refId={item?.refId}
                    role={item?.role}
                    totalDuration={item?.totalDuration}
                    totalMarks={item?.totalMarks}
                    createdAt={item?.createdAt}
                  />
                </div>
                <div className="mylibrary_created_item_det_header">{}</div>
                <div className="mylibrary_created_item_det_name">
                  {item?.lessonName}
                </div>
                <div className="mylibrary_created_item_det_det">
                  <div className="mylibrary_created_item_det_det_total">
                    Subject : {item?.subject}
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

export default CreatedByMe;
