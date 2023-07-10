import React from "react";
import "./Testimonial.scss";
import { GoQuote } from "react-icons/go";
import { Rating } from "@mui/material";
const Testimonial = ({ client }) => {
  return (
    <div className="testimonial_container">
      <div className="testimonial_container_quote">
        <GoQuote className="testimonial_container_quote_icon" />
      </div>
      <div className="testimonial_container_right">
        <div className="testimonial_container_right_text">{client.review}</div>
        <div className="testimonial_container_quote quote_right">
          <GoQuote className="testimonial_container_quote_icon quote_right_icon" />
        </div>
        <div className="testimonial_container_right_line"></div>
        <div className="testimonial_container_right_footer">
          <div className="testimonial_container_right_footer_profile">
            <img
              className="testimonial_container_right_footer_profile_img"
              src={client.linkPath}
              alt={client.name}
            />
          </div>
          <div className="testimonial_container_right_footer_right">
            <div className="testimonial_container_right_footer_right_name">
              {client.name}
            </div>
            <div className="testimonial_container_right_footer_right_stars">
              <Rating
                name="half-rating"
                defaultValue={client.stars}
                precision={0.5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
