import React, { useEffect, useState } from "react";
import "./SelfStudyStudent.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import fetchData from "../../functions/getData";
// import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import Sidebar from "./Sidebar/Sidebar";

import { useNavigate, useParams } from "react-router-dom";
import SelfSingleChapter from "./SelfSingleChapter/SelfSingleChapter";
import { BiArrowBack } from "react-icons/bi";

const SelfStudyStudent = () => {
  const { id } = useParams();
  // console.log(id, "idddddd");
  const [chapters, setChapters] = useState([]);
  // const localData = localStorage.getItem("userData");
  // const userId = localData ? JSON.parse(localData).userId : null;
  const [lessons, setLessons] = useState([]);
  const [result, setResult] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [grade, setGrade] = useState("K");
  const [value, setValue] = useState("1");
  let bookName;

  if (value == 1) {
    bookName = "math";
  }
  if (value == 2) {
    bookName = "language art";
  }
  if (value == 3) {
    bookName = "science";
  }
  if (value == 4) {
    bookName = "socialstudy";
  }
  const getGrade = (event) => {
    setGrade(event.target.getAttribute("value"));
  };
  // const fetchedDataChapters = async (collectionName) => {
  //   const querySnapshot = await getDocs(collection(db, collectionName));
  //   const newData = querySnapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }));
  //   setChapters(newData);
  // };
  const fetchedDataChapters = async (collectionName) => {
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("subject", "==", bookName),
        where("grade", "array-contains", grade)
        )
    );

    const newData = querySnapshot.docs.map((doc) => ({
      title: doc.data().title, // Retrieve only the 'title' field
      id: doc.id,
    }));
    setFilterArray(newData)
    setChapters(newData);
    fetchedDataLessons("lessonQuiz",newData);

  };
  // const fetchedDataLessons = async (collectionName) => {
  //   const querySnapshot = await getDocs(
  //     query(collection(db, collectionName), where("quizType", "==", "self"))
  //   );
  //   const newData = querySnapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }));
  //   setLessons(newData);
  // };
  const fetchedDataLessons = async (collectionName,data) => {
    // const querySnapshot = await getDocs(
    //   query(collection(db, collectionName), where("quizType", "==", "self"))
    // );
    // const newData = querySnapshot.docs.map((doc) => ({
    //   ...doc.data(),
    //   id: doc.id,
    // }));
    const filterIds = data?.map((item) => item.id);
    if (filterIds && filterIds.length > 0) {

    const querySnapshot = await getDocs(
      query(collection(db, collectionName), where("chapterId", "in", filterIds))
    );
    console.log(querySnapshot.docs)
    const newData = querySnapshot.docs.map((doc) => ({
      // ...doc.data(),
      lessonName: doc.data().lessonName,
      chapterId: doc.data().chapterId,
      grade: doc.data().grade,
      // lessonImage: doc.data().lessonImage,
      id: doc.id,
    }));
    setLessons(newData);}
  };
  // const fetchedDataResult = async (collectionName) => {
  //   const querySnapshot = await getDocs(collection(db, collectionName));
  //   const newData = querySnapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }));
  //   setResult(newData);
  // };
  const fetchedDataResult = async (collectionName) => {
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),  
        // where("userId", "==", id),
        )
    );
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setResult(newData);
  };
  useEffect(() => {
    fetchedDataChapters("chapters");
    fetchedDataResult("result");
  }, [bookName,grade]);

  // useEffect(() => {
  //   const filteredData = chapters.filter((chap) => {
  //     return chap.subject == chapterName && chap.grade.includes(grade);
  //   });

  //   setFilterArray(filteredData);
  // }, [chapters, chapterName, grade, result]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  // if (chapters.length === 0) {
  //   return <LoadingScreen />;
  // }
  return (
    <div className="selfstudy_container">
      <Sidebar getGrade={getGrade} grade={grade} setGrade={setGrade} />
      <div className="selfstudy_container_tab">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", margin: "auto" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Math" value="1" />
              <Tab label="Language Arts" value="2" />
              <Tab label="Science" value="3" />
              <Tab label="Social Studies" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                <div
                  onClick={() => navigate(-1)}
                  className="tabpanel_container_title_back"
                >
                  <BiArrowBack />
                </div>
                {grade} grade {bookName} class
              </div>
              <div className="tabpanel_container_chapters">
                {filterArray.map((element) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      key={id}
                      grade={grade}

                      result={result}
                      setResult={setResult}
                      userId={id}
                    />
                  );
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {bookName}
              </div>
              <div className="tabpanel_container_chapters">
                {filterArray.map((element) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      key={id}
                      grade={grade}

                      result={result}
                      setResult={setResult}
                      userId={id}
                    />
                  );
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {bookName}
              </div>
              <div className="tabpanel_container_chapters">
                {filterArray.map((element) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      key={id}
                      grade={grade}

                      result={result}
                      setResult={setResult}
                      userId={id}
                    />
                  );
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="4">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {bookName}
              </div>
              <div className="tabpanel_container_chapters">
                {filterArray.map((element) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      key={id}
                      grade={grade}
                      result={result}
                      setResult={setResult}
                      userId={id}
                    />
                  );
                })}
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default SelfStudyStudent;
