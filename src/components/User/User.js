import React from "react";

import "./User.css";
import PhotoGrid from "../PhotoGrid/PhotoGrid";

class User extends React.Component {
  state = {
    ready: false
  };

  render() {
    const totalLikes = this.props.photos.reduce((acc, cur) => {
      return acc + cur.likes;
    }, 0);

    return (
      <div className="User">
        {this.state.ready && (
          <div className="row user-profile">
            <div className="col-4">
              <div
                className="photo profile"
                style={{
                  backgroundImage:
                    "url('" + this.props.photos[0].profile_image_url + "')"
                }}
              />
            </div>
            <div className="col-8">
              <div className="username">{this.props.photos[0].username}</div>
              <div className="stats">
                <div className="photos">
                  <strong>{this.props.photos.length}</strong> photos
                </div>
                <div className="likes">
                  <strong>{totalLikes}</strong> likes
                </div>
              </div>
              <div className="bio">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel
                enim a enim finibus gravida. Maecenas nunc lacus, vulputate at
                gravida in, congue vel sem. Suspendisse potenti.
              </div>
            </div>
          </div>
        )}
        <hr />
        <PhotoGrid
          fetchPhotos={this.props.fetchPhotos}
          readyCallback={() => this.setState({ ready: true })}
          currentUser={this.props.currentUser}
          photos={this.props.photos}
          togglePhotoLike={this.props.togglePhotoLike}
          onChangeCommentText={this.props.onChangeCommentText}
          addNewComment={this.props.addNewComment}
          loginRequired={this.props.loginRequired}
        />
      </div>
    );
  }
}

export default User;
