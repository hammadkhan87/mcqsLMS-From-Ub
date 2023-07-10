import React from "react";
import "./CreateQuiz.scss";
import { useState } from "react";
import { Button, Modal } from "antd";
import AddQuestion from "./AddQusions/AddQuestion";
import { auth, db, firebaseConfig } from "../../../firebase";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { RiImageAddLine } from "react-icons/ri";
import{IoMenuOutline} from "react-icons/io5"

import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import FillinBlanks from "./FillInBlanks/FillinBlanks";
import Draganddrop from "./DragandDrop/Draganddrop";
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const CreateQuiz = ({showDrawer}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const [chapterRefId, setChapterRefId] = useState(null);
  const [selected_book, setSelected_book] = useState("");
  // const [chapter, setChapter] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [look, setlook] = useState(true);
  const [lookfill, setlookFill] = useState(true);
  const [lookDragdrop, setlookDragdrop] = useState(true);
  const [open, setOpen] = useState(false);
  const [openDragdrop, setOpenDragdrop] = useState(false);
  const [openFill, setOpenFill] = useState(false);
  const [mark, setMark] = useState("1");
  const [lessonimage, setLessonImage] = useState(null);
  const [duration, setDuration] = useState("1");
  const [lessonName, setLessonName] = useState("");
  const [AllQuestions, setAllQuestions] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  // const [chapters, setChapters] = useState([]);
  const [foldersName, setFoldersName] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [filterArray, setFilterArray] = useState([]);
  const [showlessonimage, setShowlessonimage] = useState(null);
  const localData = localStorage.getItem("userData");
  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  console.log(role);
  // let chapterName;
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setLessonImage(file);
    setShowlessonimage(URL.createObjectURL(file));
  };

  const options = filterArray.map((item) => item.title);

  // Fetching Folders Name
  const fetchFoldersName = async (collectionName) => {
    try {
      const studentsCollectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(
        query(studentsCollectionRef, where("userId", "==", ref_id))
      );
      const names = querySnapshot.docs.map((doc) => doc.data());

      setFoldersName(names);
    } catch (error) {
      console.error("Error fetching student names:", error);
    }
  };
  console.log("folders: " + foldersName);
  console.log("ref_id: " + ref_id);
  const handleSelectFolderChange = (event) => {
    setSelectedFolder(event.target.value);
  };

  const fetchedData = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // setChapters(newData);
  };

  useEffect(() => {
    // fetchedData("chapters");
    fetchFoldersName("teacherFolders");
  }, []);

  // useEffect(() => {
  //   const filteredData = chapters.filter((chap) => {
  //     return (
  //       chap.subject == selected_book && chap.grade.includes(selectedOptions)
  //     );
  //   });
  //   setFilterArray(filteredData);
  // }, [chapters, selected_book, selectedOptions]);
  // console.log(filterArray);

  const handleSelectAll = (e) => {
    e.preventDefault();
    setSelectedItems(AllQuestions);
  };

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems((prevItems) =>
        prevItems.filter((prevItem) => prevItem !== item)
      );
    } else {
      setSelectedItems((prevItems) => [...prevItems, item]);
    }
  };

  const handleShowCorrectAnswers = () => {
    setShowCorrectAnswers(!showCorrectAnswers);
  };

  const updateParentArray = (newData) => {
    setAllQuestions([...AllQuestions, ...newData]); // Update the parent array with the new data
    console.log(AllQuestions);
  };

  const showModal = () => {
    setOpen(true);
    setlook(true);
  };
  const showModalFill = () => {
    setOpenFill(true);
    setlookFill(true);
  };
  const showModalDragdrop = () => {
    setOpenDragdrop(true);
    setlookDragdrop(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleOkFill = () => {
    setOpenFill(false);
  };
  const handleOkDragdrop = () => {
    setOpenDragdrop(false);
  };

  const handleCancelFill = () => {
    setOpenFill(false);
  };
  const handleCancelDragdrop = () => {
    setOpenDragdrop(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleAdd = () => {
    setlook(true);
  };
  const handleAddFill = () => {
    setlookFill(true);
  };
  const handleAddDragdrop = () => {
    setlookDragdrop(true);
  };
  const handleRerturnFill = () => {
    setlookFill(false);
  };
  const handleRerturnDragdrop = () => {
    setlookDragdrop(false);
  };
  const handleRerturn = () => {
    setlook(false);
  };
  const handleOptionChange = (event) => {
    // setChapter(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setSelectedOptions(event.target.value);
  };
  // useEffect(() => {
  //   const chapterr = filterArray.find((chap) => chap.title === chapter);
  //   if (chapterr) {
  //     setChapterRefId(chapterr.id);
  //   } else {
  //     console.log("No chapter found with the given title.");
  //   }
  //   console.log(chapterRefId);
  //   console.log(lessonimage);
  // }, [options]);

  const storeData = async (
    // chapterId,
    lessonName,
    lessonImage,
    totalMarks,
    totalDuration,
    quizType,
    questions
  ) => {
    try {
      // Upload lesson image to Firebase Storage (if it exists)
      let imageURL = "";
      if (lessonImage) {
        // const metadata = {
        //   contentType: 'image/jpeg'
        // };
        // const imageRef = storageRef.child(`lessonImages/${lessonImage.name}`);
        // await imageRef.put(lessonImage);
        ///imageURL = await storageRef.getDownloadURL();
        console.log("qustionsin", questions);
        let lessonimgname = lessonImage.name;
        const storageRef = firebase.storage().ref();
        const imageRef = await storageRef
          .child(`lessonImages/${lessonimgname}`)
          .put(lessonImage);
        imageURL = await storage
          .ref("lessonImages")
          .child(lessonimgname)
          .getDownloadURL();
      }

      // Upload question and option images to Firebase Storage (if they exist)
      const uploadQuestionImages = async (data) => {
        const uploadedData = [];
        console.log(data);

        for (const item of data) {
          console.log(item.image);

          let itemImageURL = "";
          console.log(item.image);
          if (item.image) {
            let imgname = item.image.name;
            const storageRef = firebase.storage().ref();
            const imageRef = await storageRef
              .child(`questionImages/${imgname}`)
              .put(item.image);
            itemImageURL = await storage
              .ref("questionImages")
              .child(imgname)
              .getDownloadURL(); // let imgname = item.image.name
            // const storageRef = firebase.storage().ref();
            //   const imageRef = storageRef.child(`questionImages/${imgname}`)
            //   .put(item.image);
            // itemImageURL = await storage.ref("questionImages").child(imgname).getDownloadURL();
            //  / const storageRef = ref(`questionImages/${item.image.name}`);
            //   // const imageRef = storageRef.child(
            //   //   `questionImages/${item.image.name}`
            //   // );
            //   await storageRef.put(item.image);
            //   itemImageURL = await storageRef.getDownloadURL();
            //   console.log();
          }

          const uploadedOptions = [];

          if (item.options) {
            const optionKeys = Object.keys(item.options);

            for (const key of optionKeys) {
              const option = item.options[key];
              let optionImageURL = "";

              if (option.image) {
                let imgname = option.image.name;
                const storageRef = firebase.storage().ref();
                const imageRef = await storageRef
                  .child(`optionImages/${imgname}`)
                  .put(option.image);
                optionImageURL = await storage
                  .ref("optionImages")
                  .child(imgname)
                  .getDownloadURL();
                // const storageRef = ref(`optionImages/${option.image.name}`);
                // await storageRef.put(option.image);
                // optionImageURL = await storageRef.getDownloadURL();
              }
              console.log("options", option);
              console.log("options image", optionImageURL);
              uploadedOptions.push({
                ...option,
                image: optionImageURL,
              });
            }
          }

          uploadedData.push({
            ...item,
            image: itemImageURL,
            options: uploadedOptions,
          });
        }

        return uploadedData;
      };
      var uploadedQuestions = [];
      uploadedQuestions = await uploadQuestionImages(questions);
      console.log(uploadedQuestions);

      // Create a document in the "lessons" collection

      if (
        selectedOptions.length === 0 ||
        selected_book === "" ||
        // chapter === "" ||
        mark === ""
      ) {
        console.log("enter complete input");
        toast.error("enter complete input");
      } else {
        const timestamp = serverTimestamp();
        const randomId = Math.floor(1000000 + Math.random() * 9000000).toString();

const docRef = doc(db, "lessonQuiz", randomId);
const docRef2 = doc(db, "teacherFolderQuiz", randomId);
const docSnapshot = await getDoc(docRef);

if (!docSnapshot.exists()) {
  const docData = {
    lessonName,
    lessonImage: imageURL,
    totalMarks,
    totalDuration,
    quizType,
    grade: selectedOptions,
    subject: selected_book,
    questions: uploadedQuestions,
    playCounter: "",
    role: role,
    refId: ref_id,
    createdAt: timestamp,
    Folder: selectedFolder,
  };

  const newDocRef = await setDoc(docRef, docData);

  if (selectedFolder) {
    const docData2 = {
      lessonName,
      lessonImage: imageURL,
      totalMarks,
      totalDuration,
      quizType,
      grade: selectedOptions,
      subject: selected_book,
      questions: uploadedQuestions,
      playCounter: "",
      role: role,
      refId: ref_id,
      createdAt: timestamp,
      Folder: selectedFolder,
    };
    const newDocRef2 = await setDoc(docRef2, docData2);
  }

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

  const totalmarks = selectedItems.length * mark;
  const totaldutration = selectedItems.length * duration;

  const handleSubmit = (e, type) => {
    e.preventDefault();
    storeData(
      // chapterRefId,
      lessonName,
      lessonimage,
      totalmarks,
      totaldutration,
      type,
      selectedItems
    );
  };

  return (
    <div className="teacher-quiz-main-div">
      <div className="teacher-create-quiz-top-bar">
        <h2 className="A-h2">
        <div className="mylibrary_sidebar_title_menu" onClick={showDrawer}>
            <IoMenuOutline />
          </div>
          Create Quiz</h2>
        <div className="top-bar-btns">
          <div>
            <select
              className="select-folder"
              value={selectedFolder}
              onChange={handleSelectFolderChange}
            >
              <option value="">Select Folder</option>
              {foldersName.map((item, key) => (
                <option key={key} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="top-bar-btn-private"
            type="submit"
            onClick={(e) => handleSubmit(e, "private")}
          >
            Private
          </button>
          <button
            className="top-bar-btn-private"
            type="submit"
            onClick={(e) => handleSubmit(e, "public")}
          >
            Public
          </button>
        </div>
      </div>

      <form className="form-1">
        <div className="div-1">
          <div className="main-selects">
            <div className="select-subjects">
              <p className="selectbook-title">Select a Book </p>
              <div className="book-name">
                <span
                  className={selected_book === "language art" ? "selected" : ""}
                  onClick={() => setSelected_book("language art")}
                >
                  Language Art
                </span>
                <span
                  className={selected_book === "science" ? "selected" : ""}
                  onClick={() => setSelected_book("science")}
                >
                  Science
                </span>
                <span
                  className={selected_book === "math" ? "selected" : ""}
                  onClick={() => setSelected_book("math")}
                >
                  Math
                </span>
                <span
                  className={selected_book === "socialstudy" ? "selected" : ""}
                  onClick={() => setSelected_book("socialstudy")}
                >
                  Social Study
                </span>
              </div>
            </div>
            <div className="grade">
              <hp className="grad-title">Select Grade:</hp>
              <div className="grades-names">
                <label
                  className={`opt-label ${
                    selectedOptions === "K" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="K"
                    checked={selectedOptions === "K"}
                    onChange={handleCheckboxChange}
                  />
                  K
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "1" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="1"
                    checked={selectedOptions === "1"}
                    onChange={handleCheckboxChange}
                  />
                  1
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "2" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="2"
                    checked={selectedOptions === "2"}
                    onChange={handleCheckboxChange}
                  />
                  2
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "3" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="3"
                    checked={selectedOptions === "3"}
                    onChange={handleCheckboxChange}
                  />
                  3
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "4" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="4"
                    checked={selectedOptions === "4"}
                    onChange={handleCheckboxChange}
                  />
                  4
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "5" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="5"
                    checked={selectedOptions === "5"}
                    onChange={handleCheckboxChange}
                  />
                  5
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "6" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="6"
                    checked={selectedOptions === "6"}
                    onChange={handleCheckboxChange}
                  />
                  6
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "7" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="7"
                    checked={selectedOptions === "7"}
                    onChange={handleCheckboxChange}
                  />
                  7
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "8" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="8"
                    checked={selectedOptions === "8"}
                    onChange={handleCheckboxChange}
                  />
                  8
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "9" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="9"
                    checked={selectedOptions === "9"}
                    onChange={handleCheckboxChange}
                  />
                  9
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "10" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="10"
                    checked={selectedOptions === "10"}
                    onChange={handleCheckboxChange}
                  />
                  10
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "11" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="11"
                    checked={selectedOptions === "11"}
                    onChange={handleCheckboxChange}
                  />
                  11
                </label>
                <label
                  className={`opt-label ${
                    selectedOptions === "12" ? "selected-grd" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="12"
                    checked={selectedOptions === "12"}
                    onChange={handleCheckboxChange}
                  />
                  12
                </label>
              </div>
            </div>
          </div>
          <div className="div-3">
            {/* <div className="chapter-add">
              <h3>Add chapter?</h3>
              <div>
                <select
                  className="selections"
                  onChange={handleOptionChange}
                  required
                >
                  <option value="">Select a Chapter</option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}
            <div className="enter-lesson">
              <p>Title</p>
              <textarea
                type="text"
                onChange={(e) => {
                  setLessonName(e.target.value);
                }}
                required
              />
            </div>
            <div className="select-lesson-image">
              <div className="img-cover">
                <p>Cover:</p>
                <label htmlFor="files" className="btn">
                  Select
                </label>
                <input
                  id="files"
                  style={{ visibility: "hidden" }}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              {/* <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            /> */}
              {console.log(lessonimage)}
              <div className="show-lesson-image">
                <img
                  style={
                    showlessonimage
                      ? { width: "100%", height: "100%" }
                      : { display: "none" }
                  }
                  src={showlessonimage}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="show_info-new">
          <div className="total-q">
            {" "}
            <p className="p-1">{AllQuestions.length} </p>{" "}
            <p className="p-2">Total Q.</p>
          </div>
          <div className="total-d">
            <p className="p-1">{selectedItems.length * duration}</p>
            <p className="p-2">Total D.</p>
          </div>
          <div className="total-p">
            <p className="p-1"> {selectedItems.length * mark}</p>
            <p className="p-2">Total P.</p>
          </div>
        </div>
        <div className="settings-points">
          <div className="s-items">
            <p>Selected Items ({selectedItems.length})</p>
          </div>
          <div className="select-btns">
            <button className="s-all-btn" onClick={handleSelectAll}>
              Select All
            </button>
            <div className="s-duration">
              <select
                defaultValue={"1"}
                onChange={(e) => setMark(e.target.value)}
                className="select"
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
              <p>Points per Question</p>
            </div>
            <div className="s-duration">
              <select
                defaultValue={"1"}
                onChange={(e) => setDuration(e.target.value)}
                className="select"
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
              <p>Duration per Question</p>
            </div>
          </div>
        </div>
        <p className="add-q-title">Add Questions</p>
        <div className="modal">
          <Button className="btn-ab-1" onClick={showModal}>
            Multi choice
          </Button>
          <Modal
            width={1000}
            open={open}
            title="Create Muti choice question"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button onClick={handleRerturn}>Close Quiz</Button>,
              <Button type="primary" onClick={handleCancel}>
                close
              </Button>,
              <Button type="primary" onClick={handleAdd}>
                Add Quiz
              </Button>,
            ]}
          >
            {look && <AddQuestion updateParentArray={updateParentArray} />}
          </Modal>
          {/* <Button className="btn-ab-1" onClick={showModalFill}>
            Fill in the blanks
          </Button> */}
          <Modal
            width={1000}
            open={openFill}
            title="Create Fill in Blanks Question"
            onOk={handleOkFill}
            onCancel={handleCancelFill}
            footer={[
              <Button onClick={handleRerturnFill}>Close Quiz</Button>,
              <Button type="primary" onClick={handleCancelFill}>
                close
              </Button>,
              <Button type="primary" onClick={handleAddFill}>
                Add Quiz
              </Button>,
            ]}
          >
            {lookfill && <FillinBlanks updateParentArray={updateParentArray} />}
          </Modal>
          {/* <Button className="btn-ab-1" onClick={showModalDragdrop}>
            Drag And Drop
          </Button> */}
          <Modal
            width={1000}
            open={openDragdrop}
            title="Create Drag and Drop Question"
            onOk={handleOkDragdrop}
            onCancel={handleCancelDragdrop}
            footer={[
              <Button onClick={handleRerturnDragdrop}>Close Quiz</Button>,
              <Button type="primary" onClick={handleCancelDragdrop}>
                close
              </Button>,
              <Button type="primary" onClick={handleAddDragdrop}>
                Add Quiz
              </Button>,
            ]}
          >
            {lookDragdrop && (
              <Draganddrop updateParentArray={updateParentArray} />
            )}
          </Modal>
        </div>
        <div>
          <div>
            <div style={{ marginTop: "15px" }}>
              <label>
                <input
                  style={{ width: "30px", height: "18px" }}
                  type="checkbox"
                  checked={showCorrectAnswers}
                  onChange={handleShowCorrectAnswers}
                />
                Correct Answers
              </label>
            </div>
            <div className="show-question-div">
              {AllQuestions.map((innerArray, index) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div key={index} className="inner-question">
                    <div>
                      {console.log(innerArray)}
                      <p className="show-q-name">
                        Q {index + 1}:{innerArray.text}
                      </p>

                      {innerArray.image && (
                        <img
                          src={
                            innerArray.image &&
                            URL.createObjectURL(innerArray.image)
                          }
                          alt="Question"
                          width="100px"
                          style={{ borderRadius: "7px" }}
                        />
                      )}

                      <ul style={{ display: "flex" }}>
                        {innerArray.options.map((option, optionIndex) => (
                          <li
                            key={optionIndex}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "10px",
                              fontSize: "18px",
                              color:
                                showCorrectAnswers && option.correct
                                  ? "green"
                                  : "black",
                            }}
                          >
                            {String.fromCharCode(97 + optionIndex)}.){" "}
                            {option.text}
                            <img
                              src={
                                option.image &&
                                URL.createObjectURL(option.image)
                              }
                              width="100px"
                              style={{ borderRadius: "7px", marginTop: "5px" }}
                              alt=""
                            />
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

                    <label>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(innerArray)}
                        onChange={() => handleSelectItem(innerArray)}
                      />
                    </label>
                  </div>
                  <div className="line"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreateQuiz;
