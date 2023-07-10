import React, { useEffect, useState } from "react";
import "./EditLesson.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import fetchData from "../../../functions/getData";
import LoadingScreen from "../../../pages/LoadingScreen/LoadingScreen";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import SingleChapter from "./SingleChapter/SingleChapter";
import Sidebar from "../../../components/SelfStudy/Sidebar/Sidebar";

const EditLesson = () => {
 

  
  const [grade, setGrade] = useState("K");
  const [value, setValue] = useState("1");
  let chapterName;

  if (value == 1) {
    chapterName = "math";
  }
  if (value == 2) {
    chapterName = "language art";
  }
  if (value == 3) {
    chapterName = "science";
  }
  if (value == 4) {
    chapterName = "socialstudy";
  }
  const getGrade = (event) => {
    setGrade(event.target.getAttribute("value"));
  };
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
                {grade} grade {chapterName}
              </div>
              <div className="tabpanel_container_chapters">
                {/* {filterArray.map((element, key) => {
                  return ( */}
                    <SingleChapter
                      chapterName={chapterName}
                      grade={grade}
                      // lessons={lessons}
                      // element={element}
                      // key={key}
                    />
                  {/* );
                })} */}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {chapterName}
              </div>
              <div className="tabpanel_container_chapters">
                {/* {filterArray.map((element, key) => {
                  return ( */}
                    <SingleChapter
                    chapterName={chapterName}
                    grade={grade}
                      // lessons={lessons}
                      // element={element}
                      // key={key}
                    />
                  {/* );
                })} */}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {chapterName}
              </div>
              <div className="tabpanel_container_chapters">
                {/* {filterArray.map((element, key) => {
                  return ( */}
                    <SingleChapter
                    chapterName={chapterName}
                    grade={grade}
                      // lessons={lessons}
                      // element={element}
                      // key={key}
                    />
                  {/* );
                })} */}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="4">
            <div className="tabpanel_container">
              <div className="tabpanel_container_title">
                {grade} grade {chapterName}
              </div>
              <div className="tabpanel_container_chapters">
                {/* {filterArray.map((element, key) => {
                  return ( */}
                    <SingleChapter
                      chapterName={chapterName}
                        grade={grade}
                      // lessons={lessons}
                      //  element={element}
                      // key={key}
                    />
                  {/* );
                })} */}
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default EditLesson;
