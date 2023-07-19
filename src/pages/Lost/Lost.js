import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Lost.scss"
const Lost = () => {
  const localData = localStorage.getItem("userData")
  const role = localData?JSON.parse(localData).role: null;
  const navigate=useNavigate()
//  if(role==="Teacher"){
//   navigate("/classroom/library")
//  }
  return (
    <div className="lost_container">
      <div class="section">
        <h1 class="error">404</h1>
        <div class="page">
          Ooops!!! The page you are looking for is not found
        </div>
        <Link class="back-home" to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Lost;
