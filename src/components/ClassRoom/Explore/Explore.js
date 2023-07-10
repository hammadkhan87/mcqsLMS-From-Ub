import React, { useEffect, useState } from "react";
import "./Explore.scss";
import Chapters from "./Chapters/Chapters";
import { ArrowRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { BsSearch } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { IoMenuOutline } from "react-icons/io5";

const Explore = ({ showDrawer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = query(
        collection(db, "lessonQuiz"),
        where("lessonName", ">=", searchQuery),
        where("lessonName", "<=", searchQuery + "\uf8ff")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const suggestions = snapshot.docs.map((doc) => doc.data().lessonName);
        setSuggestions(suggestions);
      });

      return () => unsubscribe();
    };

    if (searchQuery.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
    console.log(suggestions);
    console.log(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
  };

  const RedirectPage = (e) => {
    e.preventDefault();
    navigate(`self-search-quiz`);
  };

  return (
    <div className="explore_container">
      <div className="explore_container_header">
        <div className="explore_sidebar_title_menu" onClick={showDrawer}>
          <IoMenuOutline />
        </div>
      </div>
      <div className="explore_container_body">
        <div className="explore_container_title">
          <div className="explore_container_title">Search Quizzes</div>
          <div className="explore_container_des">
            Lets find and assign something to students
          </div>
        </div>

        <div className="explore_search-bar" onClick={(e) => RedirectPage(e)}>
          <div className="explore_search-input-container">
            <FaSearch className="explore_search-icon" />
            <input
              // value={searchTerm}
              type="text"
              className="explore_search-input"
              placeholder="Search Quiz..."
              // onChange={handleSearch}
            />
          </div>
          <button
            className="explore_search-button"
            // onClick={() => fetchLessons()}
          >
            Search
          </button>
        </div>
        <div className="suggestions_container">
          {suggestions.map((suggestion, index) => (
            <div
              className="suggestions_container_item"
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <BsSearch className="suggestions_container_item_icon" />
              {suggestion}
            </div>
          ))}
        </div>
        <Chapters />
      </div>
    </div>
  );
};

export default Explore;
