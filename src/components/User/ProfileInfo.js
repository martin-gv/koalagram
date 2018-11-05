import React from "react";
import "./ProfileInfo.css";

const ProfileInfo = props => (
  <div className="ProfileInfo">
    <div className="row user-profile">
      <div className="col-4">
        <div
          className="photo profile"
          style={{
            backgroundImage: "url('" + props.user.profile_image_url + "')"
          }}
        />
      </div>
      <div className="col-8">
        <div className="username">
          {props.user.username}{" "}
          <button className="btn btn-sm ml-3 edit">Edit</button>
        </div>
        <div className="stats">
          <div className="photos">
            <strong>{props.storePhotos.length}</strong> photos
          </div>
          <div className="likes">
            <strong>{props.likes}</strong> likes
          </div>
        </div>
        <div className="bio">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel enim a
          enim finibus gravida. Maecenas nunc lacus, vulputate at gravida in,
          congue vel sem. Suspendisse potenti.
        </div>
      </div>
    </div>
    <hr />
  </div>
);

export default ProfileInfo;
