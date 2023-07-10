import React, { useEffect, useState } from "react";
import "./HeroPage.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import getSingleField from "../../../functions/getSingleField";
import { toast } from "react-hot-toast";
import { db } from "../../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import addData from "../../../functions/addData";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const HeroPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const localData = localStorage.getItem("userData");
  const userId = localData ? JSON.parse(localData).userId : null;
  const name = localData ? JSON.parse(localData).name : null;
  const searchParams = new URLSearchParams(location.search);
  const selfName = searchParams.get("selfname");
  const selfGrade = searchParams.get("selfgrade");
  const selfTeacherId = searchParams.get("selfteacherRef");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(null);
  const [username, setUsername] = useState("");
  const addSelfStudent = async () => {
    try {
      const selfStudentsRef = collection(db, "selfStudents");

      // Check if user with the same userId already exists
      const userIdQuery = query(
        selfStudentsRef,
        where("studentRef", "==", userId)
      );
      const userIdSnapshot = await getDocs(userIdQuery);

      if (!userIdSnapshot.empty) {
        toast.error("User already exists in selfStudents collection.");
        return;
      }

      const docRef = await addDoc(selfStudentsRef, {
        studentRef: userId,
        name: name,
        teacherRef: selfTeacherId,
        grade: selfGrade,
      });

      console.log("Document written with ID: ", docRef.id);
      navigate("/");
      toast.success("You Are Successfully Added");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    if (selfName) {
      if (userId) {
        addSelfStudent();
      } else {
        navigate(
          `/signup?selfname=${selfName}&selfgrade=${selfGrade}&selfteacherRef=${selfTeacherId}`
        );
      }
    }
  }, []);
  const hangleNavigate = async (e) => {
    e.preventDefault();
    const data = await getSingleField("coderoom", search);
    setCode(data);
    if (data) {
      handleOpen();
    } else {
      toast.error("No Coderoom found");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleJoinRoom = async () => {
    const data = {
      username: username,
      coderoomId: code.id,
      teacherRef: code.teacherRef,
      createdAt: serverTimestamp(),
    };

    // Check if username already exists
    const usernameExistsQuery = query(
      collection(db, "coderoomstudents"),
      where("username", "==", username)
    );
    const usernameExistsSnapshot = await getDocs(usernameExistsQuery);
    if (!usernameExistsSnapshot.empty) {
      toast.error("Username already exists. Please try a different username.");
      return;
    }

    // Add data to Firestore
    await addData("coderoomstudents", data);
    localStorage.setItem("codeData", JSON.stringify(data));

    await navigate(`student-coderoom/${code?.id}`);
  };

  return (
    <>
      <div className="heropage_container">
        <div className="heropage_content">
          <div className="heropage_content_heading">
            Ignite Your <br />
            <span style={{ whiteSpace: "nowrap" }}>
              Learning <span className="special_words"> Journey:</span>{" "}
            </span>
            <br />
            Education Redefined!
            <span className="special_words"> </span>
          </div>
          <div className="heropage_content_des">
            Discover a world of knowledge and expand your horizons with our
            comprehensive education website.
          </div>
          <form
            onSubmit={(e) => hangleNavigate(e)}
            className="heropage_content_form"
          >
            <input
              type="text"
              placeholder="Enter Code ..."
              className="heropage_content_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="heropage_content_btn" type="submit">
              Go!
            </button>
          </form>
          <div className="heropage_content_placeholder">
            Enter Quiz Room Code e.g. 11223344
          </div>
        </div>
        <div className="heropage_img">
          <img src="./assets/bachi.png" alt="" />
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="modal_main_box">
            <div className="hero_modal_container">
              <div className="hero_modal_container_header">Quiz Lobby</div>
              <div className="hero_modal_container_header2">
                <div className="hero_modal_container_header2_line"></div>
                <div className="hero_modal_container_header2_title">
                  {code?.lessonName}
                </div>
              </div>
              <div className="hero_modal_container_body">
                <div className="hero_modal_container_body_input_container">
                  <label className="hero_modal_container_body_input_container_user">
                    Username
                  </label>
                  <input
                    className="hero_modal_container_body_input_container_el"
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="hero_modal_container_footer">
                <div className="hero_modal_container_footer_btns">
                  <div
                    onClick={handleJoinRoom}
                    className="hero_modal_container_footer_close"
                  >
                    Join
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default HeroPage;
