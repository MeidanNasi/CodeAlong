import React from "react";
import Stopwatch from "../Stopwatch/stopwatch";
import logo from "../../assets/logo.png";
import "./sidenav.css";

const Sidenav = props => {
  return (
    <div className="sidenav">
      <div className="sidenav-container">
        <img src={logo} alt="Logo" className="logo" />
        <Stopwatch />
      </div>
    </div>
  );
};

export default Sidenav;
