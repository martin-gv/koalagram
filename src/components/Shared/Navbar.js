import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";

class Navbar extends React.Component {
  state = {
    search: ""
  };

  onSubmitSearch = e => {
    e.preventDefault();
    if (this.state.search) {
      this.props.history.push("/photos/" + this.state.search);
    } else {
      this.props.history.push("/");
    }
    this.setState({ search: "" });
  };

  render() {
    const { currentUser } = this.props;
    return (
      <nav className="navbar fixed-top navbar-dark bg-dark">
        <div className="navbar-brand">
          <Link to="/">Koalagram</Link>
        </div>
        <form className="form-inline" onSubmit={this.onSubmitSearch}>
          <input
            className="form-control hashtag-search"
            type="text"
            placeholder="Search"
            value={this.state.search}
            onChange={e => this.setState({ search: e.target.value })}
          />
        </form>
        {currentUser ? (
          <form className="form-inline">
            <div className="logged-in">
              Logged in as
              <span className="current-user">{currentUser.username}</span>
              <div
                className="photo profile"
                style={{
                  backgroundImage:
                    "url('" + currentUser.profile_image_url + "')"
                }}
              />
            </div>
            <div className="nav-link logout" onClick={this.props.logout}>
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
  }
}

export default withRouter(Navbar);
