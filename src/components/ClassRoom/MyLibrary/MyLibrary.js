import React from "react";
import "./MyLibrary.scss";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { IoMenuOutline } from "react-icons/io5";
const MyLibrary = ({showDrawer}) => {
  return (
    <div className="classroom_mylibrary">
      <div className="classroom_mylibrary_header" >
        <div className="mylibrary_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
        My Library
      </div>
      <div className="classroom_mylibrary_body">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default MyLibrary;
