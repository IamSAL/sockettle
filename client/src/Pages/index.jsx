import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      <div class="row mode-select mode-display">
        <Link to="/controller">
          <h2>Controller</h2>
        </Link>
      </div>
      <div class="row mode-select mode-control">
        <Link to="/display">
          <h2>Display</h2>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
