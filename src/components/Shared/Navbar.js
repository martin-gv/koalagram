import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";
import NewPhotoModal from "../NewPhotoModal/NewPhotoModal";

class Navbar extends React.Component {
  state = {
    search: "",
    showNewPhotoModal: false
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

  openModal = e => {
    e.preventDefault();
    this.setState({ showNewPhotoModal: true });
  };

  closeModal = () => this.setState({ showNewPhotoModal: false });

  render() {
    const { currentUser } = this.props;
    let formatToUrl, imageUrl;
    if (currentUser) {
      formatToUrl = currentUser.profile_image_url.includes("http")
        ? currentUser.profile_image_url
        : "http://localhost:8080/" + currentUser.profile_image_url;
      imageUrl = formatToUrl.replace("\\", "/");
    }

    return (
      <div>
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
            <form className="form-inline" onSubmit={this.openModal}>
              <button className="btn btn-sm btn-primary mr-3">
                <i className="fas fa-camera mr-2" />
                Post Photo
              </button>
              <div className="logged-in">
                Logged in as
                <span className="current-user">
                  <Link to={"/" + currentUser.username}>
                    {currentUser.username}
                  </Link>
                </span>
                <Link to={"/" + currentUser.username}>
                  <div
                    className="photo profile"
                    style={{
                      backgroundImage: "url('" + imageUrl + "')"
                    }}
                  />
                </Link>
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
        {this.state.showNewPhotoModal && (
          <NewPhotoModal
            show={this.state.showNewPhotoModal}
            close={this.closeModal}
            currentUser={currentUser}
            addNewPhoto={this.props.addNewPhoto}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Navbar);
