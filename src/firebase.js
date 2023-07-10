import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA-wRCCAglm7K2PHNiGBEfMR7SQCgQc_m8",
  authDomain: "course-6b513.firebaseapp.com",
  projectId: "course-6b513",
  storageBucket: "course-6b513.appspot.com",
  messagingSenderId: "28128940126",
  appId: "1:28128940126:web:bcae019fe84efc0bb6e4cf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
