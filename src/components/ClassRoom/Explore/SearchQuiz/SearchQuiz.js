import React, { useState, useEffect } from "react";
import "./SearchQuiz.scss";
import { FaSearch } from "react-icons/fa";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { FiList } from "react-icons/fi";
import { MdGrade } from "react-icons/md";
import Preview from "./Preview/Preview";
import { useLocation, useNavigate } from "react-router-dom";
import { query } from "firebase/firestore";
import { duration } from "@mui/material";
import { firebaseConfig } from "../../../../firebase";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { IoArrowBackSharp } from "react-icons/io5";
firebase.initializeApp(firebaseConfig);
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const storage = firebase.storage();

const SearchQuiz = () => {
  const localData = localStorage.getItem("userData");
  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  //   setSearchTerm(searchQuery)

  const [searchTerm, setSearchTerm] = useState("");
  const [lessons, setLessons] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [lessonName, setLessonName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [lessonid, setLessonid] = useState("");
  const [chapterid, setChapterid] = useState("");
  const [totalmarks, setTotalMarks] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [lessonimage, setLessonImage] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [open, setOpen] = useState(false);
  const navigate=useNavigate()
  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };
  console.log(searchQuery);
  const fetchLessons = async () => {
    const lessonSnapshot = await firebase
      .firestore()
      .collection("lessonQuiz")
      .where("quizType", "in", ["self", "public"])
      .get();

    const searchedLessons = lessonSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((lesson) => {
        const gradeMatch =
          selectedGrades.length === 0 || selectedGrades.includes(lesson.grade);
        const subjectMatch =
          selectedSubjects.length === 0 ||
          selectedSubjects.includes(lesson.subject);
        const nameMatch = lesson.lessonName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return gradeMatch && subjectMatch && nameMatch;
      });

    setLessons(searchedLessons);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGradeChange = (event) => {
    const grade = event.target.value;
    if (event.target.checked) {
      setSelectedGrades((prevGrades) => [...prevGrades, grade]);
    } else {
      setSelectedGrades((prevGrades) => prevGrades?.filter((g) => g !== grade));
    }
  };

  const handleSubjectChange = (event) => {
    const subject = event.target.value;
    if (event.target.checked) {
      setSelectedSubjects((prevSubjects) => [...prevSubjects, subject]);
    } else {
      setSelectedSubjects((prevSubjects) =>
        prevSubjects?.filter((s) => s !== subject)
      );
    }
  };

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchLessons();
    }
  }, [searchTerm, selectedGrades, selectedSubjects]);
  const handlecardclick = (
    name,
    question,
    id,
    chapid,
    img,
    sub,
    grade,
    duration,
    mark
  ) => {
    if (window.innerWidth < 700) {
      handleOpenPreview();
    }

    setLessonName(name);
    setQuestions(question);
    setLessonid(id);
    setChapterid(chapid);
    setLessonImage(img);
    setSubject(sub);
    setGrade(grade);
    setTotalDuration(duration);
    setTotalMarks(mark);
  };

  useEffect(() => {}, [
    lessonid,
    chapterid,
    lessonName,
    questions,
    handlecardclick,
  ]);

  return (
    <>
      <div className="explore_search-quiz-main-container">
        <h2 className="explore_search-title">
          <div className="explore_search-title_back" onClick={()=>navigate("/classroom/explore")}>
            <IoArrowBackSharp/>
          </div>
        </h2>
        <div className="explore_search-bar-main">
          <div className="explore_search-bar">
            <div className="explore_search-input-container">
              <FaSearch className="explore_search-icon" />
              <input
                value={searchTerm}
                type="text"
                className="explore_search-input"
                placeholder="Search Quiz..."
                onChange={handleSearch}
              />
            </div>
            <button
              className="explore_search-button"
              onClick={() => fetchLessons()}
            >
              Search
            </button>
          </div>
        </div>
        <div className="explore_inner-main-container">
          <div className="explore_left-side-1">
            <div className="explore_filter-section">
              <h5>Filter Result: </h5>
              <div className="explore_filter-container">
                <label>
                  <input
                    type="checkbox"
                    value="K"
                    checked={selectedGrades.includes("K")}
                    onChange={handleGradeChange}
                  />
                  KG
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="1"
                    checked={selectedGrades.includes("1")}
                    onChange={handleGradeChange}
                  />
                  1st
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="2"
                    checked={selectedGrades.includes("2")}
                    onChange={handleGradeChange}
                  />
                  2nd
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="3"
                    checked={selectedGrades.includes("3")}
                    onChange={handleGradeChange}
                  />
                  3rd
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="4"
                    checked={selectedGrades.includes("4")}
                    onChange={handleGradeChange}
                  />
                  4th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="5"
                    checked={selectedGrades.includes("5")}
                    onChange={handleGradeChange}
                  />
                  5th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="6"
                    checked={selectedGrades.includes("6")}
                    onChange={handleGradeChange}
                  />
                  6th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="7"
                    checked={selectedGrades.includes("7")}
                    onChange={handleGradeChange}
                  />
                  7th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="8"
                    checked={selectedGrades.includes("8")}
                    onChange={handleGradeChange}
                  />
                  8th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="9"
                    checked={selectedGrades.includes("9")}
                    onChange={handleGradeChange}
                  />
                  9th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="10"
                    checked={selectedGrades.includes("10")}
                    onChange={handleGradeChange}
                  />
                  10th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="11"
                    checked={selectedGrades.includes("11")}
                    onChange={handleGradeChange}
                  />
                  11th
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="12"
                    checked={selectedGrades.includes("12")}
                    onChange={handleGradeChange}
                  />
                  12th
                </label>
              </div>
              <div className="explore_filter-container">
                <label>
                  <input
                    type="checkbox"
                    value="math"
                    checked={selectedSubjects.includes("math")}
                    onChange={handleSubjectChange}
                  />
                  Math
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="language art"
                    checked={selectedSubjects.includes("language art")}
                    onChange={handleSubjectChange}
                  />
                  Language Art
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="science"
                    checked={selectedSubjects.includes("science")}
                    onChange={handleSubjectChange}
                  />
                  Science
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="socialstudy"
                    checked={selectedSubjects.includes("socialstudy")}
                    onChange={handleSubjectChange}
                  />
                  Socialstudies
                </label>
              </div>
            </div>
          </div>
          <div className="explore_inner-main-container_bottom">
            <div className="explore_left-side-container">
              <div className="explore_total-results">
                <p>{lessons.length} Results</p>
              </div>

              <div className="explore_result-container">
                {lessons.map((lesson, index) => {
                  console.log(lesson, "Biglesson");
                  return (
                    <div
                      className="explore_result-card-main"
                      key={index}
                      onClick={() =>
                        handlecardclick(
                          lesson.lessonName,
                          lesson.questions,
                          lesson.id,
                          lesson.chapterId,
                          lesson.lessonImage,
                          lesson.subject,
                          lesson.grade,
                          lesson.totalDuration,
                          lesson.totalMarks
                        )
                      }
                    >
                      <div className="explore_div-img">
                        <img
                          src={lesson.lessonImage}
                          alt={lesson.lessonName}
                          className="explore_lesson-img"
                        />
                      </div>
                      <div className="explore_card-content">
                        <p className="explore_lesson-name-text">
                          {lesson.lessonName}
                        </p>
                        <div className="explore_inner-card-content">
                          <div className="explore_text-a">
                            <FiList className="explore_icon" />
                            <p className="explore_text-a">
                              {" "}
                              {lesson.questions.length} Questions
                            </p>
                          </div>
                          <div className="explore_text-a">
                            <MdGrade className="explore_icon" />{" "}
                            <p>{lesson.grade} Grade</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="explore_right-side-container">
              <div className="explore_text-Preview">
                <p>Preview</p>
              </div>
              <Preview
                lessonName={lessonName}
                questions={questions}
                lessonid={lessonid}
                chapterid={chapterid}
                lessonimage={lessonimage}
                subject={subject}
                grade={grade}
                totalDuration={totalDuration}
                totalMarks={totalmarks}
                
              />
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClosePreview}
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
                    <Preview
                      lessonName={lessonName}
                      questions={questions}
                      lessonid={lessonid}
                      chapterid={chapterid}
                      lessonimage={lessonimage}
                      subject={subject}
                      grade={grade}
                      totalDuration={totalDuration}
                      totalMarks={totalmarks}
                      handleClosePreview={handleClosePreview}
                    />
                  </Box>
                </Fade>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchQuiz;
