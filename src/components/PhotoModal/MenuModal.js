import React from "react";
import "./MenuModal.css";

const MenuModal = props => {
  return (
    <div className="MenuModal">
      <div className="overlay" onClick={props.close}>
        <div className="content" onClick={e => e.stopPropagation()}>
          <div
            className={`menu-item ${props.isOwner ? "" : "disabled"}`}
            onClick={props.delete}
          >
            <i className="fas fa-trash" />
            Delete Photo
          </div>
          <hr />
          <div className="menu-item cancel" onClick={props.close}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
