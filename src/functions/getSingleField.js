import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const getSingleField = async (collectionName, fieldId) => {
  try {
    const docRef = doc(db, collectionName, fieldId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document exists, retrieve the data
      return {id:docSnap.id,...docSnap.data()};
    } else {
      // Document does not exist
      console.log("Document not found.");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};
export default getSingleField;
