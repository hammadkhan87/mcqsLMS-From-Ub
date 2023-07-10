import React from "react";
import "./Sidebar.scss";
const Sidebar = ({ grade, setGrade, getGrade }) => {
  const handleGradeClick = (e, value) => {
    e.preventDefault();
    setGrade(value);
  };
  console.log(grade, "grade");
  return (
    <>
      <div className="selfstudy_container_sidebar">
        <div
          className={`class1 ${grade === "K" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "K")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> K
        </div>
        <div
          className={`class2 ${grade === "1" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "1")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 1
        </div>
        <div
          className={`class3 ${grade === "2" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "2")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 2
        </div>
        <div
          className={`class4 ${grade === "3" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "3")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 3
        </div>
        <div
          className={`class5 ${grade === "4" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "4")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 4
        </div>
        <div
          className={`class6 ${grade === "5" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "5")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 5
        </div>
        <div
          className={`class7 ${grade === "6" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "6")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 6
        </div>
        <div
          className={`class8 ${grade === "7" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "7")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 7
        </div>
        <div
          className={`class9 ${grade === "8" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "8")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 8
        </div>
        <div
          className={`class10 ${grade === "9" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "9")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 9
        </div>
        <div
          className={`class11 ${grade === "10" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "10")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 10
        </div>
        <div
          className={`class12 ${grade === "11" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "11")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 11
        </div>
        <div
          className={`class13 ${grade === "12" ? "active" : ""}`}
          onClick={(e) => handleGradeClick(e, "12")}
        >
          <span className="selfstudy_container_sidebar_span">Grade</span> 12
        </div>
      </div>
    </>
  );
};

export default Sidebar;
