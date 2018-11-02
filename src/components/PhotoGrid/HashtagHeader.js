import React from "react";

const HashtagHeader = props => {
  return (
    <div>
      <div className="row hashtag-header">
        <div className="col-4">
          <div
            className="round-photo"
            style={{
              backgroundImage: "url('" + props.randomPhoto().image_url + "')"
            }}
          />
        </div>
        <div className="col-8">
          <div className="hashtag">#{props.hashtag}</div>
          <div className="stats">
            <div className="photos">
              <strong>{props.totalPhotos}</strong> photos
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default HashtagHeader;
