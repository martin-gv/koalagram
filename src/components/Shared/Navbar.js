import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";
import NewPhotoModal from "../NewPhotoModal/NewPhotoModal";
import {
  Collapse,
  Navbar as RSNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class Navbar extends React.Component {
  state = {
    search: "",
    showNewPhotoModal: false,
    collapsed: true
  };

  toggleNavbar = () => this.setState({ collapsed: !this.state.collapsed });

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
    this.setState({ showNewPhotoModal: true, collapsed: true });
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
        <nav className="navbar fixed-top navbar-dark bg-dark navbar-expand-md">
          <div
            className="navbar-brand"
            onClick={() => this.setState({ collapsed: true })}
          >
            <Link to="/">
              <img src="/koalagram.png" alt="Koalagram Logo" />
              Koalagram
            </Link>
          </div>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <form className="form-inline" onSubmit={this.onSubmitSearch}>
                  <input
                    style={{ marginRight: 20 }}
                    className="form-control hashtag-search"
                    type="text"
                    placeholder="Search"
                    value={this.state.search}
                    onChange={e => this.setState({ search: e.target.value })}
                  />
                </form>
              </NavItem>
              {currentUser && (
                <NavItem>
                  <button
                    className="btn btn-sm btn-primary mr-3 post-photo"
                    onClick={this.openModal}
                  >
                    <i className="fas fa-camera mr-2" />
                    Post Photo
                  </button>
                </NavItem>
              )}
              {currentUser && (
                <NavItem>
                  <div className="logged-in">
                    Logged in as
                    <span
                      className="current-user"
                      onClick={() => this.setState({ collapsed: true })}
                    >
                      <Link to={"/" + currentUser.username}>
                        {currentUser.username}
                      </Link>
                    </span>
                    <Link to={"/" + currentUser.username}>
                      <div
                        className="photo profile"
                        style={{ backgroundImage: "url('" + imageUrl + "')" }}
                        onClick={() => this.setState({ collapsed: true })}
                      />
                    </Link>
                  </div>
                </NavItem>
              )}
              {currentUser && (
                <NavItem onClick={() => this.setState({ collapsed: true })}>
                  <div className="nav-link logout" onClick={this.props.logout}>
                    Logout
                  </div>
                </NavItem>
              )}
              {!currentUser && (
                <NavItem onClick={() => this.setState({ collapsed: true })}>
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </NavItem>
              )}
              {!currentUser && (
                <NavItem onClick={() => this.setState({ collapsed: true })}>
                  <Link className="btn btn-sm btn-primary" to="/signup">
                    Sign up
                  </Link>
                </NavItem>
              )}
            </Nav>
          </Collapse>
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
