import React from "react";
import "./Courses.scss";
import { courses } from "../../../data";
import Course from "../Course/Course";
import { Link } from "react-router-dom";

const Courses = ({ category }) => {
  const englishCourses = courses.filter(
    (course) => course.category === category
  );
  const displayedCourses = englishCourses.slice(0, 3);

  return (
    <div className="courses_container">
      <div className="course">
        <div className="course_upper">
          <div className="course_upper_title">{category}</div>
          <Link to={`courselist/${category}`} className="course_upper_btn_link">
            <div className="course_upper_btn">See All</div>
          </Link>
        </div>
        <div className="course_list">
          {displayedCourses.map((course) => {
            
            return <Course key={course.id} course={course} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
