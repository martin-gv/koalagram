import React from "react";

import PhotoModal from "../PhotoModal/PhotoModal";

class PhotoGrid extends React.Component {
  state = {
    photoModal: false,
    selectedPhoto: undefined
  };

  componentDidMount() {
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
        if (this.state.selectedPhoto === photos[photos.length - 1]) return;
        this.changePhoto(1);
      } else if (e.key === "ArrowLeft") {
        if (this.state.selectedPhoto === photos[0]) return;
        this.changePhoto(-1);
      }
    } else if (this.state.photoModal && e.key === "Escape") {
      this.setState({ photoModal: false });
    }
  };

  toggleModal = () => {
    this.setState(state => ({ photoModal: !state.photoModal }));
  };

  viewPhoto = photo => {
    this.setState({ selectedPhoto: photo });
    this.toggleModal();
  };

  changePhoto = num => {
    this.setState(state => {
      let findPhoto = this.props.photos.find(
        x => x.id === state.selectedPhoto.id
      );
      let currentIndex = this.props.photos.indexOf(findPhoto);
      return { selectedPhoto: this.props.photos[currentIndex + num] };
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
        onClick={this.viewPhoto.bind(this, x)}
      />
    ));
    return (
      <div>
        {selectedPhoto && (
          <PhotoModal
            show={this.state.photoModal}
            toggle={this.toggleModal}
            photo={photos.find(x => x.id === selectedPhoto.id)}
            isFirst={selectedPhoto === photos[0]}
            isLast={selectedPhoto === photos[photos.length - 1]}
            changePhoto={this.changePhoto}
            currentUser={this.props.currentUser}
            userLikes={
              (this.props.currentUser && this.props.currentUser.likes) || []
            }
            onClickLikeIcon={this.onClickLikeIcon}
            addNewComment={this.props.addNewComment}
          />
        )}
        <div className="row">{grid}</div>
      </div>
    );
  }
}

export default PhotoGrid;
