import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

import {
  AuthErrorCodes,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, db,firebaseConfig } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import "./Signup.scss";
import quiz from "../../images/quiz-logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Tune } from "@mui/icons-material";
import { ClipLoader } from "react-spinners";
firebase.initializeApp(firebaseConfig);

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classref");
  const selfName = searchParams.get("selfname");
  const selfGrade = searchParams.get("selfgrade");
  const selfTeacherId = searchParams.get("selfteacherRef");
  const options = ["Student", "Teacher"];
  const [role, setRole] = useState("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const [password, setPassword] = useState("");
  const [loadingb, setLoadingB] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [signupCompleted, setSignupCompleted] = useState(false);
  const [newdata, setnewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const Submithandler = async (e) => {
    e.preventDefault();
    setLoadingB(true);

    const addSelfStudent = async (userId) => {
      try {
        const docRef = await addDoc(collection(db, "selfStudents"), {
          studentRef: userId,
          name: name,
          teacherRef: selfTeacherId,
          grade: selfGrade,
        });
        console.log("Document written with ID: ", docRef.id);
        toast.success("You Are Successfully Added");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      if (selfName && selfGrade && selfTeacherId) {
        addSelfStudent(user.uid);
      }
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        loginCount: 1,
        id: user.uid,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      if (role === "Student") {
        await setDoc(doc(db, "student", user.uid), {
          name,
          email,
          role,
          loginCount: 1,
          id: user.uid,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      if (role === "Teacher") {
        await setDoc(doc(db, "teacher", user.uid), {
          name,
          email,
          role,
          loginCount: 1,
          id: user.uid,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Welcome user created successfully");
      // Store data in local storage
      const userData = {
        name,
        email,
        role,
        id: user.uid,
        loginCount: 1,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      if (role === "Teacher") {
        navigate("/classroom");
      } else {
        setSignupCompleted(true);
        setnewData(userData);
        if (!classroom) {
          navigate("/");
        }
      }
      
    } catch (error) {
      console.log("Error in creating user:", error);
      toast.error("Error in creating user:", error);
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      // Create an instance of the Google provider
      const provider = new GoogleAuthProvider();

      // Sign up with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // Perform additional operations or save user data as needed
      // ...
      const userData = {
        name: user.displayName,
        email: user.email,
        role,
        loginCount: 1,
        id: user.uid,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
      // Redirect or perform any necessary actions after successful sign-up
      localStorage.setItem("userData", JSON.stringify(userData));
      setSignupCompleted(true);
      setnewData(userData);

      if (!classroom) {
        navigate("/");
        window.location.reload(true);
      }
    } catch (error) {
      console.log("Error in signing up with Google:", error);
      toast.error("Error in signing up with Google:", error);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, resetEmail);

      toast.success("Password reset email sent");
      setResetEmail(""); // Clear the email input field
    } catch (error) {
      console.log("Error in sending password reset email:", error);
      toast.error("Error in sending password reset email:", error);
    }
  };
  const handleJoinNow = async (user) => {
    try {
      // Check if the student is already in the class
      if (classroom.students.includes(user.userId)) {
        toast.error("You are already in the class!");
        navigate(`/`);
        return;
      }

      // Add ref_id to the students array in the class document
      const classDocRef = doc(db, "classes", searchQuery);
      await updateDoc(classDocRef, {
        students: firebase.firestore.FieldValue.arrayUnion(user.userId),
      });

      // Add classid to the classrooms array in the student document
      const studentDocRef = doc(db, "student", user.userId);
      await updateDoc(studentDocRef, {
        classrooms: firebase.firestore.FieldValue.arrayUnion({
          classid: searchQuery,
          classname: classroom.className,
          teacherid: classroom.teacherRef,
        }),
      });

      toast.success("Successfully joined the class!");

      navigate("/");
      window.location.reload(true);
    } catch (error) {
      console.log("Error joining the class:", error);
      toast.error("Failed to join the class");

      navigate("/");
      window.location.reload(true);
    }
  };

  const fetchClassroom = async () => {
    try {
      const classRef = collection(db, "classes");
      const classDocRef = doc(classRef, searchQuery);
      const classSnapshot = await getDoc(classDocRef);

      if (classSnapshot.exists()) {
        const classData = classSnapshot.data();
        console.log(classData);
        setClassroom(classData);
        console.log(classroom);
      } else {
        console.log("Class not found");
      }
    } catch (error) {
      console.log("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchClassroom();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signupCompleted && classroom) {
      handleJoinNow(newdata);
    }
  }, [signupCompleted, classroom]);


  return (
    <div className="container">
      {/* <div className="left-side">
        <div className="content">
          <h1>Sign Up</h1>
        </div>
        <div className="image">
          <img src={quiz} alt="" style={{ height: "380px", width: "400px" }} />
        </div>
      </div> */}
      <div className="right-side">
        <div className="inner-content">
          <div className="already">
            <p>Already have an account?</p>
            <Link to={"/login"}>
              {" "}
              <button>Login</button>
            </Link>
          </div>
          <div className="inner-content-main">
            <h3 className="form_inner-content-title">Welcome to Mirown</h3>
            <p>Register your account</p>
          </div>
          <div className="mirow_form">
            <form
              action=""
              onSubmit={Submithandler}
              className="mirow_form_main"
            >
              <label htmlFor="">Enter name</label>
              <input
                type="text"
                required
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="">Enter Email</label>
              <input
                type="email"
                required
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="">Enter Password</label>
              <input
                type="password"
                required
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="">Choose Your Role ?</label>
              <select
                defaultValue={"Student"}
                onChange={(e) => setRole(e.target.value)}
                className="signup_select"
              >
                <option value={"Student"}>Student</option>
                <option value={"Teacher"}>Teacher</option>
              </select>
              <div className="terms">
                Please Read our{" "}
                <Link className="__terms" to="">
                  Terms & Conditions
                </Link>
              </div>
              <button className="btn_original">
                {loading ? <ClipLoader color="#36d7b7" size={15} /> : "Sign Up"}{" "}
              </button>
              <div className="form_line">
                <div className="__line"></div>
                <div className="or_line"> OR </div>
                <div className="__line"></div>
              </div>
              <button className="btn_google" onClick={handleGoogleSignUp}>
                <FcGoogle size={28} /> Sign Up with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
