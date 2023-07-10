import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./StudentCodeRoom.scss";

import getSingleField from "../../functions/getSingleField";
const StudentCodeRoom = () => {
  let params = useParams();
  const { id } = params;
  const [singleLesson, setSingleLesson] = useState({});
  const [code, setCode] = useState([]);
  console.log(code.started,"stated");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const codeData = await getSingleField("coderoom", id);
        setCode(codeData);
        const lessonData = await getSingleField(
          "lessonQuiz",
          codeData?.lessonid
        );
        setSingleLesson(lessonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="self_ground_container">
      <div className="self_ground_container_block">
        <div className="self_ground_total">
          {singleLesson?.questions?.length} Questions
        </div>
        <div className="self_ground_title">
          Lesson Name : {singleLesson?.lessonName}
        </div>

        <Link to={`/selfstudy/ground/play/${code.lessonid}?coderoomId=${id}`}>
          {code.started === "yes" && (
            <div className="self_ground_play">Play</div>
          )}
        </Link>
        {code.started === "no" && (
          <div className="self_ground_title">
            Teacher has not started the quiz yet.
          </div>
        )}
        {code.started === "end" && (
          <div className="self_ground_title">Quiz has ended.</div>
        )}

        <div className="self_ground_btns"></div>
      </div>
    </div>
  );
};

export default StudentCodeRoom;
