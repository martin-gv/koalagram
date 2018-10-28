import React from "react";
import { withRouter } from "react-router-dom";

import "./PhotoGrid.css";
import PhotoModal from "../PhotoModal/PhotoModal";

class PhotoGrid extends React.Component {
  state = {
    photoModal: false,
    selectedPhoto: undefined,
    ready: false
  };

  componentDidMount() {
    const username = this.props.match.params.username;
    this.props
      .fetchPhotos(username)
      .then(res => {
        if (res) {
          this.setState({ ready: true });
          const id = Number(this.props.location.hash.slice(1));
          if (id) {
            const selectedPhoto = this.props.photos.find(x => x.id === id);
            this.setState({ selectedPhoto, photoModal: true });
          }
          this.props.readyCallback();
        }
      })
      .catch(err => console.log(err));
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (
      this.state.photoModal &&
      e.target.name !== "commentText" &&
      (e.key === "ArrowRight" || e.key === "ArrowLeft")
    ) {
      e.preventDefault();
      const { photos } = this.props;
      if (e.key === "ArrowRight") {
        if (this.state.selectedPhoto.id === photos[photos.length - 1].id)
          return;
        this.changePhoto(1);
      } else if (e.key === "ArrowLeft") {
        if (this.state.selectedPhoto.id === photos[0].id) return;
        this.changePhoto(-1);
      }
    } else if (this.state.photoModal && e.key === "Escape") {
      this.setState({ photoModal: false });
    }
  };

  toggleModal = () => {
    this.setState(state => ({ photoModal: !state.photoModal }));
  };

  openPhotoModal = photo => {
    this.setState({ selectedPhoto: photo });
    this.toggleModal();
    const { pathname } = this.props.location;
    this.props.history.push(pathname + "#" + photo.id);
  };

  changePhoto = num => {
    this.setState(state => {
      const { photos } = this.props;
      const currentPhoto = photos.find(x => x.id === state.selectedPhoto.id);
      const currentIndex = photos.indexOf(currentPhoto);
      const newPhoto = photos[currentIndex + num];
      const { pathname } = this.props.location;
      this.props.history.push(pathname + "#" + newPhoto.id);
      return { selectedPhoto: newPhoto };
    });
  };

  onClickLikeIcon = () => {
    this.props.togglePhotoLike(this.state.selectedPhoto);
  };

  render() {
    let { photos } = this.props;
    let { selectedPhoto } = this.state;
    let grid = photos.map(x => (
      <div
        className="col-4"
        key={x.id}
        style={{ backgroundImage: "url('" + x.image_url + "')" }}
        onClick={this.openPhotoModal.bind(this, x)}
      />
    ));
    return (
      <div className="PhotoGrid">
        {selectedPhoto && (
          <PhotoModal
            show={this.state.photoModal}
            toggle={this.toggleModal}
            photo={photos.find(x => x.id === selectedPhoto.id)}
            isFirst={selectedPhoto.id === photos[0].id}
            isLast={selectedPhoto.id === photos[photos.length - 1].id}
            changePhoto={this.changePhoto}
            currentUser={this.props.currentUser}
            userLikes={
              (this.props.currentUser && this.props.currentUser.likes) || []
            }
            onClickLikeIcon={this.onClickLikeIcon}
            onChangeCommentText={this.props.onChangeCommentText}
            addNewComment={this.props.addNewComment}
            loginRequired={this.props.loginRequired}
          />
        )}
        <div className="row">{this.state.ready && grid}</div>
      </div>
    );
  }
}

export default withRouter(PhotoGrid);
