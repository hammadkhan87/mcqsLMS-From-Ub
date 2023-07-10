import { useEffect, useState } from "react";
import "./SelfStudy.scss";
import { db, firebaseConfig } from "../../../firebase";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import firebase from "firebase/compat/app";

import "./SelfStudy.scss";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { toast } from "react-hot-toast";
// import { toast } from "react-hot-toast";
import MaterialTable from "./MaterialTable/MaterialTable";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IoMenuOutline } from "react-icons/io5";
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
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

const SelfStudy = ({showDrawer}) => {
  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");
  const [selfStudents, setSelfStudents] = useState([]);
  const [result, setResult] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchSelfStudent = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "selfStudents"), where("teacherRef", "==", id))
      );

      const usersMap = new Map();
      const uniqueUsers = [];

      querySnapshot.forEach((doc) => {
        const userId = doc.data().studentRef;
        if (userId && !usersMap.has(userId)) {
          usersMap.set(userId, true);
          uniqueUsers.push({ id: doc.id, ...doc.data() });
        }
      });

      setSelfStudents(uniqueUsers);
      console.log(uniqueUsers, "self");
    } catch (error) {
      console.error("Error fetching self students: ", error);
    }
  };
  const fetchResults = async () => {
    try {
      const resultsSnapshot = await getDocs(collection(db, "result"));
      const results = resultsSnapshot.docs.map((doc) => doc.data());
      setResult(results);
      console.log(results, "results");
    } catch (error) {
      console.error("Error fetching results: ", error);
    }
  };
  useEffect(() => {
    fetchSelfStudent();
    fetchResults();
  }, []);
  const handleGenerate = () => {
    // const randCode = Math.floor(100000 + Math.random() * 900000).toString();
    let links = `http://localhost:3000?selfname=${name}&selfgrade=${grade}&selfteacherRef=${id}`;

    setLink(links);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard!");
        toast.success("Link copied to clipboard");
        // You can display a success message or perform additional actions here
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
        // You can display an error message or handle the error here
      });
  };

  return (
    <>
      <div className="class_selfstudy_container_classroom">
        <div className="class_selfstudy_container_classroom_main">
        <div className="mylibrary_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
          <div className="class_selfstudy_container_classroom_main_header">
            <div className="class_selfstudy_container_classroom_main_header_total">
              Student(12)
            </div>
            <div
              onClick={handleOpen}
              className="class_selfstudy_container_classroom_main_header_btn"
            >
              Add Student
            </div>
          </div>
          <div className="selfstudy_container_classroom_main_body">
            <MaterialTable selfStudents={selfStudents} result={result} />
          </div>
          <div className="selfstudy_container_classroom_main_footer">
            Add Students by name, and then share the generated link with student
            to join self study program (class), and you could monitor the
            students activities as a teacher.
          </div>
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
            <div className="self_modal_container">
              <div className="self_modal_container_header">Add Student</div>
              <div className="self_modal_container_header2">
                <div className="self_modal_container_header2_line"></div>
                <div className="self_modal_container_header2_title">
                  {/* {code?.lessonName} */}
                </div>
              </div>
              <div className="self_modal_container_body">
                <div className="self_modal_container_body_input_container">
                  <label className="self_modal_container_body_input_container_user">
                    Name
                  </label>
                  <input
                    className="self_modal_container_body_input_container_el"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="self_modal_container_body_input_container">
                  <label className="self_modal_container_body_input_container_user">
                    Grade
                  </label>
                  <input
                    className="self_modal_container_body_input_container_el"
                    placeholder="Grade"
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>
              </div>
              <div className="self_modal_container_body">
                <div className="self_modal_container_body_input_container">
                  <label className="self_modal_container_body_input_container_user">
                    <div className="self_modal_container_body_input_container_user_left">
                      Student Code
                    </div>
                    <div
                      onClick={handleGenerate}
                      className="self_modal_container_body_input_container_user_right"
                    >
                      Generate Link
                    </div>
                  </label>
                  <input
                    className="self_modal_container_body_input_container_el"
                    placeholder="Link"
                    type="text"
                    value={link}
                  />
                </div>
              </div>
              <div className="self_modal_container_footer">
                <div className="self_modal_container_footer_btns">
                  <div
                    className="self_modal_container_footer_close"
                    onClick={handleCopy}
                  >
                    Copy
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

export default SelfStudy;
