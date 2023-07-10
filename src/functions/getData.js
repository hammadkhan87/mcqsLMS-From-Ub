import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const getData = async (collectionName) => {
  await getDocs(collection(db, collectionName)).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return newData;
  });
};

export default getData;
