import React from 'react'
import "./quizes.scss"

const Quizes = ({sheduledquizes}) => {
  const date = new Date(); // Replace this with your actual date value
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  return (
    <div className='main-div-quizes'>

          {sheduledquizes?.map((classItem, index) => (
          <div
            key={index}
            className="inner-class-div-a"
            
          >
            <div className="inner-class-bar-a">
              <p className="single-class-name-a">{classItem.lessonName}</p>
              <p className="show-student-text-a">
                Starts at : {new Date(classItem.start).toLocaleDateString()} {new Date(classItem.start).toLocaleTimeString()}
              </p>
              <p className="show-student-text-b">
              {/* {const userTimezoneDateTime = new Date(utcDateTime).toLocaleString(undefined, {
    timeZone: "user", // Use the user's local time zone
    // Add additional options for formatting (e.g., dateStyle, timeStyle)
  });} */}
                End at :  {new Date(classItem.end).toLocaleDateString()} {new Date(classItem.end).toLocaleTimeString()}
              </p>
              
            </div>
            
          </div>
        ))}

    </div>
  )
}

export default Quizes