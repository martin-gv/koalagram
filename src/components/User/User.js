import React from "react";

import "./User.css";
import PhotoGrid from "../PhotoGrid/PhotoGrid";
import ProfileInfo from "./ProfileInfo";
import TabNav from "./TabNav";

class User extends React.Component {
  state = { ready: false, tab: "photos" };
  switchPhotos = tab => {
    if (tab === "likes") {
      this.props.switchPhotos("likes");
    } else {
      this.props.switchPhotos("photos");
    }
    this.setState({ tab });
  };

  render() {
    const { ready, tab } = this.state;
    const { photos, user, currentUser, storePhotos } = this.props;
    const userPhotos = ready && tab === "photos" ? photos : storePhotos;
    const likes = ready && userPhotos.reduce((acc, cur) => acc + cur.likes, 0);
    const totalPhotos = tab === "photos" ? photos.length : storePhotos.length;
    const ownProfile = currentUser && currentUser.id === user.id && true;
    const pathname = this.props.location.pathname;

    return (
      <div className="User">
        {ready &&
          (user.id ? (
            <ProfileInfo
              {...{ user, likes, ownProfile, pathname, totalPhotos }}
            />
          ) : (
            <h5 style={{ textAlign: "center" }}>No user found</h5>
          ))}
        {ownProfile && (
          <TabNav
            switchPhotos={this.switchPhotos}
            selected={this.state.tab}
            currentUser={currentUser}
          />
        )}
        <PhotoGrid
          fetchPhotos={this.props.fetchPhotos}
          fetchPhotosLikedByUser={this.props.fetchPhotosLikedByUser}
          readyCallback={() => this.setState({ ready: true })}
          currentUser={this.props.currentUser}
          photos={this.props.photos}
          togglePhotoLike={this.props.togglePhotoLike}
          onChangeCommentText={this.props.onChangeCommentText}
          addNewComment={this.props.addNewComment}
          loginRequired={this.props.loginRequired}
          tab={tab}
        />
      </div>
    );
  }
}

export default User;
