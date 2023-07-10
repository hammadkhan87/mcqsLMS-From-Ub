  import React, { useEffect, useState } from "react";
  import "./ClassSettings.scss";
  import { useLocation } from "react-router-dom";
  import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@material-ui/core";
  import DeleteIcon from "@material-ui/icons/Delete";

  import firebase from "firebase/compat/app";

  import "firebase/compat/storage";
  import { db, firebaseConfig } from "../../../../../firebase";
  import {
    addDoc,
    collection,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    ref,
    query,
    where,
    getFirestore,
    serverTimestamp,
  } from "firebase/firestore";
  import { toast } from "react-hot-toast";
  import { writeBatch } from 'firebase/firestore';

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();
  const Settings = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("classid");
    const [change,setChange]= useState("")


    const fetchStudents = async () => {
      const studentsCollection = collection(db, "student");
      const snapshot = await getDocs(studentsCollection);
      const studentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))?.filter((student) => {
        const classrooms = student.classrooms || []; // Ensure classrooms is an array
        if (Array.isArray(classrooms)) {
          return classrooms.some((obj) => obj.classid === searchQuery);
        }
        return false;
      });
      setStudents(studentData);
    };
    const handleDelete = async (student) => {
      if (student) {
        setSelectedStudent(student);
        console.log(student.id)
        setOpenDialog(true);
      }
    };
    const handleDeleteConfirmation = async () => {
      const firestore = getFirestore();
    
      if (selectedStudent) {
        console.log(selectedStudent.id)
        const studentRef = doc(collection(db, "student"), selectedStudent.id);
        const studentDoc = await getDoc(studentRef);
    
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          const classrooms = studentData.classrooms || [];
    
          // Check if classrooms is an array
          if (Array.isArray(classrooms)) {
            const updatedClassrooms = classrooms?.filter(
              (obj) => obj.classid !== searchQuery
            );
    
            if (updatedClassrooms.length !== classrooms.length) {
              await updateDoc(studentRef, { classrooms: updatedClassrooms });
              toast.success("Student Removed");
            }
          }
        }
        const classRef = doc(collection(db, "classes"), searchQuery);
        const classDoc = await getDoc(classRef);
    
        if (classDoc.exists()) {
          const classData = classDoc.data();
          const students = classData.students || [];
    
          // Check if students is an array
          if (Array.isArray(students)) {
            const updatedStudents = students?.filter(
              (studentId) => studentId !== selectedStudent.id
            );
    
            if (updatedStudents.length !== students.length) {
              // Update the class document with the updated students array
              await updateDoc(classRef, { students: updatedStudents });
              toast.success("Student Removed");
              setChange("c")
            }
          }
        }
    
        setOpenDialog(false);
        setSelectedStudent(null);
      }
    };
    
    useEffect(() => {
      fetchStudents();
      console.log(students);
    }, [change]);
    return (
      <div className="class-setting-main-div">
        <div className="setting-student-data">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(student)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Delete Confirmation</DialogTitle>
            <DialogContent>
              Are you sure you want to delete the student?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirmation}
                color="secondary"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  };

  export default Settings;
