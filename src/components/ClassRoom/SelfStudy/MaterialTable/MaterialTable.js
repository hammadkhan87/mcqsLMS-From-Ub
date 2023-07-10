import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import "./MaterialTable.scss";
import { BiSearchAlt2 } from "react-icons/bi";

export default function MaterialTable({ selfStudents, result }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleNavigation = (id) => {
    navigate(`users/${id}?id=${id}`);
  };

  const filteredStudents = selfStudents.filter((student) => {
    const fullName = student.name.toLowerCase();
    const searchQuery = search.toLowerCase();
    return fullName.includes(searchQuery);
  });
  const getLastResultGiven = (studentId) => {
    const studentResults = result.filter(
      (result) => result.userId === studentId
    );
    const sortedResults = studentResults.sort(
      (a, b) => b.givenAt.seconds - a.givenAt.seconds
    );
    return sortedResults.length > 0 ? sortedResults[0].givenAt.toDate() : null;
  };

  const formatDateTime = (date) => {
    const options = {
      dateStyle: "medium",
      timeStyle: "short",
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="self_table_container">
      <div className="self_table_container_header">
        <div className="self_table_container_header_item">Name</div>
        <div className="self_table_container_header_item">Grade</div>
        <div className="self_table_container_header_item">Last Played</div>
        <div className="self_table_container_header_search">
          <div className="self_table_container_header_search_con">
            <input
              type="text"
              className="self_table_container_header_search_el"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <BiSearchAlt2 className="self_table_container_header_search_ic" />
          </div>
        </div>
      </div>
      <div className="self_table_container_body">
        {filteredStudents.map((student, id) => {
          const lastResultGiven = getLastResultGiven(student.studentRef);
          return (
            <div key={id} className="self_table_container_body_row">
              <div className="self_table_container_body_row_item">
                {student.name}
              </div>
              <div className="self_table_container_body_row_item">
                G. {student.grade}
              </div>
              <div className="self_table_container_body_row_item last_result_given">
              {lastResultGiven ? formatDateTime(lastResultGiven) : "-"}
              </div>
              <div className="self_table_container_body_row_item">
                <div
                  className="self_table_container_body_row_item_btn"
                  onClick={() => handleNavigation(student.studentRef)}
                >
                  view
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
