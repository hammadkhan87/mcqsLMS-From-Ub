import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import HeroPage from "../../components/HomePage/HeroPage/HeroPage";
import Testimonials from "../../components/HomePage/Testimonials/Testimonials";
import Courses from "../../components/CoursesList/Courses/Courses";
import Reviews from "../../components/HomePage/Reviews/Reviews";
import OurAims from "../../components/HomePage/OurAims/OurAims";
import { toast } from "react-hot-toast";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const localData = localStorage.getItem("userData");
  const userId = localData ? JSON.parse(localData).userId : null;
  const name = localData ? JSON.parse(localData).name : null;
  const role = localData ? JSON.parse(localData).role : null;
  const searchParams = new URLSearchParams(location.search);
  const selfName = searchParams.get("selfname");
  const selfGrade = searchParams.get("selfgrade");
  const selfTeacherId = searchParams.get("selfteacherRef");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(null);
  const [username, setUsername] = useState("");
  if (role === "Teacher") {
    navigate("/classroom/explore");
  }
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
      toast.error("Error adding ")
    }
  };

  // useEffect(() => {
  //   if (selfName) {
  //     if (userId) {
  //       addSelfStudent();
  //     } else {
  //       navigate(
  //         `/signup?selfname=${selfName}&selfgrade=${selfGrade}&selfteacherRef=${selfTeacherId}`
  //       );
  //     }
  //   }
  // }, []);
  return (
    <>
      <div className="homepage_container">
        <HeroPage />
        <Reviews />
        <Courses category="languages" />
        <Courses category="english" />
        <Courses category="math" />
        <Courses category="science" />
        <Testimonials />
        {/* <OurAims /> */}
      </div>
    </>
  );
};

export default HomePage;
