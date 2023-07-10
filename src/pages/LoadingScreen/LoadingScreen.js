import React from "react";
import "./LoadingScreen.scss"
import { ClimbingBoxLoader } from "react-spinners";
const LoadingScreen = () => {
  return (
    <div className="loadingscreen_container">
      <ClimbingBoxLoader color="#36d7b7" />
    </div>
  );
};

export default LoadingScreen;
