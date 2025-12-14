import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/Logo.png" alt="Incu-bite" className="footer-logo" />
            <p className="footer-tagline">Sweet moments, perfectly managed</p>
          </div>
          <div className="footer-copyright">
            <p>
              &copy; {new Date().getFullYear()} Incu-bite. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
