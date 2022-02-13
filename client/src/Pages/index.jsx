import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      <div class="row mode-select mode-display">
        <Link to="/controller">
          <h2>Controller</h2>
          <span className="text-muted">Select this from your phone.</span>
        </Link>
      </div>
      <div class="row mode-select mode-control">
        <Link to="/display">
          <h2>Display</h2>
          <span className="text-muted">Select this from your PC/TV screen.</span>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
