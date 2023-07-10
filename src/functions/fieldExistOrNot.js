// Check if username already exists

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";

const fieldExistOrNot = async (collectionName, fieldKey, fieldName) => {
  try {
    const coderoomStudentsRef = db.collection(collectionName);
    const querySnapshot = await coderoomStudentsRef
      .where(fieldKey, "==", fieldName)
      .get();

    if (!querySnapshot.empty) {
      throw new Error(
        "Username already exists. Please try a different username."
      );
    }
  } catch (error) {
    console.error("Error checking username existence:", error);
    throw error;
  }
};
export default fieldExistOrNot;
