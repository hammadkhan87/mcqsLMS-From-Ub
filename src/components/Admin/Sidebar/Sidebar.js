import React from "react";
import "./Sidebar.scss";
const Sidebar = ({ grade, setGrade, getGrade }) => {
  return (
    <div className="selfstudy_container_sidebar">
      <div className={`class1_title`}>Grades</div>
      <div
        className={`class1 ${grade === "k" ? "active" : ""}`}
        value="k"
        onClick={(e) => getGrade(e)}
      >
        Grade K
      </div>
      <div
        className={`class2 ${grade === "1" ? "active" : ""}`}
        value="1"
        onClick={(e) => getGrade(e)}
      >
        Grade 1
      </div>
      <div
        className={`class3 ${grade === "2" ? "active" : ""}`}
        value="2"
        onClick={(e) => getGrade(e)}
      >
        Grade 2
      </div>
      <div
        className={`class4 ${grade === "3" ? "active" : ""}`}
        value="3"
        onClick={(e) => getGrade(e)}
      >
        Grade 3
      </div>
      <div
        className={`class5 ${grade === "4" ? "active" : ""}`}
        value="4"
        onClick={(e) => getGrade(e)}
      >
        Grade 4
      </div>
      <div
        className={`class6 ${grade === "5" ? "active" : ""}`}
        value="5"
        onClick={(e) => getGrade(e)}
      >
        Grade 5
      </div>
      <div
        className={`class7 ${grade === "6" ? "active" : ""}`}
        value="6"
        onClick={(e) => getGrade(e)}
      >
        Grade 6
      </div>
      <div
        className={`class8 ${grade === "7" ? "active" : ""}`}
        value="7"
        onClick={(e) => getGrade(e)}
      >
        Grade 7
      </div>
      <div
        className={`class9 ${grade === "8" ? "active" : ""}`}
        value="8"
        onClick={(e) => getGrade(e)}
      >
        Grade 8
      </div>
      <div
        className={`class10 ${grade === "9" ? "active" : ""}`}
        value="9"
        onClick={(e) => getGrade(e)}
      >
        Grade 9
      </div>
      <div
        className={`class11 ${grade === "10" ? "active" : ""}`}
        value="10"
        onClick={(e) => getGrade(e)}
      >
        Grade 10
      </div>
      <div
        className={`class12 ${grade === "11" ? "active" : ""}`}
        value="11"
        onClick={(e) => getGrade(e)}
      >
        Grade 11
      </div>
      <div
        className={`class13 ${grade === "12" ? "active" : ""}`}
        value="12"
        onClick={(e) => getGrade(e)}
      >
        Grade 12
      </div>
    </div>
  );
};

export default Sidebar;
