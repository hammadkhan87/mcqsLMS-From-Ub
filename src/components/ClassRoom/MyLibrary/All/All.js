import "./All.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoIosImages } from "react-icons/io";
const All = () => {
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
  const handleLikeQuiz = async (
    quizId,
    chapterId,
    subject,
    lessonName,
    grade,
    lessonImage
  ) => {
    try {
      const likesCollectionRef = collection(db, "likes");
      await addDoc(likesCollectionRef, {
        quizId,
        userId: id,
        chapterId,
        subject,
        lessonName,
        grade,
        lessonImage,
      });
      console.log("Quiz added to likes collection");
    } catch (error) {
      console.error("Error adding quiz to likes collection:", error);
    }
  };
  const handleImportantQuiz = async (
    quizId,
    chapterId,
    subject,
    lessonName,
    grade,
    lessonImage
  ) => {
    try {
      const likesCollectionRef = collection(db, "important");
      await addDoc(likesCollectionRef, {
        quizId,
        userId: id,
        chapterId,
        subject,
        lessonName,
        grade,
        lessonImage,
      });
      console.log("Quiz added to likes collection");
    } catch (error) {
      console.error("Error adding quiz to likes collection:", error);
    }
  };
  return (
    <div className="mylibrary_created">
      {quiziz.map((item, index) => {
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

export default All;
