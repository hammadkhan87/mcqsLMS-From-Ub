import React from "react";
import "./Preview.scss";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { toast } from "react-hot-toast";
import { auth, db, firebaseConfig } from "../../../firebase";
import firebase from "firebase/compat/app";
import { LuCopy } from "react-icons/lu";
import "firebase/compat/storage";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

firebase.initializeApp(firebaseConfig);
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
const storage = firebase.storage();

const Preview = ({
  lessonName,
  questions,
  lessonid,
  chapterid,
  lessonimage,
  subject,
  grade,
  totalDuration,
  totalMarks,
  handleClosePreview
}) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(lessonid)
      .then(() => {
        toast.success("Lesson ID copied to clipboard");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const localData = localStorage.getItem("userData");
  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const [showAnswers, setShowAnswers] = useState(false);
  const [totalduration, setDuration] = useState("1.0");
  const [totalmark, setMark] = useState("1.0");
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems((prevItems) =>
        prevItems?.filter((prevItem) => prevItem !== item)
      );
    } else {
      setSelectedItems((prevItems) => [...prevItems, item]);
    }
  };

  const handleShowCorrectAnswers = () => {
    setShowCorrectAnswers(!showCorrectAnswers);
  };

  const handleToggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };
  const handleSelectAll = (e) => {
    e.preventDefault();
    if (selectedItems.length === questions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(questions);
    }
  };

  const storeData = async () => {
    try {
      // Create a document in the "lessons" collection

      if (selectedItems.length <= 0) {
        console.log("enter complete input");
        toast.error("Select the Question");
      } else {
        const timestamp = serverTimestamp();

        const docRef = collection(db, "DynamicQuiz");
        const querySnapshot = await getDocs(query(docRef));

        if (querySnapshot) {
          const docData = {
            chapterid,
            lessonName,
            lessonImage: lessonimage,
            totalMarks: totalmark * selectedItems.length,
            totalDuration: totalduration * selectedItems.length,
            grade,
            subject,
            questions: selectedItems,
            playCounter: "",
            role: role,
            refId: ref_id,
            createdAt: timestamp,
          };

          const newDocRef = await addDoc(docRef, docData);
          //alert();
          toast.success("Quiz added successfully");
          console.log("Data added to Firestore");
        } else {
          //alert("Chapter already exists");
          toast.error("quiz already exists");
          console.log("Duplicate data");
        }
      }
      console.log("Data stored successfully!");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const handleSaveQuiz = () => {
    storeData();
  };
  const addToCodeRoom = async () => {
    try {
      const docRef = await addDoc(collection(db, "coderoom"), {
        lessonid,
        lessonName,
        teacherRef: ref_id,
        started: "no",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleOpen = () => {
    setOpen(true);
    toast.promise(addToCodeRoom(), {
      loading: "Saving...",
      success: <b>Saved to CodeRoom</b>,
      error: <b>Could not save.</b>,
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="preview-main-container">
      {lessonName && (
        <div className="inner-preview-container">
          <div className="inner-preview-container_header">
            <div
              onClick={handleClosePreview}
              className="inner-preview-container_header_icon"
            >
              <AiOutlineClose />
            </div>
            <div className="inner-preview-container_header_img">
              <img
                className="inner-preview-container_header_img_el"
                src={lessonimage}
                alt=""
              />
            </div>
            <div className="lesson-detail">
              <p className="lesson-name-e">{lessonName}</p>
              <div className="right_container">
                <div className="top_div">
                  <button className="play-btn" onClick={handleOpen}>
                    Generate Code
                  </button>
                  <button className="save-btn">
                    Questions :{questions.length}
                  </button>
                </div>
                <div className="bottom-div">
                  {/* <button className="save-btn" onClick={handleSaveQuiz}>
                  Customize
                </button> */}

                  {(role === "Teacher" || role === "Admin") && (
                    <button className="save-btn" onClick={handleSaveQuiz}>
                      Save quiz
                    </button>
                  )}
                  <Link to={`/selfstudy/ground/${lessonid}/${lessonName}?id=${lessonid}`}>
                    <button className="play-btn" >Play</button></Link>

                </div>
              </div>
            </div>
          </div>

          {
            <>
              <div
                className="show-question-min"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <label className="correct-ans">
                  <input
                    type="checkbox"
                    checked={showCorrectAnswers}
                    onChange={handleShowCorrectAnswers}
                  />
                  Show Answers
                </label>

                {(role === "Teacher" || role === "Admin") && (
                  <div className="show-question-min_div">
                    <select
                      defaultValue={"1.0"}
                      onChange={(e) => setDuration(e.target.value)}
                      className="show-question-min_select"
                      required
                    >
                      <option value={"0.5"}>0.5 min</option>
                      <option value={"1.0"}>1.0 min</option>
                      <option value={"1.5"}>1.5 min</option>
                      <option value={"2.0"}>2.0 min</option>
                      <option value={"2.5"}>2.5 min</option>
                      <option value={"3.0"}>3.0 min</option>
                      <option value={"4.0"}>4.0 min</option>
                      <option value={"5.0"}>5.0 min</option>
                    </select>
                    <label
                      htmlFor=""
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "gray",
                        marginBottom: "5px",
                      }}
                    >
                      Duration Per Question?
                    </label>
                  </div>
                )}
                {
                  <div className="show-question-min_div">
                    <select
                      defaultValue={"1"}
                      onChange={(e) => setMark(e.target.value)}
                      className="show-question-min_select"
                      required
                    >
                      <option value={"0.5"}>0.5</option>
                      <option value={"1.0"}>1.0</option>
                      <option value={"1.5"}>1.5</option>
                      <option value={"2.0"}>2.0</option>
                      <option value={"2.5"}>2.5</option>
                      <option value={"3.0"}>3.0</option>
                      <option value={"4.0"}>4.0</option>
                      <option value={"5.0"}>5.0</option>
                    </select>
                    <label
                      htmlFor=""
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "gray",
                        marginBottom: "5px",
                      }}
                    >
                      Marks Per Question?
                    </label>
                  </div>
                }

                {(role === "Teacher" || role === "Admin") && (
                  <button className="selection-div" onClick={handleSelectAll}>
                    Select All
                  </button>
                )}
              </div>

              <div className="show-question-div">
                {questions.map((innerArray, index) => (
                  <div className="single_question" key={index}>
                    <div className="single_question_header">
                      <div className="single_question_header_num">
                        Q {index + 1}
                      </div>
                      {(role === "Teacher" || role === "Admin") && (
                        <label
                          style={{ fontSize: "14px", textAlign: "center" }}
                        >
                          <input
                            style={{ marginRight: "5px" }}
                            type="checkbox"
                            checked={selectedItems.includes(innerArray)}
                            onChange={() => handleSelectItem(innerArray)}
                          />
                        </label>
                      )}
                    </div>

                    <div className="single_question_body">
                      {innerArray.image && (
                        <img
                          src={innerArray.image && innerArray.image}
                          alt="Question"
                          className="single_question_body_img"
                        />
                      )}
                      <div className="single_question_body_text">
                        {innerArray.text}
                      </div>
                    </div>

                    <ul className="single_question_footer">
                      {innerArray.options.map((option, optionIndex) => (
                        <li
                          key={optionIndex}
                          className="single_question_footer_option"
                          style={{
                            color:
                              showCorrectAnswers && option.correct
                                ? "#019267"
                                : "black",
                          }}
                        >
                          {optionIndex + 1}: {option.text}
                          {option.image && (
                            <img
                              src={option.image && option.image}
                              alt=""
                              className="single_question_footer_option_img"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                    {showCorrectAnswers &&
                    innerArray.answerdetail.length > 0 ? (
                      <p style={{ fontSize: "16px", color: "red" }}>
                        Answer Explanation: {innerArray.answerdetail}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
              
            </>
          }
        </div>
      )}

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
                    <div className="preview_modal_container">
                      <div className="preview_modal_container_header">
                        Quiz Code
                      </div>
                      <div className="preview_modal_container_body">
                        <div className="preview_modal_container_body_item1">
                          <div className="preview_modal_container_body_code">
                            <div className="preview_modal_container_body_code_up">
                              Your Code :{" "}
                              <span className="preview_modal_container_body_code_up_c">
                                {lessonid}
                              </span>{" "}
                            </div>
                            <div className="preview_modal_container_body_code_down">
                              This code will also be stored in your Code Room
                            </div>
                          </div>
                          <div className="preview_modal_container_body_code_right">
                            <LuCopy onClick={handleCopy} />
                          </div>
                        </div>
                        <div className="preview_modal_container_body_item2">
                          <div className="preview_modal_container_body_item2_up">
                            http://localhost:3000
                          </div>
                          <div className="preview_modal_container_body_item2_don">
                            To play this quiz. please navigate to the url above
                          </div>
                        </div>
                      </div>
                      <div className="preview_modal_container_footer">
                        <div className="preview_modal_container_footer_btns">
                          <div
                            onClick={handleClose}
                            className="preview_modal_container_footer_close"
                          >
                            Close
                          </div>
                        </div>
                      </div>
                    </div>
                  </Box>
                </Fade>
              </Modal>
    </div>
  );
};

export default Preview;
