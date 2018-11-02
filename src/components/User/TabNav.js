import React from "react";

import "./TabNav.css";

const TabNav = props => {
  const { switchPhotos, selected } = props;
  return (
    <div className="TabNav">
      <div
        onClick={() => {
          if (selected !== "photos") switchPhotos("photos");
        }}
      >
        <div>My Photos</div>
        <div className={"line" + (selected === "photos" ? " active" : "")} />
      </div>
      <div
        onClick={() => {
          if (selected !== "likes") switchPhotos("likes");
        }}
      >
        <div>Photos I Like</div>
        <div className={"line" + (selected === "likes" ? " active" : "")} />
      </div>
    </div>
  );
};

export default TabNav;
