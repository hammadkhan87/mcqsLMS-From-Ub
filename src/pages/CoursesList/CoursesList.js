import React, { useState } from "react";
import "./CoursesList.scss";
import { useParams } from "react-router-dom";
import { courses } from "../../data";
import Course from "../../components/CoursesList/Course/Course";
import { useMemo } from "react";
import Pagination from "../../components/Pagination/Pagination";

let PageSize = 10;
const CoursesList = () => {
  const { id } = useParams();
  const filteredData = courses.filter((item) => item.category == id);

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  return (
    <div className="courseslist_container">
      <div className="courseslist_container_header">{id}</div>
      <div className="courseslist_container_body">
        {currentTableData.map((course) => {
          return <Course key={course.id} course={course} />;
        })}
      </div>
      <div className="courseslist_container_footer">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={filteredData.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default CoursesList;
