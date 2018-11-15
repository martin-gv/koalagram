import React from "react";
import { Link } from "react-router-dom";
import "./ProfileInfo.css";

const ProfileInfo = props => {
  const imageUrl = props.user
    ? props.user.profile_image_url
      ? props.user.profile_image_url
      : "/doge.jpg"
    : "";

  return (
    <div className="ProfileInfo">
      <div className="row user-profile">
        <div className="col-4">
          <div
            className="photo profile"
            style={{
              backgroundImage: "url('" + imageUrl + "')"
            }}
          />
        </div>
        <div className="col-8">
          <div className="username">
            {props.user.username}{" "}
            {props.ownProfile && (
              <Link to={props.pathname + "/edit"}>
                <button className="btn btn-sm ml-3 edit">Edit</button>
              </Link>
            )}
          </div>
          <div className="stats">
            <div className="photos">
              <strong>{props.totalPhotos}</strong> photos
            </div>
            <div className="likes">
              <strong>{props.likes}</strong> likes
            </div>
          </div>
          <div className="bio">{props.user.bio}</div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ProfileInfo;
