import React from "react";
import "./Course.scss";
import { MdOutlinePerson } from "react-icons/md";
import { AiOutlineStar } from "react-icons/ai";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Course = ({ course }) => {
  return (
    <div className="course_container">
      <div className="courses_container_img">
        {/* <img src={course.linkPath} alt="" /> */}
        <LazyLoadImage src={course.linkPath} alt="Image Alt" />
      </div>
      <div className="course_container_skill">{course.skill}</div>
      <div className="course_container_title">{course.title}</div>
      <div className="course_container_footer">
        <div className="course_container_footer_enroled">
          <MdOutlinePerson className="course_container_footer_icon" />{" "}
          {course.enrolled}
        </div>
        <div className="course_container_footer_stars">
          <AiOutlineStar className="course_container_footer_icon" />
          {course.stars}
        </div>
        <div className="course_container_footer_cost">
          <AiOutlineInfoCircle className="course_container_footer_icon" />{" "}
          {course.price}
        </div>
      </div>
    </div>
  );
};

export default Course;
