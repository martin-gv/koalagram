import React from "react";
import { Link } from "react-router-dom";

import "./PhotoModal.css";
import Modal from "../Shared/Modal";

class PhotoModal extends React.Component {
  state = {
    commentText: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleTextSubmit = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.props.addNewComment(this.state.commentText, this.props.photo);
      this.setState({ commentText: "" });
    }
  };

  onClick = e => {
    e.stopPropagation();
  };

  onArrowClick = (e, num) => {
    e.stopPropagation();
    this.props.changePhoto(num);
  };

  commentArea = React.createRef();
  onClickCommentIcon = () => {
    this.commentArea.current.focus();
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
            <div
              className="modal-container"
              onClick={this.onClick}
              // onKeyDown={this.handleKeyDown}
            >
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
                    <strong>{photo.username} • Follow</strong>
                  </div>
                </div>
                <hr />
                <div className="comments-container">
                  {photo.comments &&
                    photo.comments.map((x, index) => (
                      <div key={index} className="comment">
                        <strong>{x.username}</strong> {x.comment_text}
                      </div>
                    ))}
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
                    <i
                      className="far fa-comment"
                      onClick={this.onClickCommentIcon}
                    />
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
                  {!this.props.currentUser ? (
                    <Link to="/login">Log in to comment</Link>
                  ) : (
                    <div className="form-group">
                      <textarea
                        type="text"
                        className="form-control"
                        name="commentText"
                        placeholder="Leave a comment..."
                        ref={this.commentArea}
                        value={this.state.commentText}
                        onChange={this.onChange}
                        onKeyPress={this.handleTextSubmit}
                      />
                    </div>
                  )}
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
