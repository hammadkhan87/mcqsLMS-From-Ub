import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useEffect, useState } from "react";
import { IoIosImages } from "react-icons/io";

const Important = () => {
  const [quiziz, setQuiziz] = useState([]);
  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;
  const fetchedQuiziz = async (collectionName) => {
    const querySnapshot = await getDocs(
      query(collection(db, collectionName), where("userId", "==", id),where("Folder","==","Important"))
    );
    const newData = querySnapshot.docs.map((doc) => ({
      // ...doc.data(),
      lessonName: doc.data().lessonName,
      lessonImage: doc.data().lessonImage,
      grade: doc.data().grade,
      subject: doc.data().subject,
      id: doc.id,
    }));
    setQuiziz(newData);
  };

  useEffect(() => {
    fetchedQuiziz("lessonQuiz");
  }, []);
  return (
    <div className="mylibrary_created">
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

export default Important;
