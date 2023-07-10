import React from "react";
import "./Reviews.scss";
const Reviews = () => {
  return (
    <div className="reviews_container">
      <div className="reviews_courses">
        <div className="reviews_img">
          <img src="./assets/audience.png" alt="" />
        </div>
        <div className="reviews_cont">
          <div className="reviews_cont_title">10k+</div>
          <div className="reviews_cont_des">Total Courses</div>
        </div>
      </div>
      <div className="reviews_mentors">
        <div className="reviews_img">
          <img src="./assets/education.png" alt="" />
        </div>
        <div className="reviews_cont">
          <div className="reviews_cont_title">500+</div>
          <div className="reviews_cont_des">Expert Mentor</div>
        </div>
      </div>
      <div className="reviews_globally">
        <div className="reviews_img">
          <img src="./assets/student.png" alt="" />
        </div>
        <div className="reviews_cont">
          <div className="reviews_cont_title">300k+</div>
          <div className="reviews_cont_des">Students Globally</div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
