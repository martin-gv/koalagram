import React from "react";
import { Link } from "react-router-dom";

import "./Login.css";

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };

  login = e => {
    e.preventDefault();
    this.props.login(this.state);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div
        className="Login card"
        style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}
      >
        <div className="card-body">
          <h5 className="card-title" style={{ marginBottom: 20 }}>
            Login!
          </h5>
          {this.props.errorMessage && (
            <div className="alert alert-danger">{this.props.errorMessage}</div>
          )}
          <form onSubmit={this.login}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary">
              Login
            </button>
          </form>
          <div className="signup">
            No account? <Link to="/signup">Sign up here!</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
