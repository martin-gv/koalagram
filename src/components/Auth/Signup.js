import React from "react";
import { apiCall, setTokenHeader } from "../../services/api";

class Signup extends React.Component {
  state = {
    username: "",
    profileImageUrl: "",
    password: "",
    confirmPassword: "",
    passwordsDoNotMatch: false
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.passwordsDoNotMatch) {
        this.checkIfPasswordsMatch();
      }
    });
  };

  checkIfPasswordsMatch = () => {
    const { password, confirmPassword } = this.state;
    if (password === confirmPassword)
      this.setState({ passwordsDoNotMatch: false });
  };

  signup = e => {
    e.preventDefault();
    const { username, profileImageUrl, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ passwordsDoNotMatch: true });
    } else {
      const user = { username, profileImageUrl, password };
      apiCall("post", "/api/auth/signup", { user })
        .then(res => {
          localStorage.setItem("jwtToken", res.token);
          setTokenHeader(res.token);
          this.props.setCurrentUser(res.user);
          this.props.history.push("/");
        })
        .catch(err => {
          if (err.message.includes("ER_DUP_ENTRY")) {
            this.props.setErrorMessage("That username is already taken");
          } else {
            this.props.setErrorMessage(err.message);
          }
        });
    }
  };

  render() {
    return (
      <div
        className="card"
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
            <div className="form-group">
              <label>Profile Image URL (optional)</label>
              <input
                type="text"
                className="form-control"
                // required
                name="profileImageUrl"
                onChange={this.onChange}
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
                  Password does not match
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
