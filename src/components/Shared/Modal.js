import React from "react";
import "./Modal.css";

class Modal extends React.Component {
  overlayClick = () => {
    this.props.toggle();
  };

  contentClick = e => {
    e.stopPropagation();
  };

  render() {
    const style = {
      opacity: this.props.show ? 1 : 0,
      zIndex: this.props.show ? 9999 : -9999
    };

    return (
      <div className="Modal">
        <div className="overlay" onClick={this.overlayClick} style={style}>
          <div className="content" style={style}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
