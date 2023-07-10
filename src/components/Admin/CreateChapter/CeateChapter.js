import React from "react";
import { useState, useEffect } from "react";
import "./CreateChapter.scss";
import { auth, db, firebaseConfig } from "../../../firebase";
import firebase from "firebase/compat/app";


import { RotateLoader } from "react-spinners";
import { toast } from "react-hot-toast";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
firebase.initializeApp(firebaseConfig);

const CeateChapter = () => {
  const [selected_book, setSelected_book] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [chapter, setChapter] = useState("");
  const [rank, setRank] = useState("low");
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions?.filter((option) => option !== value));
    }
  };

  const onSavehandler = async () => {
    setLoading(true);

    try {
      if (
        selectedOptions.length === 0 ||
        selected_book === "" ||
        chapter === "" ||
        rank === ""
      ) {
        setError(true);
        console.log("enter complete input");
        toast.error("enter complete input");
        setLoading(false);
      } else {
        const docRef = collection(db, "chapters");
        const querySnapshot = await getDocs(
          query(
            docRef,
            where("title", "==", chapter),
            where("grade", "==", selectedOptions),
            where("subject", "==", selected_book),
            where("rank", "==", rank)
          )
        );

        if (querySnapshot.empty) {
          const timestamp = serverTimestamp();


          const docData = {
            title: chapter,
            grade: selectedOptions,
            subject: selected_book,
            rank: rank,
            createdAt: timestamp,
          };

          const newDocRef = await addDoc(docRef, docData);
          setLoading(false);
          //alert();
          toast.success("Chapter created successfully");
          console.log("Data added to Firestore");
        } else {
          //alert("Chapter already exists");
          toast.error("Chapter already exists");
          console.log("Duplicate data");
          setLoading(false);
        }
      }
    } catch (e) {
      console.log("Error in adding document", e);
      toast.error("Error in adding document");
      setLoading(false);
    }
  };

  return (
    <div className="main-div-a">
      <h2 className="main-title">Create Quiz</h2>
      <div className="select-book">
        <h2>Select a Book</h2>
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
        <div className="grade">
          <h2>Select grade</h2>
          <div>
            <label
              className={`opt-label ${
                selectedOptions.includes("K") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="K"
                checked={selectedOptions.includes("K")}
                onChange={handleCheckboxChange}
              />
              K
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("1") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="1"
                checked={selectedOptions.includes("1")}
                onChange={handleCheckboxChange}
              />
              1
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("2") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="2"
                checked={selectedOptions.includes("2")}
                onChange={handleCheckboxChange}
              />
              2
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("3") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="3"
                checked={selectedOptions.includes("3")}
                onChange={handleCheckboxChange}
              />
              3
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("4") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="4"
                checked={selectedOptions.includes("4")}
                onChange={handleCheckboxChange}
              />
              4
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("5") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="5"
                checked={selectedOptions.includes("5")}
                onChange={handleCheckboxChange}
              />
              5
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("6") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="6"
                checked={selectedOptions.includes("6")}
                onChange={handleCheckboxChange}
              />
              6
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("7") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="7"
                checked={selectedOptions.includes("7")}
                onChange={handleCheckboxChange}
              />
              7
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("8") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="8"
                checked={selectedOptions.includes("8")}
                onChange={handleCheckboxChange}
              />
              8
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("9") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="9"
                checked={selectedOptions.includes("9")}
                onChange={handleCheckboxChange}
              />
              9
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("10") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="10"
                checked={selectedOptions.includes("10")}
                onChange={handleCheckboxChange}
              />
              10
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("11") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="11"
                checked={selectedOptions.includes("11")}
                onChange={handleCheckboxChange}
              />
              11
            </label>
            <label
              className={`opt-label ${
                selectedOptions.includes("12") ? "selected-grd" : ""
              }`}
            >
              <input
                type="checkbox"
                value="12"
                checked={selectedOptions.includes("12")}
                onChange={handleCheckboxChange}
              />
              12
            </label>
          </div>
        </div>
        <div className="input-div">
          <h2>Enter Chapter</h2>
          <input
            className="chapter-input"
            type="text"
            placeholder="Enter Chapter Name"
            onChange={(e) => setChapter(e.target.value)}
          />

          <label className="label-rank" htmlFor="">
            Choose Rank ?
          </label>
          <select
            defaultValue={"low"}
            onChange={(e) => setRank(e.target.value)}
            className="select"
          >
            <option value={"low"}>Low</option>
            <option value={"medium"}>Medium</option>
            <option value={"high"}>High</option>
          </select>
        </div>
        <button className="btn" onClick={onSavehandler}>
          Save
        </button>
        {loading ? (
          <RotateLoader color="#36d7b7" loading={loading} size={100} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CeateChapter;
