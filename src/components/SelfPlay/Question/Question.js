import React, { useEffect, useState } from "react";
import "./Question.scss";

const Question = ({ question, options, onSelectAnswer, timeLimit, elapsedTime }) => {
  const [remainingTime, setRemainingTime] = useState(timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      onSelectAnswer("");
    }
  }, [remainingTime, onSelectAnswer]);

  const handleKeyDown = (event, option) => {
    if (event.key === "Enter") {
      onSelectAnswer(option.text);
    }
  };

  return (
    <div className="questions_container">
      <div className="questions_question">{question}</div>
      <div className="time_limit">Time Remaining: {remainingTime}s</div>
      <div className="answers">
        {options.map((option, key) => {
          return (
            <span
              key={key}
              className={`answer${key}`}
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
      <div className="elapsed_time">Elapsed Time: {elapsedTime}s</div>
    </div>
  );
};

export default Question;
