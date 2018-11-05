import React from "react";
import { apiCall } from "../../services/api";
import "./NewPhotoModal.css";
import Modal from "../Shared/Modal";
import ButtonSpinner from "../Shared/ButtonSpinner";

class NewPhotoModal extends React.Component {
  state = { selectedFile: undefined, comment: "", loading: false };

  fileInput = React.createRef();
  handleFileChange = e => {
    const selectedFile = e.target.files[0];
    this.setState({ selectedFile });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });

    const { selectedFile, comment } = this.state;
    const { id, username } = this.props.currentUser;
    const formData = new FormData();
    formData.append("imageFile", selectedFile, selectedFile.name);
    formData.append("comment", comment);
    formData.append("id", id);
    const res = await apiCall("post", "/api/users/" + username, formData);
    this.props.addNewPhoto(res.newPhoto);

    this.setState({ selectedFile: undefined, comment: "", loading: false });
    this.props.close();
  };

  render() {
    return (
      <div className="NewPhotoModal">
        <Modal show={true} toggle={this.props.close}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <h2>Post New Photo</h2>
            <hr />
            <form onSubmit={this.handleSubmit}>
              <div className="form-group choose-image">
                <div className="selected-file">
                  {this.state.selectedFile && this.state.selectedFile.name}
                </div>
                <label htmlFor="image">Choose Image File</label>
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
                <input
                  type="text"
                  className="form-control"
                  name="comment"
                  id="comment"
                  placeholder="Caption"
                  value={this.state.comment}
                  onChange={e => this.setState({ comment: e.target.value })}
                />
              </div>
              <button
                className="btn btn-sm btn-block btn-primary"
                disabled={this.state.loading}
              >
                Submit {this.state.loading && <ButtonSpinner />}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default NewPhotoModal;
