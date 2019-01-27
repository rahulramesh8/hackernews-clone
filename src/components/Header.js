import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import { AUTH_TOKEN } from "../constants";

const Header = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex pal justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News - Rahulio Version</div>
        <Link to="/" className="ml1 no-underline black">
          New
        </Link>
        <div className="ml1">|</div>
        <Link to="/create" className="ml1 no-underline black">
          Submit
        </Link>
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              props.history.push("/");
            }}
          >
            Logout
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
