import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const addData = async (collectionName, dataObject) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), dataObject);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default addData;
