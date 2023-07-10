import { detailCourse } from "./data";
import { auth, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

const addArrayToFirestore = async () => {
  const collectionRef = collection(db, "collectionName");

  try {
    for (const data of detailCourse) {
      const docRef = await addDoc(collectionRef, data);
      console.log("Document written with ID: ", docRef.id);
    }
  } catch (error) {
    console.error("Error adding documents: ", error);
  }
};

export default addArrayToFirestore;