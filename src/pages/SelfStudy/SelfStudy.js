import React, { useEffect, useState } from "react";
import "./SelfStudy.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import fetchData from "../../functions/getData";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { collection, getDocs, query, where } from "firebase/firestore";
import handleFirebaseError from "../../handleFirebaseError";
import { db } from "../../firebase";
import SelfSingleChapter from "../../components/SelfStudy/SelfSingleChapter/SelfSingleChapter";
import Sidebar from "../../components/SelfStudy/Sidebar/Sidebar";
import { toast } from "react-hot-toast";
const SelfStudy = ({ isLogin }) => {
  const localData = localStorage.getItem("userData");
  const userId = localData ? JSON.parse(localData).userId : null;
  const [chapters, setChapters] = useState([]);
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
  const fetchedDataChapters = async (collectionName) => {
    try {
      
   
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

  
   } catch (error) {
      handleFirebaseError(error)
      toast.error("something wents wrong")
    }
  }
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
  const fetchedDataResult = async (collectionName) => {
    try {
      
    
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("userId", "==", userId),
        )
    );
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setResult(newData);
   } catch (error) {
      toast.error("some thing wents wrong")
    }
  };
  useEffect(() => {
    fetchedDataChapters("chapters");
    fetchedDataResult("result");
  }, [ bookName, grade]);

  // useEffect(() => {
  //   const filteredData = chapters.filter((chap) => {
  //     return chap.subject == bookName && chap.grade.includes(grade);
  //   });

  //   setFilterArray(filteredData);
  // }, [chapters, bookName, grade, result]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // if (chapters.length === 0) {
  //   return <LoadingScreen />;
  // }
  return (
    <div className="selfstudy_container">
      <Sidebar getGrade={getGrade} grade={grade} setGrade={setGrade} />
      <div className="selfstudy_container_tab">
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              margin: "auto",
            }}
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                label="Math"
                value="1"
                className={value === "1" ? "active-tab" : ""}
              />
              <Tab
                label="Language Arts"
                value="2"
                className={value === "2" ? "active-tab" : ""}
              />
              <Tab
                label="Science"
                value="3"
                className={value === "3" ? "active-tab" : ""}
              />
              <Tab
                label="Social Studies"
                value="4"
                className={value === "4" ? "active-tab" : ""}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {bookName}
              </div>
              <div className="tabpanel_container_chapters">
                {filterArray.map((element, id) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      grade={grade}
                      key={id}
                      result={result}
                      setResult={setResult}
                      isLogin={isLogin}
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
                {filterArray.map((element, id) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      grade={grade}
                      key={id}
                      result={result}
                      setResult={setResult}
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
                {filterArray.map((element, id) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      grade={grade}
                      key={id}
                      result={result}
                      setResult={setResult}
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
                {filterArray.map((element, id) => {
                  return (
                    <SelfSingleChapter
                      lessons={lessons}
                      element={element}
                      grade={grade}
                        key={id}
                      result={result}
                      setResult={setResult}
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

export default SelfStudy;
