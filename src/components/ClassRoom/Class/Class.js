import React, { useState, useEffect } from "react";

import "./Class.scss";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CiMenuKebab } from "react-icons/ci";

import { toast } from "react-hot-toast";
import { auth, db, firebaseConfig } from "../../../firebase";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import SingleClass from "./SingleClass/SingleClass";
import {IoMenuOutline} from "react-icons/io5"

import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import "firebase/compat/storage";
import { Menu, MenuItem } from "@mui/material";
import {
  writeBatch,
  arrayRemove,
  addDoc,
  deleteDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Add } from "@mui/icons-material";

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Class = ({showDrawer}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openb, setOpenB] = useState(false);
  const [openc, setOpenC] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [classname, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [role, setRole] = useState("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentid, setStudentId] = useState("");
  const [students, setStudents] = useState([]);
  const [password, setPassword] = useState("");
  const [classroom, setClassroom] = useState([selectedClass.id]);
  const [change, setChange] = useState("");
  const [renamevalue, SetRenamevalue] = useState("");
  const [selectedClassOpen, setSelectedClassOpen] = useState(false);

  const localData = localStorage.getItem("userData");
  const roleA = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const re_id = localData ? JSON.parse(localData).id : null;
  const tname = localData ? JSON.parse(localData).name : null;
  console.log(selectedClass);

  const [text, setText] = useState("");

  const handleMenuOpen = (event, classItem) => {
    setSelectedClass(classItem);
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleAddStudent = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };
  const handleRenameClass = () => {
    setOpenC(true);
    SetRenamevalue(selectedClass.className);
    setMenuOpen(false);
  };

  const handleGenerateCode = () => {
    setText(`127.0.0.1:3000/student-portal?classref=${selectedClass.id}`);
    console.log("genrate code");
    setOpenB(true);
    setMenuOpen(false);
    // Logic for handling "Generate Code" option
  };
  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };
  const handleClassClick = (e,classItem) => {
    setSelectedClass(classItem);
    setSelectedClassOpen(true);
    navigate(`class-Singleclass?classid=${classItem.id}`);
  };

  const updateClassName = async () => {
    if (!renamevalue) {
      toast.error("Please enter a class name");
      return;
    }

    try {
      // Create a reference to the existing class document
      const classRef = doc(db, "classes", selectedClass.id);

      // Update the class name field
      await updateDoc(classRef, {
        className: renamevalue,
      });

      // Show success toast
      toast.success("Class name updated successfully!");

      // Reset the input value

      // Close the modal
      setOpenC(false);
      setChange("D");
    } catch (error) {
      // Handle any errors that occur during the saving process
      console.error("Error updating class name: ", error);
      toast.error("An error occurred while updating the class name");
      setOpenC(false);
      setChange("D");
    }
  };

  const handleDeleteClass = async () => {
    setMenuOpen(false);

    const confirmMessage = `Are you sure you want to delete ${selectedClass.className} class?`;

    confirmAlert({
      title: "Confirm Deletion",
      message: confirmMessage,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              // Delete class from classes collection
              await deleteDoc(doc(db, "classes", selectedClass.id));

              const studentsQuery = query(collection(db, "student"));
              const studentsSnapshot = await getDocs(studentsQuery);
              const batch = writeBatch(db);

              studentsSnapshot.forEach((doc) => {
                const studentRef = doc.ref;
                const studentData = doc.data();
                const classroomsArray = studentData.classrooms;

                // Check if the classrooms field exists and is an array
                if (Array.isArray(classroomsArray)) {
                  const updatedClassrooms = classroomsArray?.filter(
                    (classroom) => classroom.classid !== selectedClass.id
                  );
                  batch.update(studentRef, {
                    classrooms: updatedClassrooms,
                  });
                }
              });

              await batch.commit();

              toast.success("Class deleted successfully!");

              setChange("c");
            } catch (error) {
              console.error("Error deleting class: ", error);
              toast.error("Failed to delete class. Please try again later.");
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // No action needed
          },
        },
      ],
    });
  };
  const handleInput = (e) => {
    setClassName(e.target.value);
  };

  const handleSave = async () => {
    console.log("handlesve");
    setStudents([]);
    // Validate the input value
    if (!classname) {
      toast.error("Please enter a class name");
      return;
    }

    try {
      // Create a new document in the "classes" collection
      const docRef = await addDoc(collection(db, "classes"), {
        className: classname,
        students: students,
        teacherRef: re_id,
        teachername: tname,
        createdAt: serverTimestamp(),
      });

      // Show success toast
      toast.success("Class added successfully!");

      // Reset the input value
      setClassName("");
      setChange("a");

      // Close the modal
      setOpen(false);
    } catch (error) {
      // Handle any errors that occur during the saving process
      console.error("Error adding class: ", error);
      toast.error("An error occurred while adding the class");
    }
  };

  const fetchClasses = async () => {
    try {
      // Create a query to fetch the classes where teacherRef is equal to ref_id
      const q = query(
        collection(db, "classes"),
        where("teacherRef", "==", re_id)
      );
      const querySnapshot = await getDocs(q);

      // Map through the query snapshot and extract the class data
      const fetchedClassesa = querySnapshot?.docs?.map((doc) => ({
        id: doc.id,
        className: doc.data().className,
        studentsize: doc.data().students.length,
      }));

      // Update the state with the fetched classes
      setClasses(fetchedClassesa);
      console.log(classes);
    } catch (error) {
      console.error("Error fetching classes: ", error);
      toast.error("An error occurred while fetching classes");
    }
  };
  const AddStudenthandler = async (e) => {
    if (!name || !email || !password) {
      toast.error("Please enter all values");
      return;
    }

    
        try {
          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = result.user;
          // Add the student to the "users" collection
          const userDocRef = await setDoc(doc(db, "users", user.uid,
          ), {
            name,
            email,
            role: role,
            loginCount: 1,
            id:user.uid,
            userId: user.uid,
            createdAt: serverTimestamp(),
          });

          if (role === "Student") {
            // Add the student to the "students" collection
            const studentDocRef = await setDoc(doc(db, "student",result.user.uid), {
              name,
              email,
              id:user.uid,
              userId:user.uid,
              classrooms: [
                {
                  classid: selectedClass.id,
                  classname: selectedClass.className,
                  teacherid: re_id,
                },
              ], // Add the selected class ID to the student's classrooms array
              role: role,
              loginCount: 1,
              userId: result.user.uid,
              createdAt: serverTimestamp(),
            });

            const classRef = doc(db, "classes", selectedClass.id);

            // Update the document with the new value for the students field
            await updateDoc(classRef, {
              students: firebase.firestore.FieldValue.arrayUnion(
                user.uid
              ), // Add the new student ID to the students array of the selected class
            });

            toast.success("Student added successfully!");
          } else if (role === "Teacher") {
            // Add the teacher to the "teachers" collection
            await addDoc(collection(db, "teachers"), {
              name,
              email,
              role,
              loginCount: 1,
              userId: result.user.uid,
              createdAt: serverTimestamp(),
            });
          }
          setChange("b");
          toast.success("User created successfully");
          setModalOpen(false);
          // Store data in local storage
          const userData = {
            name,
            email,
            classrooms: [selectedClass.id],
            role,
            loginCount: 1,
            userId: result.user.uid,
            createdAt: serverTimestamp(),
          };
        } catch (e) {
          console.log("Error in adding document", e);
          toast.error("An error occurred while adding the student");
          setModalOpen(false);

        }
  };

  useEffect(() => {
    fetchClasses();
    setClassroom(selectedClass.id);
  }, [change]);

  return (
    <div className="class-main-div">
      <div className="main-bar">
      <div className="classroom_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
        <p className="my-text">My Classes</p>
        <button className="create-class-btn" onClick={() => setOpen(true)}>
          Create Class +
        </button>
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h5" component="h2" id="transition-modal-title">
              Create Class
            </Typography>
            <Typography
              variant="body1"
              id="transition-modal-description"
              sx={{ mt: 2 }}
            >
              <input
                required
                type="text"
                placeholder="Enter Class Name"
                onChange={handleInput}
                style={{
                  padding: "6px",
                  border: "1px solid blue",
                  borderRadius: "5px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => handleSave()}
                  style={{
                    backgroundColor: "blue",
                    width: "100px",
                    marginLeft: "10px",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    backgroundColor: "",
                    marginLeft: "10px",
                    color: "gray",
                    padding: "8px 12px",
                    width: "100px",
                    borderRadius: "5px",
                    border: "1px solid black",
                  }}
                >
                  Cancel
                </button>
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>

      <div className="class-main">
        {classes?.map((classItem, index) => (
          <div
            key={index}
            className="inner-class-div"
            
          >
            <div className="inner-class-bar" onClick={(e) => handleClassClick(e,classItem)}>
              <p className="single-class-name">{classItem.className}</p>
              
              <p className="show-student-text">
                {classItem.studentsize} Students
              </p>
           
              
            </div>
            <CiMenuKebab
                style={{ cursor: "pointer", marginTop:"10px", marginRight:"5px"}}
                onClick={(event) => handleMenuOpen(event, classItem)}
              />
          </div>
        ))}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          style={{ fontSize: "12px", cursor: "pointer" }}
          onClick={() => handleAddStudent()}
        >
          Add Student
        </MenuItem>
        <MenuItem
          style={{ fontSize: "12px", cursor: "pointer" }}
          onClick={() => handleGenerateCode()}
        >
          Generate Link
        </MenuItem>
        <MenuItem
          style={{ fontSize: "12px", cursor: "pointer" }}
          onClick={() => handleRenameClass()}
        >
          Rename class
        </MenuItem>
        <MenuItem
          style={{ fontSize: "12px", cursor: "pointer" }}
          onClick={() => handleDeleteClass()}
        >
          DeleteClass
        </MenuItem>
      </Menu>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={style}>
            <Typography variant="h5" component="h2" id="transition-modal-title">
              Add Student to Class
            </Typography>
            <Typography
              variant="body1"
              id="transition-modal-description"
              sx={{ mt: 2 }}
            >
              <input
                required
                type="text"
                placeholder="Enter Name"
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: "6px",
                  border: "1px solid blue",
                  borderRadius: "5px",
                }}
              />
              <input
                required
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "6px",
                  border: "1px solid blue",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
              <input
                required
                type="text"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "6px",
                  border: "1px solid blue",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => AddStudenthandler()}
                  style={{
                    backgroundColor: "blue",
                    width: "100px",
                    marginLeft: "10px",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: "",
                    marginLeft: "10px",
                    color: "gray",
                    padding: "8px 12px",
                    width: "100px",
                    borderRadius: "5px",
                    border: "1px solid black",
                  }}
                >
                  Cancel
                </button>
              </div>

              {/* Your additional form elements and logic for adding a student */}
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openb}
        onClose={() => setOpenB(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openb}>
          <Box sx={style}>
            <Typography variant="h5" component="h2" id="transition-modal-title">
              Genrate Link
            </Typography>
            <Typography
              variant="body1"
              id="transition-modal-description"
              sx={{ mt: 2 }}
            >
              <p id="copyText" style={{ fontSize: "14px", color: "gray" }}>
                {text}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={copyTextToClipboard}
                  style={{
                    backgroundColor: "blue",
                    width: "100px",
                    marginLeft: "10px",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => setOpenB(false)}
                  style={{
                    backgroundColor: "",
                    marginLeft: "10px",
                    color: "gray",
                    padding: "8px 12px",
                    width: "100px",
                    borderRadius: "5px",
                    border: "1px solid black",
                  }}
                >
                  Cancel
                </button>
              </div>
              {/* Your additional form elements and logic for adding a student */}
            </Typography>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openc}
        onClose={() => setOpenC(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openc}>
          <Box sx={style}>
            <Typography variant="h5" component="h2" id="transition-modal-title">
              Rename Class
            </Typography>
            <Typography
              variant="body1"
              id="transition-modal-description"
              sx={{ mt: 2 }}
            >
              <input
                type="text"
                placeholder="Enter new Class Name"
                value={renamevalue}
                onChange={(e) => SetRenamevalue(e.target.value)}
                style={{
                  padding: "6px",
                  border: "1px solid blue",
                  borderRadius: "5px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={updateClassName}
                  style={{
                    backgroundColor: "blue",
                    width: "100px",
                    marginLeft: "10px",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => setOpenC(false)}
                  style={{
                    backgroundColor: "",
                    marginLeft: "10px",
                    color: "gray",
                    padding: "8px 12px",
                    width: "100px",
                    borderRadius: "5px",
                    border: "1px solid black",
                  }}
                >
                  Cancel
                </button>
              </div>
              {/* Your additional form elements and logic for adding a student */}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Class;
