import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiBookOpen,
  FiUsers,
  FiBook,
  FiCode,
  FiSettings,
  FiPlus,
} from "react-icons/fi";
import image from "../../../assets/premium_photo-1673971700988-346588461fa7.jpg";
import "./Sidebar.scss";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { auth } from "../../../firebase";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoMenuOutline } from "react-icons/io5";

const Sidebar = ({ placement, onChange, onClose, open, showDrawer }) => {
  const HandleLogout = async () => {
    localStorage.removeItem("userData");
    try {
      await auth.signOut();

      window.location.reload(true);
      // Redirect or update UI to reflect successful logout
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };
  return (
    <>
      <div className="classroom_sidebar big_sidebar">
        <div className="classroom_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
        <div className="classroom_sidebar_title">
          <div className="classroom_sidebar_title_heading">Mirown</div>
          <div className="classroom_sidebar_title_sub">
            <div className="classroom_sidebar_title_sub_line"></div>
            <div className="classroom_sidebar_title_sub_text">QUIZZES</div>
          </div>
        </div>

        <div className="classroom_sidebar_aid">
          <img className="classroom_sidebar_aid_img" src={image} alt="" />
          {/* Hi, We are spending $1000 every week for you. You can also help us. */}
        </div>
        <div className="classroom_sidebar_main">
          <NavLink
            exact
            to="/classroom/create"
            className="classroom_sidebar_main_item_create"
            activeClassName="active"
          >
            <FiHome className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Create</span>
          </NavLink>
          <NavLink
            to="/classroom/explore"
            className="classroom_sidebar_main_item"
            activeClassName="active"
          >
            <FiCompass className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Search Quiz</span>
          </NavLink>
          <NavLink
            to="/classroom/library"
            className="classroom_sidebar_main_item"
            activeClassName="active"
          >
            <FiBookOpen className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">My Library</span>
          </NavLink>
          <NavLink
            to="/classroom/class"
            className="classroom_sidebar_main_item"
            activeClassName="active"
          >
            <FiUsers className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Classroom</span>
          </NavLink>
          <NavLink
            to="/classroom/self-study"
            className="classroom_sidebar_main_item"
            activeClassName="active"
          >
            <FiBook className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Self Study</span>
          </NavLink>
          <NavLink
            to="/classroom/code-room"
            className="classroom_sidebar_main_item"
            activeClassName="active"
          >
            <FiCode className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Code Room</span>
          </NavLink>
          <NavLink
            to="/classroom/settings"
            className="classroom_sidebar_main_item"
            activeClassName="active"
          >
            <FiSettings className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Settings</span>
          </NavLink>
          {/* <NavLink
            to="/classroom/create-class "
            className="classroom_sidebar_main_item sidebar_create_class"
            activeClassName="active"
          >
            <FiPlus className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Create Class</span>
          </NavLink> */}
          <NavLink
            to="/"
            className="classroom_sidebar_main_item sidebar_logout"
            activeClassName="active"
            onClick={HandleLogout}
          >
            <RiLogoutCircleLine className="sidebar_item_icon" />
            <span className="classroom_sidebar_main_title">Logout</span>
          </NavLink>
        </div>
      </div>
      <Drawer
        title="Basic Drawer"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <div className="classroom_sidebar">
          <div className="classroom_sidebar_title">
            <div className="classroom_sidebar_title_heading">Mirown</div>
            <div className="classroom_sidebar_title_sub">
              <div className="classroom_sidebar_title_sub_line"></div>
              <div className="classroom_sidebar_title_sub_text">QUIZZES</div>
            </div>
          </div>

          <div className="classroom_sidebar_aid">
            <img className="classroom_sidebar_aid_img" src={image} alt="" />
            {/* Hi, We are spending $1000 every week for you. You can also help us. */}
          </div>
          <div className="classroom_sidebar_main">
            <NavLink
              exact
              to="/classroom/create"
              className="classroom_sidebar_main_item_create"
              activeClassName="active"
            >
              <FiHome className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Create</span>
            </NavLink>
            <NavLink
              to="/classroom/explore"
              className="classroom_sidebar_main_item"
              activeClassName="active"
            >
              <FiCompass className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Explore</span>
            </NavLink>
            <NavLink
              to="/classroom/library"
              className="classroom_sidebar_main_item"
              activeClassName="active"
            >
              <FiBookOpen className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">My Library</span>
            </NavLink>
            <NavLink
              to="/classroom/class"
              className="classroom_sidebar_main_item"
              activeClassName="active"
            >
              <FiUsers className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Classroom</span>
            </NavLink>
            <NavLink
              to="/classroom/self-study"
              className="classroom_sidebar_main_item"
              activeClassName="active"
            >
              <FiBook className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Self Study</span>
            </NavLink>
            <NavLink
              to="/classroom/code-room"
              className="classroom_sidebar_main_item"
              activeClassName="active"
            >
              <FiCode className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Code Room</span>
            </NavLink>
            <NavLink
              to="/classroom/settings"
              className="classroom_sidebar_main_item"
              activeClassName="active"
            >
              <FiSettings className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Settings</span>
            </NavLink>
            {/* <NavLink
              to="/classroom/create-class "
              className="classroom_sidebar_main_item sidebar_create_class"
              activeClassName="active"
            >
              <FiPlus className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Create Class</span>
            </NavLink> */}
            <NavLink
              to="/"
              className="classroom_sidebar_main_item sidebar_logout"
              activeClassName="active"
            >
              <RiLogoutCircleLine className="sidebar_item_icon" />
              <span className="classroom_sidebar_main_title">Logout</span>
            </NavLink>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
