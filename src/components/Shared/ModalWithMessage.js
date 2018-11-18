import React from "react";
import "./ModalWithMessage.css";

const ModalWithMessage = props => {
  return (
    <div className="ModalWithMessage">
      <div className="overlay" onClick={props.close}>
        <div className="content" onClick={e => e.stopPropagation()}>
          <div className="menu-item">{props.message}</div>
          <hr />
          <div className="menu-item okay" onClick={props.close}>
            Okay
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWithMessage;
