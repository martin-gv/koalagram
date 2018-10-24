import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = props => {
  const { currentUser } = props;
  return (
    <nav className="navbar fixed-top navbar-dark bg-dark">
      <div className="navbar-brand">
        <Link to="/">Koalagram</Link>
      </div>
      {currentUser ? (
        <form className="form-inline">
          <div className="logged-in">
            Logged in as
            <span className="current-user">{currentUser.username}</span>
            <div
              className="photo profile"
              style={{
                backgroundImage: "url('" + currentUser.profile_image_url + "')"
              }}
            />
          </div>
          <div className="nav-link logout" onClick={props.logout}>
            Logout
          </div>
        </form>
      ) : (
        <form className="form-inline">
          <Link className="nav-link" to="/login">
            Login
          </Link>
          <Link className="btn btn-sm btn-primary" to="/signup">
            Sign up
          </Link>
        </form>
      )}
    </nav>
  );
};

export default Navbar;
