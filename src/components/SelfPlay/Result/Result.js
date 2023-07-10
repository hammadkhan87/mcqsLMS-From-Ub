import React from "react";
import { Link, useLocation } from "react-router-dom";

const Result = ({ score, totalQuestions, timeTaken, timeUnit }) => {
  return (
    <div className="quiz_result">
      <div className="quiz_result_header">
        <h2>Quiz completed!</h2>
      </div>
      <div className="quiz_result_body">
        <p>
          Your score: {score} out of {totalQuestions}
        </p>
        <p>
          Time taken: {timeTaken} {timeUnit}
        </p>

        {/* {location} */}
        <div
          onClick={()=>window.location.reload()}
          className="quiz_result_body_btn"
        >
          Play Again
        </div>
      </div>
      <div className="quiz_result_footer"></div>
    </div>
  );
};

export default Result;
