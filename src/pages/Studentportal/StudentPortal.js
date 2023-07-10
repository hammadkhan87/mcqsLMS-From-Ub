import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";

import { FiAlertCircle } from 'react-icons/fi';

import {
  getDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from "../../firebase";

import './StudentPortal.scss';
import AddtoClass from './Addtoclass/AddtoClass';

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

const StudentPortal = () => {
    const navigate = useNavigate();

  const localData = localStorage.getItem('userData');
  const role = localData ? JSON.parse(localData).role : null;
  const ref_id = localData ? JSON.parse(localData).userId : null;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('classref');
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

const handlelogin = ()=>{
    navigate(`/login?classref=${searchQuery}`);

}
const handleRegister =()=>{
    navigate(`/signup?classref=${searchQuery}`);

}
  const fetchClassroom = async () => {
    try {
      const classRef = collection(db, 'classes');
      const classDocRef = doc(classRef, searchQuery);
      const classSnapshot = await getDoc(classDocRef);

      if (classSnapshot.exists()) {
        const classData = classSnapshot.data();
        console.log(classData);
        setClassroom(classData);
      } else {
        console.log('Class not found');
      }
    } catch (error) {
      console.log('Error fetching class data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroom();
  }, []);

  return (
    <div className='portal-main-div'>
      {loading ? (
        <>
        <div className="loading-page">
        <p>Loading...</p>
        </div>
        </>
      ) : (
        <>
          {classroom ? (
            <>
              {role === 'Student' || role === 'Teacher' || role === 'Admin' ? (
                <div className='min-add-card-div'>
                  {/* Add your content here */}
                  <AddtoClass classroom={classroom} classid={searchQuery}/>
                </div>
              ) : (
                <div className='min-add-card-div' >
                <div className='login-register'>
                    <h3 className='name-title'>
                        To join Class {classroom.className}
                    </h3>
                    <h5 className='second-title'>Login or Regisrt First?</h5>
                <button className='btn-login-a' onClick={()=>handlelogin()} >Login</button>
                <button className='btn-Register-a' onClick={()=>handleRegister()} >Register</button>
                </div>
                </div>
              )}
            </>
          ) : (
            <>
            <div className="class-not-found-min">
            <p>Class not found</p>  
            <FiAlertCircle className="icon" />


            </div>
              
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StudentPortal;
