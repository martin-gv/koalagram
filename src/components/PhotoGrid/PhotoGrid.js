import React from "react";

import PhotoModal from "../PhotoModal/PhotoModal";

class PhotoGrid extends React.Component {
  state = {
    photoModal: false,
    selectedPhoto: undefined
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

  onClickLikeIcon = e => {
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
            userLikes={
              (this.props.currentUser && this.props.currentUser.likes) || []
            }
            onClickLikeIcon={this.onClickLikeIcon}
          />
        )}
        <div className="row">{grid}</div>
      </div>
    );
  }
}

export default PhotoGrid;
