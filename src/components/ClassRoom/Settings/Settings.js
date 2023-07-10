import React, { useEffect, useState } from "react";
import "./Settings.scss";
import { auth, db } from "../../../firebase";
import {
  updateProfile as updateAuthProfile,
  updateEmail as updateAuthEmail,
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { IoMenuOutline } from "react-icons/io5";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Settings = ({showDrawer}) => {
  const localData = localStorage.getItem("userData");
  const userData = localData ? JSON.parse(localData) : null;
  const userId = localData ? JSON.parse(localData).userId : null;
  const id = localData ? JSON.parse(localData).id : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState(""); // Add password state
  const [open, setOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, resetEmail);

      toast.success("Password reset email sent");
      setResetEmail(""); // Clear the email input field
      navigate("/login");
    } catch (error) {
      console.log("Error in sending password reset email:", error);
      toast.error("Error in sending password reset email:", error);
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const updateUserData = async (id, data) => {
    try {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, data);
      console.log("User data updated successfully!");

      // Sign in the user again to refresh the authentication token
      try {
        // const userCredential = await signInWithEmailAndPassword(
        //   auth,
        //   email,
        //   password
        // );

        // Update user data in Firebase Authentication
        // const user = userCredential.user;
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        updateAuthEmail(user, data.email)
          .then(() => {
            // Email updated!
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
          });

        console.log(
          "User profile and email updated successfully in Firebase Authentication!"
        );
        if (userData) {
          userData.name = name;
          userData.email = email;
        }

        // Save the updated object back to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
        // Handle password change
        if (newPassword) {
          await updatePassword(auth, newPassword);
          console.log("Password updated successfully!");
        }

        // Handle any additional actions after successful update
      } catch (signInError) {
        console.error("Error signing in the user:", signInError);
        // Handle sign-in error scenario
      }
    } catch (updateDocError) {
      console.error("Error updating user data:", updateDocError);
      // Handle update document error scenario
    }
  };

  useEffect(() => {
    // Fetch the user data from Firestore and update the state
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        console.log("userDocRef", userDocRef);

        const userDocSnapshot = await getDoc(userDocRef);
        console.log("userDocSnapshot", userDocSnapshot);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          console.log("userData", userData);

          setName(userData.name);
          setEmail(userData.email);
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error scenario
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async (e) => {
    // Make the function async
    e.preventDefault();

    // Prepare the data to update in Firestore
    const data = {
      name: name,
      email: email,
    };

    // Update the user information in Firestore and Firebase Authentication
    try {
      await updateUserData(id, data);
      console.log("User data updated successfully!");
      // Handle any additional actions after successful update
    } catch (error) {
      console.error("Error updating user data:", error);
      // Handle error scenario
    }
  };

  return (
    <div className="settings_container">
      <div className="settings_title">
        <div className="mylibrary_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
        Account Settings
      </div>
      <form className="settings_form" onSubmit={handleSaveChanges}>
        <div className="settings_input_container">
          <div className="settings_input_item">
            <label className="settings_input_label">Name</label>
            <input
              className="settings_input_elem"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="settings_input_item">
            <label className="settings_input_label">Email</label>
            <input
              className="settings_input_elem"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="settings_input_item">
            <label className="settings_input_label">Password</label>
            <input
              className="settings_input_elem"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="settings_input_item_btns">
            <div className="reset" onClick={handleOpen}>
              Reset Password
            </div>
            <button type="submit" className="settings_input_item_btn">
              Save Changes
            </button>
          </div>
        </div>
      </form>
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
            <div className="forget_inner-content">
              <div className="forget_inner-content-2">Forget Password</div>
              <div className="forget_form">
                <label htmlFor="">Enter Email for Password Reset</label>
                <input
                  className="forget_form_el"
                  type="email"
                  placeholder="Enter Email for Password"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button className="forget_btn" onClick={handleForgotPassword}>
                  Reset Password
                </button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Settings;
