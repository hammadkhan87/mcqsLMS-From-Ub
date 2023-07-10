import { useEffect, useState } from "react";
import { db, auth, firebaseConfig } from "../../../firebase";
import { FaSearch } from "react-icons/fa";
import { FiList } from "react-icons/fi";
import { MdGrade } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import firebase from "firebase/compat/app";
import { LuCopy } from "react-icons/lu";
import {
  Query,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import "./CodeRoom.scss";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { ToastBar, toast } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { IoMenuOutline } from "react-icons/io5";
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const CodeRoom = ({ showDrawer }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [quiziz, setQuiziz] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lessons, setLessons] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;
  const [codeRoom, setCodeRoom] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const fetchCodeRoom = async () => {
    try {
      // Use onSnapshot to listen for changes in the collection
      onSnapshot(
        query(
          collection(db, "coderoom"),
          where("teacherRef", "==", id),
          orderBy("createdAt", "desc")
        ),
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            createdAt: doc.data().createdAt, // Include the "createdAt" property
            lessonid: doc.data().lessonid,
          }));
          setCodeRoom(newData);
          // promiseToast.success("Code room fetched successfully");
        }
      );
    } catch (error) {
      console.error("Error fetching code room: ", error);
      // promiseToast.error("Error fetching code room: " + error);
    }
  };
  const fetchLessons = async () => {
    try {
      const lessonIds = codeRoom.map((item) => item.lessonid);
      const querySnapshot = await getDocs(
        query(
          collection(db, "lessonQuiz"),
          where(documentId(), "in", lessonIds)
        )
      );

      const lessonsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort the lessons based on the coderoom createdAt field in descending order
      const sortedLessons = lessonsData.sort((a, b) => {
        const coderoomA = codeRoom.find((item) => item.lessonid === a.id);
        const coderoomB = codeRoom.find((item) => item.lessonid === b.id);
        return coderoomB.createdAt - coderoomA.createdAt;
      });

      setLessons(sortedLessons);
      // promiseToast.success("Lessons fetched successfully");
    } catch (error) {
      console.error("Error fetching lessons: ", error);
      // promiseToast.error("Error fetching lessons: " + error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    fetchCodeRoom();
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [codeRoom]);

  useEffect(() => {
    // if (searchTerm?.length > 2) {
    const fetchData = async () => {
      await fetchCodeRoom();
      await fetchLessons();
    };

    fetchData();
    // }
  }, [searchTerm, selectedGrades, selectedSubjects]);

  const handleDeleteLesson = async (event, lessonId) => {
    event.stopPropagation(); // Prevent event propagation
    try {
      const querySnapshot = await getDocs(collection(db, "coderoom"));
      querySnapshot.forEach(async (doc) => {
        const lesson = doc.data();
        if (lesson.lessonid === lessonId) {
          await deleteDoc(doc.ref);
          console.log("Lesson deleted successfully");
          toast.success("Lesson deleted successfully");

          // Remove the deleted lesson from the lessons state array
          setLessons((prevLessons) =>
            prevLessons?.filter((lesson) => lesson?.id !== lessonId)
          );
        }
      });
    } catch (error) {
      console.error("Error deleting lesson: ", error);
    }
  };
  return (
    <div className="coderoom_created">
      <div className="mylibrary_sidebar_title_menu" onClick={showDrawer}>
        <IoMenuOutline />
      </div>
      <div
        className="coderoom_explore_search-bar"
        //  onClick={(e) => RedirectPage(e)}
      >
        <div className="coderoom_explore_search-input-container">
          <FaSearch className="coderoom_explore_search-icon" />
          <input
            // value={searchTerm}
            type="text"
            className="coderoom_explore_search-input"
            placeholder="Search Quiz..."
            // onChange={handleSearch}
          />
        </div>
        <button
          className="coderoom_explore_search-button"
          // onClick={() => fetchLessons()}
        >
          Search
        </button>
      </div>
      <div className="coderoom_left-side-container">
        <div className="coderoom_total-results">
          <p>{lessons.length} Codes</p>
        </div>

        <div className="coderoom_result-container">
          {lessons.map((lesson, index) => {
            const codeRoomData = codeRoom.find(
              (item) => item.lessonid === lesson?.id
            );
            const createdAt = codeRoomData
              ? codeRoomData.createdAt.toDate()
              : null;
            let createdAtFormatted = "";
            if (createdAt) {
              const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              };
              createdAtFormatted = createdAt.toLocaleDateString(
                undefined,
                options
              );
            }
            return (
              <div className="coderoom_result-card-main" key={index}>
                <Link
                  to={`${lesson?.id}?lessonId=${lesson?.id}&codeId=${codeRoomData?.id}`}
                  className="coderoom_div-img"
                >
                  <img
                    src={lesson.lessonImage}
                    alt={lesson.lessonName}
                    className="coderoom_lesson-img"
                  />
                </Link>
                <div className="coderoom_coderoom_created_item_det_dots">
                  <div
                    className="coderoom_coderoom_gen delete_icon"
                    // onClick={(event) => {
                    //   toast.promise(handleDeleteLesson(event, lesson.id), {
                    //     loading: "Deleting...",
                    //     success: <b>Deleting</b>,
                    //     error: <b>Could not save.</b>,
                    //   });
                    // }}
                    // onClick={(event) => handleDeleteLesson(event, lesson?.id)}
                    onClick={handleOpen}
                  >
                    <RiDeleteBin6Line className="coderoom_coderoom_gen_icon" />
                  </div>
                </div>
                <div className="coderoom_card-content">
                  <Link
                    to={`${lesson?.id}?lessonId=${lesson?.id}&codeId=${codeRoomData?.id}`}
                    className="coderoom_lesson-name-text"
                  >
                    {lesson.lessonName}
                  </Link>
                  <div className="coderoom_inner-card-content">
                    <div className="coderoom_text-a created_at">
                      <AiOutlineClockCircle className="coderoom_icon" />
                      <p className="coderoom_text-a-t"> Created:</p>
                      <p className="coderoom_text-a-d">{createdAtFormatted}</p>
                    </div>
                    <div className="coderoom_text-a">
                      <div className="coderoom_text-a-t">Code:</div>
                      <p className="coderoom_text-a-d"> {codeRoomData?.id}</p>
                    </div>
                  </div>
                </div>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Fade in={open}>
                    <Box sx={style} className="modal_main_box">
                      <div className="coderoom_modal_container">
                        <div className="coderoom_modal_container_header">
                          Delete
                        </div>
                        <div className="coderoom_modal_container_header2">
                          {/* <div className="coderoom_modal_container_header2_line"></div> */}
                          <div className="coderoom_modal_container_header2_title">
                            Are you sure you want to delete the quiz
                          </div>
                        </div>

                        <div className="coderoom_modal_container_footer">
                          <div className="coderoom_modal_container_footer_btns">
                            <div
                              className="coderoom_modal_container_footer_close"
                              onClick={handleClose}
                            >
                              Cancel
                            </div>
                            <div
                              className="coderoom_modal_container_footer_del"
                              onClick={(event) =>
                                handleDeleteLesson(event, lesson?.id)
                              }
                            >
                              Delete
                            </div>
                          </div>
                        </div>
                      </div>
                    </Box>
                  </Fade>
                </Modal>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodeRoom;
