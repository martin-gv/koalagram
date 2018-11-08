import React from "react";
import { withRouter } from "react-router-dom";

import "./PhotoGrid.css";
import PhotoModal from "../PhotoModal/PhotoModal";
import HashtagHeader from "./HashtagHeader";

class PhotoGrid extends React.Component {
  state = {
    photoModal: false,
    selectedPhoto: undefined,
    ready: false
  };

  resetComponent = () =>
    this.setState({
      photoModal: false,
      selectedPhoto: undefined,
      ready: false
    });

  async componentDidMount() {
    // if no username, then all photos fetched for home route
    const username = this.props.match.params.username;
    const hashtag = this.props.match.params.hashtag;
    const currentUser = this.props.currentUser;

    const res = hashtag
      ? await this.props.fetchPhotosByHashtag(hashtag)
      : await this.props.fetchPhotos(username);
    if (res) {
      this.setState({ ready: true });
      const id = Number(this.props.location.hash.slice(1));
      // shows modal if link includes photo id in url #hash
      const selectedPhoto = id
        ? this.props.photos.find(x => x.id === id)
        : undefined;
      if (selectedPhoto) this.setState({ selectedPhoto, photoModal: true });
      this.props.readyCallback();
    }

    // get photos liked by user on user's own profile
    if (currentUser && currentUser.username === username) {
      await this.props.fetchPhotosLikedByUser(username);
    }

    // for keyboard navigation in modal
    document.addEventListener("keydown", this.handleKeyDown);
  }

  async componentDidUpdate(prevProps) {
    const username = this.props.match.params.username;
    const hashtag = this.props.match.params.hashtag;
    const currentUser = this.props.currentUser;
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.resetComponent();
      const res = hashtag
        ? await this.props.fetchPhotosByHashtag(hashtag)
        : await this.props.fetchPhotos(username);
      if (res) {
        this.setState({ ready: true });
        window.scrollTo(0, 0);
        this.props.readyCallback();
      }

      // get photos liked by user on user's own profile
      if (currentUser && currentUser.username === username)
        await this.props.fetchPhotosLikedByUser(username);
    }

    // get photos liked by user on autologin
    if (
      currentUser !== prevProps.currentUser &&
      currentUser &&
      currentUser.username === username
    )
      await this.props.fetchPhotosLikedByUser(username);
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

  closeModal = () => {
    this.setState({ photoModal: false, selectedPhoto: undefined });
    const { pathname } = this.props.location;
    this.props.history.push(pathname);
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

  randomPhoto = () => {
    const randNum = Math.floor(Math.random() * this.props.photos.length);
    return this.props.photos[randNum];
  };

  render() {
    let { selectedPhoto } = this.state;
    let { photos } = this.props;
    let gridOfPhotos = photos.map(x => {
      const formatToUrl = x.image_url.includes("http")
        ? x.image_url
        : "https://koalagram-server.herokuapp.com/" + x.image_url;
      const imageUrl = formatToUrl.replace("\\", "/");
      return (
        <div
          className="col-4"
          key={x.id}
          style={{ backgroundImage: `url("${imageUrl}")` }}
          onClick={this.openPhotoModal.bind(this, x)}
        />
      );
    });
    return (
      <div className="PhotoGrid">
        {selectedPhoto && (
          <PhotoModal
            show={this.state.photoModal}
            closeModal={this.closeModal}
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
        {this.state.ready &&
          this.props.match.params.hashtag &&
          (this.props.photos.length ? (
            <HashtagHeader
              randomPhoto={this.randomPhoto}
              hashtag={this.props.match.params.hashtag}
              totalPhotos={this.props.photos.length}
            />
          ) : (
            <h5 style={{ textAlign: "center" }}>
              No photos with #{this.props.match.params.hashtag}
            </h5>
          ))}
        <div className="row photo-grid">{this.state.ready && gridOfPhotos}</div>
      </div>
    );
  }
}

export default withRouter(PhotoGrid);
