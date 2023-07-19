import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useEffect, useState } from "react";
import { IoIosImages } from "react-icons/io";

const Liked = () => {
  const [quiziz, setQuiziz] = useState([]);
  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;
  const fetchedQuiziz = async () => {
    const lessonQuizRef = collection(db, "lessonQuiz");
    const q = query(
      lessonQuizRef,
      where("Folder", "==", "Like"),
      where("refId", "==", id)
    );
    const snapshot = await getDocs(q);
    const data = snapshot?.docs?.map((doc) => (
      {
        lessonName: doc.data().lessonName,
        lessonImage: doc.data().lessonImage,
        grade: doc.data().grade,
        subject: doc.data().subject,
        id: doc.id,
        //  ...doc.data() 
      }));
    setQuiziz(data);
  };

  useEffect(() => {
    fetchedQuiziz();
    // console.log(quiziz, "liked");
  }, []);
  return (
    <div className="mylibrary_created">
      {quiziz.map((item,key) => {
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

export default Liked;
