import React from "react";
import "./Footer.scss";
import { BsTwitter } from "react-icons/bs";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
const Footer = () => {
  return (
    <div>
      <footer>
        <section className="ft-main">
          <div className="ft-main-item">
            <h2 className="ft-title">About</h2>
            <ul className="social_container">
              <li>
                <a href="#">
                  <FaFacebookF /> Facebook
                </a>
              </li>
              <li>
                <a href="#">
                  <BsTwitter /> Twitter
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <BsInstagram /> Instagram
                </a>
              </li>
              <li>
                <a href="#">
                  <FaLinkedinIn /> Linkedin
                </a>
              </li>
              <li>
                <a href="#">
                  <AiOutlineYoutube /> Youtube
                </a>
              </li>
            </ul>
          </div>
          <div className="ft-main-item">
            <h2 className="ft-title">Policies and Guidelines</h2>
            <ul>
              <li>
                <a href="#">Terms &amp; Conditions</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="ft-main-item">
            <h2 className="ft-title">Contact</h2>
            <ul>
              <li>
                <a href="#">Support@mirown.com</a>
              </li>
              <li>
                <a href="#">Business@mirown.com</a>
              </li>
              <li>
                <a href="#">Technicalissue@mirown.com</a>
              </li>
            </ul>
          </div>
        </section>

        {/* <section className="ft-social">
          <ul className="ft-social-list">
            <li>
              <a href="#">
                <FaFacebookF />
              </a>
            </li>
            <li>
              <a href="#">
                <BsTwitter />
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <BsInstagram />
              </a>
            </li>
            <li>
              <a href="#">
                <FaLinkedinIn />
              </a>
            </li>
            <li>
              <a href="#">
                <AiOutlineYoutube />
              </a>
            </li>
          </ul>
        </section> */}

        <section className="ft-legal">
          <ul className="ft-legal-list">
            <li>&copy; 2023 Copyright Mirown </li>
          </ul>
        </section>
      </footer>
    </div>
  );
};

export default Footer;
