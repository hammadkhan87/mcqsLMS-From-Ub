import React, { useEffect, useState } from "react";
import "./Question.scss";

const Question = ({
  question,
  options,
  onSelectAnswer,
 
}) => {


  const handleKeyDown = (event, option) => {
    if (event.key === "Enter") {
      onSelectAnswer(option.text);
    }
  };

  return (
    <div className="questions_container">
      <div className="questions_question">{question}</div>
      <div className="answers ">
        {options.map((option, key) => {
          return (
            <span
              key={key}
              className={`answer${key} answer`}
              tabIndex="0"
              onKeyDown={(event) => handleKeyDown(event, option)}
              onClick={() => onSelectAnswer(option.text)}
              role="button"
              aria-label={option.text}
            >
              {option.text}
            </span>
          );
        })}
      </div>
     
    </div>
  );
};

export default Question;
