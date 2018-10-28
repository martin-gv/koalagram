import React from "react";

const closeButtonStyle = {
  padding: "10px 15px"
};

const buttonSpanStyle = {
  fontSize: 16,
  verticalAlign: "top"
};

const LoginMessage = props => {
  return (
    <div className="alert alert-dismissible alert-success">
      Welcome back, <strong>{props.currentUser.username}!</strong>
      <button
        className="close"
        style={closeButtonStyle}
        onClick={props.clearLoginMessage}
      >
        <span style={buttonSpanStyle}>&times;</span>
      </button>
    </div>
  );
};

export default LoginMessage;
