import React from "react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import "./PhotoModal.css";
import Modal from "../Shared/Modal";
import MenuModal from "./MenuModal";

class PhotoModal extends React.Component {
  state = {
    heartClasses: ["far", "fa-heart"],
    showMenu: false
  };

  onChange = e => {
    if (e.target.value.length > 255) return;
    this.props.onChangeCommentText(this.props.photo.id, e);
  };

  commentsContainer = React.createRef();

  handleTextSubmit = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        this.props.photo.commentText &&
        this.props.photo.commentText.length <= 255
      ) {
        const { current: commentsContainer } = this.commentsContainer;
        this.props.addNewComment(this.props.photo, commentsContainer);
        this.commentArea.current.blur();
      }
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
    if (this.props.currentUser) {
      this.commentArea.current.focus();
    } else {
      this.props.loginRequired();
    }
  };

  handleHeartClick = () => {
    this.setState({ heartClasses: ["far", "fa-heart", "animate"] });
    this.props.onClickLikeIcon();
    setTimeout(() => {
      this.setState({ heartClasses: ["far", "fa-heart"] });
    }, 400);
  };

  navigateToUserProfile = () => {
    const username = this.props.photo.username;
    this.props.closeModal();
    if (this.props.location.pathname.slice(1) === username) {
      window.scrollTo(0, 0);
      this.props.history.push("/" + username);
    } else {
      this.props.history.push("/" + username);
    }
  };

  openMenu = () => this.setState({ showMenu: true });

  closeMenu = e => {
    e.stopPropagation();
    this.setState({ showMenu: false });
  };

  render() {
    const { showMenu } = this.state;
    let { photo, userLikes } = this.props;
    let userLikesThisPhoto =
      photo && Boolean(userLikes.find(x => x.photo_id === photo.id));
    let stateCopy = [...this.state.heartClasses];
    if (userLikesThisPhoto) stateCopy.push("user-likes");
    let heart = stateCopy.join(" ");

    const profileImageUrl = photo
      ? photo.profile_image_url
        ? photo.profile_image_url
        : "/doge.jpg"
      : "";

    return (
      <div className="PhotoModal">
        {photo && (
          <Modal show={this.props.show} toggle={this.props.closeModal}>
            <i className="fas fa-times close-button" />
            <div className="left arrow">
              <i
                onClick={e => this.onArrowClick(e, -1)}
                className={
                  "fas fa-angle-left" + (this.props.isFirst ? " hide" : "")
                }
              />
            </div>
            <div className="modal-container" onClick={this.onClick}>
              <div
                className="photo"
                style={{ backgroundImage: `url("${photo.image_url}")` }}
              />
              <div className="sidebar">
                {showMenu && (
                  <MenuModal
                    close={this.closeMenu}
                    delete={this.props.deletePhoto}
                    isOwner={
                      this.props.currentUser &&
                      this.props.currentUser.id === photo.user_id
                    }
                  />
                )}
                <i className="fas fa-ellipsis-h" onClick={this.openMenu} />
                <div className="user">
                  <div
                    className="photo profile"
                    style={{ backgroundImage: `url("${profileImageUrl}")` }}
                    onClick={this.navigateToUserProfile}
                  />
                  <div
                    className="username"
                    onClick={this.navigateToUserProfile}
                  >
                    <strong>{photo.username}</strong>
                  </div>
                </div>
                <hr />
                <div
                  className="comments-container"
                  ref={this.commentsContainer}
                >
                  {photo.comments &&
                    photo.comments.map((x, index) => {
                      const rule = /(#[^\s]+)/;
                      const splitStr = x.comment_text.split(rule);
                      const parsedComment = splitStr.map((x, i) => {
                        if (x.match(rule)) {
                          return (
                            <span key={i} className="hashtag">
                              <Link to={"/photos/" + x.slice(1)}>{x}</Link>
                            </span>
                          );
                        }
                        return x;
                      });
                      return (
                        <div key={index} className={"comment " + index}>
                          <span className="username">
                            <Link to={"/" + x.username}>{x.username}</Link>
                          </span>{" "}
                          {parsedComment}
                        </div>
                      );
                    })}
                </div>
                <hr />
                <div className="actions-container">
                  <div className="icons">
                    <i className={heart} onClick={this.handleHeartClick} />
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
                <div className="posted">
                  {moment(photo.created_at).fromNow()}
                </div>
                <hr />
                <div className="new-comment">
                  {!this.props.currentUser ? (
                    <Link to="/login">Log in to like or comment</Link>
                  ) : (
                    <div className="form-group">
                      <textarea
                        type="text"
                        className="form-control"
                        name="commentText"
                        placeholder="Leave a comment..."
                        ref={this.commentArea}
                        value={this.props.photo.commentText || ""}
                        onChange={this.onChange}
                        onKeyPress={this.handleTextSubmit}
                      />
                      <label>
                        {(this.props.photo.commentText &&
                          this.props.photo.commentText.length) ||
                          0}
                        /255 characters
                      </label>
                      {this.props.photo.commentText &&
                        this.props.photo.commentText.length > 255 && (
                          <div className="invalid-feedback">
                            Comment is too long
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="right arrow">
              <i
                className={
                  "fas fa-angle-right" + (this.props.isLast ? " hide" : "")
                }
                onClick={e => this.onArrowClick(e, 1)}
              />
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default withRouter(PhotoModal);
