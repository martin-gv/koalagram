import React from "react";
import { withRouter } from "react-router-dom";
import { apiCall } from "../../services/api";
import "./NewPhotoModal.css";
import Modal from "../Shared/Modal";
import ButtonSpinner from "../Shared/ButtonSpinner";

const placeholderImg = "/placeholder.png";

class NewPhotoModal extends React.Component {
  state = {
    selectedFile: undefined,
    comment: "",
    imageUrl: "",
    loading: false,
    uploading: false,
    buttonDisabled: true,
    submitPressed: false
  };
  
  fileInput = React.createRef();

  handleFileChange = async e => {
    const selectedFile = e.target.files[0];
    this.setState({ buttonDisabled: false, uploading: true, selectedFile });
    const { signedRequest, url } = await apiCall("get", "/api/file-upload", {
      params: {
        fileName: selectedFile.name,
        fileType: selectedFile.type
      }
    });
    await this.uploadFile(selectedFile, signedRequest);
    this.setState({ uploading: false, imageUrl: url });
    if (this.state.submitPressed) this.postNewPhoto();
  };

  uploadFile = (file, signedRequest) => {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedRequest);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            alert("Could not upload file.");
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        }
      };
      xhr.send(file);
    });
  };

  onChange = e => {
    if (e.target.value.length > 255) return;
    this.setState({ comment: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ submitPressed: true, buttonDisabled: true, loading: true });
    if (this.state.imageUrl) this.postNewPhoto();
  };

  postNewPhoto = async () => {
    const { imageUrl, comment } = this.state;
    const { username } = this.props.currentUser;
    const res = await apiCall("post", "/api/users/" + username, {
      imageUrl,
      comment
    });
    this.props.history.push("/");
    this.props.close();
    this.props.addNewPhoto(res.newPhoto);
  };

  render() {
    return (
      <div className="NewPhotoModal">
        <Modal show={true} toggle={this.props.close}>
          <i className="fas fa-times close-button" />

          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <h2>Post New Photo</h2>
            <hr />
            <form onSubmit={this.handleSubmit}>
              <div className="form-group choose-image">
                <div
                  className="photo"
                  style={{
                    backgroundImage: `url("${
                      this.state.imageUrl ? this.state.imageUrl : placeholderImg
                    }")`
                  }}
                  onClick={() => this.fileInput.current.click()}
                />
                <div className="selected-file">
                  {this.state.selectedFile && this.state.selectedFile.name}
                </div>
                <label htmlFor="image">
                  Choose Image File
                  {this.state.uploading && <ButtonSpinner />}
                </label>
                <input
                  type="file"
                  className="form-control-file"
                  id="image"
                  ref={this.fileInput}
                  onChange={this.handleFileChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  name="comment"
                  id="comment"
                  placeholder="Caption (optional)"
                  value={this.state.comment}
                  onChange={this.onChange}
                  rows="3"
                />
                <label>
                  {this.state.comment.length}
                  /255 characters
                </label>
              </div>
              <button
                className="btn btn-sm btn-block btn-primary"
                disabled={this.state.buttonDisabled}
              >
                Post Photo {this.state.loading && <ButtonSpinner />}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(NewPhotoModal);
