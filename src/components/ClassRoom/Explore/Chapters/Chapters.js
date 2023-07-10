import React from "react";
import "./Chapters.scss";

import mathImage from "../../../../assets/mathematics.png";
import scienceImage from "../../../../assets/chemistry.png";
import socialImage from "../../../../assets/globe.png";
import languageImage from "../../../../assets/books.png";

const Chapters = () => {
  return (
    <div className="explore_container_chapters">
      <div className="explore_container_chapters_item">
        <img
          src={languageImage}
          alt=""
          className="explore_container_chapters_item_el"
        />
        <div className="explore_container_chapters_item_title">English</div>
      </div>
      <div className="explore_container_chapters_item">
        <img
          src={mathImage}
          alt=""
          className="explore_container_chapters_item_el"
        />
        <div className="explore_container_chapters_item_title">math</div>
      </div>
      <div className="explore_container_chapters_item">
        <img
          src={scienceImage}
          alt=""
          className="explore_container_chapters_item_el"
        />
        <div className="explore_container_chapters_item_title">Science</div>
      </div>
      <div className="explore_container_chapters_item">
        <img
          src={socialImage}
          alt=""
          className="explore_container_chapters_item_el"
        />
        <div className="explore_container_chapters_item_title">
          Social Study
        </div>
      </div>
    </div>
  );
};

export default Chapters;
