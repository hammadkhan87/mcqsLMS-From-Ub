import React, { useState, useEffect } from "react";
import clockAudio from "../../../assets/clock.mp3";
import "./Timer.scss";

const Timer = ({ count, setCount }) => {
  const [audio, setAudio] = useState(new Audio(clockAudio));

  const startTimer = () => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval);
          audio.pause();
          audio.currentTime = 0;
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    audio.play();
  };

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  return (
    <div className="container_timer">
      <h1 className="container_timer_number">{count}</h1>
      <button className="container_timer_btn" onClick={startTimer}>
        Start
      </button>
    </div>
  );
};

export default Timer;
