import React from "react";
import { Link } from "react-router-dom";

import "./PhotoModal.css";
import Modal from "../Shared/Modal";

class PhotoModal extends React.Component {
  onClick = e => {
    e.stopPropagation();
  };

  onArrowClick = (e, num) => {
    e.stopPropagation();
    this.props.changePhoto(num);
  };

  render() {
    let { photo, userLikes } = this.props;
    let userLikesThisPhoto =
      photo && Boolean(userLikes.find(x => x.photo_id === photo.id));
    return (
      <div className="PhotoModal">
        {photo && (
          <Modal show={this.props.show} toggle={this.props.toggle}>
            <i className="fas fa-times close-button" />
            <div className="left arrow">
              {!this.props.isFirst && (
                <i
                  onClick={e => this.onArrowClick(e, -1)}
                  className="fas fa-angle-left"
                />
              )}
            </div>
            <div className="modal-container" onClick={this.onClick}>
              <div
                className="photo"
                style={{ backgroundImage: "url('" + photo.image_url + "')" }}
              />
              <div className="sidebar">
                <div className="username">
                  <div
                    className="photo profile"
                    style={{
                      backgroundImage: "url('" + photo.profile_image_url + "')"
                    }}
                  />
                  <div>
                    <strong>{photo.username}</strong>
                  </div>
                </div>
                <hr />
                <div className="comments-container">
                  <div className="comment">
                    <strong>Username</strong> This is the comment
                  </div>
                  <div className="comment">
                    <strong>Username</strong> This is the comment
                  </div>
                </div>
                <hr />
                <div className="actions-container">
                  <div className="icons">
                    <i
                      className={
                        userLikesThisPhoto
                          ? "far fa-heart user-likes"
                          : "far fa-heart"
                      }
                      onClick={this.props.onClickLikeIcon}
                    />
                    <i className="far fa-comment" />
                  </div>
                </div>
                <div className="likes">
                  {photo.likes
                    ? photo.likes === 1
                      ? "1 like"
                      : `${photo.likes} likes`
                    : "No likes yet"}
                </div>
                <div className="posted">1 minute ago</div>
                <hr />
                <div className="new-comment">
                  <Link to="/login">Log in to comment</Link>
                </div>
              </div>
            </div>
            <div className="right arrow">
              {!this.props.isLast && (
                <i
                  className="fas fa-angle-right"
                  onClick={e => this.onArrowClick(e, 1)}
                />
              )}
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default PhotoModal;
