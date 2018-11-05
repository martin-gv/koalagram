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
    // total photo likes not working?!
    const { storePhotos, user, currentUser } = this.props;
    const likes = ready && storePhotos.reduce((acc, cur) => acc + cur.likes, 0);
    const ownProfile = currentUser && currentUser.id === user.id && true;

    return (
      <div className="User">
        {ready && <ProfileInfo {...{ storePhotos, user, likes }} />}
        {ownProfile && (
          <TabNav
            switchPhotos={this.switchPhotos}
            selected={this.state.tab}
            currentUser={currentUser}
          />
        )}
        {/* {tab === "photos" ? <div>Photos!</div> : <div>Likes!</div>} */}
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
