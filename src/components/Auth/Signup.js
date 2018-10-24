import React from "react";
import { apiCall, setTokenHeader } from "../../services/api";

class Signup extends React.Component {
  state = {
    username: "",
    profileImageUrl: "",
    password: "",
    confirmPassword: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  signup = async e => {
    try {
      e.preventDefault();
      const { user, token } = await apiCall("post", "/api/auth/signup", {
        user: this.state
      });
      localStorage.setItem("jwtToken", token);
      setTokenHeader(token);
      this.props.setCurrentUser(user);
      this.props.history.push("/");
      console.log("Welcome!");
    } catch (err) {
      console.log(err);
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
