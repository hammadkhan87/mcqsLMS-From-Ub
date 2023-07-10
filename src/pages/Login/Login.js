import React, { useEffect, useState } from "react";
import "./login.scss";
import quiz from "../../images/quiz-logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, firebaseConfig } from "../../firebase";
import firebase from "firebase/compat/app";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
firebase.initializeApp(firebaseConfig);

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classroom, setClassroom] = useState(null);

  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("classref");

  const navigate = useNavigate();

  const getUser = () => {};
  useEffect(() => {
    getUser();
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();

     signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const Signeduser = userCredential.user;
        const collectionRef = collection(db, "users");
        getDocs(collectionRef).then((data) => {
          const users = data.docs.map((item) => {
            return { ...item.data(), id: item.id };
          });
          // Match the user within the collection
          const matchedUser = users.find((user) => {
            return user.email === Signeduser.email;
          });
          // Update the login count
          const userDocRef1 = doc(collection(db, "users"), matchedUser.id);
          updateDoc(userDocRef1, {
            loginCount: matchedUser.loginCount + 1,
          })
            .then(() => {
              console.log("User login count updated successfully!");
            })
            .catch((error) => {
              console.log("Error updating user login count:", error);
            });
          const userDocRef2 = doc(collection(db, "student"), matchedUser.id);
          updateDoc(userDocRef2, {
            loginCount: matchedUser.loginCount + 1,
          })
            .then(() => {
              console.log("User login count updated successfully!");
            })
            .catch((error) => {
              console.log("Error updating user login count:", error);
            });
          const userDocRef3 = doc(collection(db, "teacher"), matchedUser.id);
          updateDoc(userDocRef3, {
            loginCount: matchedUser.loginCount + 1,
          })
            .then(() => {
              console.log("User login count updated successfully!");
            })
            .catch((error) => {
              console.log("Error updating user login count:", error);
            });
          localStorage.setItem("userData", JSON.stringify(matchedUser));
         
          if (matchedUser.role === "Teacher") {
            navigate("/classroom");
          }
          if (matchedUser.role === "Student") {
            if(searchQuery){
            handleJoinNow(matchedUser);
            }else{
              navigate("/");

            }

          }
          
        
          
          //window.location.reload(true);
          // Do something with the matched user
        });

        setError(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Error: " + error.message);
        setError(true);
      });
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

  const handleJoinNow = async (matchedUser) => {
    console.log("call join")
    try {
      // Check if the student is already in the class
      if (classroom.students.includes(matchedUser.id)) {
        toast.error("You are already in the class!");
        navigate(`/`);
        return;
      }
      // Add ref_id to the students array in the class document
      const classDocRef = doc(db, "classes", searchQuery);
      await updateDoc(classDocRef, {
        students: firebase.firestore.FieldValue.arrayUnion(matchedUser.id),
      });
      console.log("added",matchedUser)
      // Add classid to the classrooms array in the student document
      const studentDocRef = doc(db, "student", matchedUser.id);
      await updateDoc(studentDocRef, {
        classrooms: firebase.firestore.FieldValue.arrayUnion({
          classid: searchQuery,
          classname: classroom.className,
          teacherid: classroom.teacherRef,
        }),
      });

      toast.success("Successfully joined the class!");
      navigate(`/`);
    } catch (error) {
      console.log("Error joining the class:", error);
      toast.error("Failed to join the class");
      navigate(`/`);
    }
  };
  console.log(classroom);
  useEffect(() => {
    {
      searchQuery ? fetchClassroom() : setLoading(false);
    }
  }, []);
  return (
    <div className="container">
      {/* <div className="left-side">
        <div className="content">
          <h1>Login</h1>
        </div>
        <div className="image">
          <img src={quiz} alt="" style={{ height: "380px", width: "400px" }} />
        </div>
      </div> */}
      <div className="right-side">
        <div className="inner-content">
          <div className="already">
            <p>Create an account?</p>
            <Link to={"/signup"}>
              <button>Signup</button>
            </Link>
          </div>
          <div className="inner-content-2">
            <h3 className="form_inner-content-title">Welcome to Mirown</h3>
            <p className="inner-content-2_p"> Login & start playing</p>
          </div>
          <div className="mirow_form">
            <form className="mirow_form_main" onSubmit={handleLogin}>
              <label htmlFor="">Enter Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="">Enter Password</label>
              <input
                placeholder="Enter Password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn_forget"
                onClick={() => navigate("/forgetpassword")}
              >
                Forget Password
              </button>
              <button className="btn_original">Login</button>
            </form>
            {error && <span>Wrong Email an password!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
