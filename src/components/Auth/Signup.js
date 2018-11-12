import React from "react";
import { apiCall, setTokenHeader } from "../../services/api";
import "./Signup.css";
import ButtonSpinner from "../Shared/ButtonSpinner";

class Signup extends React.Component {
  state = {
    username: "",
    profileImageUrl: "",
    password: "",
    confirmPassword: "",
    passwordsDoNotMatch: false,
    uploading: false,
    submitting: false
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.passwordsDoNotMatch) {
        this.checkIfPasswordsMatch();
      }
    });
  };

  fileInput = React.createRef();

  handleFileChange = async e => {
    const selectedFile = e.target.files[0];
    this.setState({ uploading: true, profileImageUrl: "" });
    const { signedRequest, url } = await apiCall("get", "/api/file-upload", {
      params: {
        fileName: selectedFile.name,
        fileType: selectedFile.type
      }
    });
    await this.uploadFile(selectedFile, signedRequest);
    this.setState({ profileImageUrl: url, uploading: false });
  };

  uploadFile = (file, signedRequest) => {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedRequest);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            alert("Could not upload file.");
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        }
      };
      xhr.send(file);
    });
  };

  checkIfPasswordsMatch = () => {
    const { password, confirmPassword } = this.state;
    if (password === confirmPassword)
      this.setState({ passwordsDoNotMatch: false });
  };

  signup = e => {
    e.preventDefault();
    const { username, password, confirmPassword, profileImageUrl } = this.state;
    if (password !== confirmPassword)
      return this.setState({ passwordsDoNotMatch: true });
    this.setState({ submitting: true });
    apiCall("post", "/api/auth/signup", { username, password, profileImageUrl })
      .then(res => {
        localStorage.setItem("jwtToken", res.token);
        setTokenHeader(res.token);
        this.props.setCurrentUser(res.user);
        this.props.location.hash = "";
        this.props.history.push("/");
      })
      .catch(err => {
        if (err.message.includes("ER_DUP_ENTRY")) {
          this.props.setErrorMessage("That username is already taken");
        } else {
          this.props.setErrorMessage(err.message);
        }
      });
  };

  render() {
    return (
      <div
        className="card Signup"
        style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}
      >
        <div className="card-body">
          <h5 className="card-title" style={{ marginBottom: 20 }}>
            Join Koalagram!
          </h5>
          {this.props.errorMessage && (
            <div className="alert alert-danger">{this.props.errorMessage}</div>
          )}
          <form onSubmit={this.signup}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                required
                name="username"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group choose-image">
              <div
                className="photo profile"
                style={{
                  backgroundImage: `url("${this.state.profileImageUrl}")`
                }}
              />
              <div className="title">Profile Image (optional)</div>
              <label htmlFor="image">
                Choose File
                {this.state.uploading && <ButtonSpinner />}
              </label>
              <input
                type="file"
                className="form-control-file"
                id="image"
                ref={this.fileInput}
                onChange={this.handleFileChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                required
                name="password"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                required
                name="confirmPassword"
                onChange={this.onChange}
              />
              {this.state.passwordsDoNotMatch && (
                <div
                  className="invalid-feedback"
                  style={{
                    display: "block",
                    fontSize: 13,
                    marginTop: "0.5rem"
                  }}
                >
                  Passwords do not match
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={this.state.uploading}
            >
              Submit
              {this.state.submitting && <ButtonSpinner />}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
