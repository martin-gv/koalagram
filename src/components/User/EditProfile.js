import React from "react";
import { apiCall, uploadFile } from "../../services/api";
import "./EditProfile.css";
import ButtonSpinner from "../Shared/ButtonSpinner";

class EditProfile extends React.Component {
  state = {
    bio: this.props.user.bio || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    uploading: false,
    imageUrl: ""
  };

  fileInput = React.createRef();

  handleFileChange = async e => {
    const selectedFile = e.target.files[0];
    this.setState({ uploading: true });
    const { signedRequest, url } = await apiCall("get", "/api/file-upload", {
      params: {
        fileName: selectedFile.name,
        fileType: selectedFile.type
      }
    });
    await uploadFile(selectedFile, signedRequest);
    this.setState({ uploading: false, imageUrl: url });
  };

  onChange = e => {
    if (e.target.name === "bio" && e.target.value.length > 255) return;
    this.setState({ [e.target.name]: e.target.value });
  };

  saveChanges = async () => {
    const { imageUrl, bio } = this.state;
    const { username } = this.props.user;
    const res = await apiCall("put", "/api/users/" + username, {
      imageUrl,
      bio
    });
    if (res.image) this.props.updateCurrentUserProfileImage(res.image);
    this.props.history.push("/" + username);
  };

  render() {
    const imageUrl = this.state.imageUrl
      ? this.state.imageUrl
      : this.props.user
      ? this.props.user.profile_image_url
        ? this.props.user.profile_image_url
        : "/doge.jpg"
      : "";

    const imageStyle = this.state.uploading
      ? {}
      : { backgroundImage: "url('" + imageUrl + "')" };

    return (
      <div className="EditProfile">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title" style={{ display: "inline-block" }}>
              Edit your profile
            </h5>
            <button
              className="btn btn-sm btn-primary"
              style={{ float: "right" }}
              onClick={this.saveChanges}
              disabled={this.state.uploading}
            >
              Save Changes
            </button>
            <hr />
            <div className="photo profile" style={imageStyle} />
            <form>
              <div
                className="form-group choose-image"
                style={{ marginBottom: 20 }}
              >
                <div className="selected-file">
                  {this.state.selectedFile && this.state.selectedFile.name}
                </div>
                <label htmlFor="image">
                  Change Profile Image
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
              <div className="form-group" style={{ marginBottom: 40 }}>
                <label htmlFor="bio">Bio</label>
                <label className="character-count">
                  {this.state.bio.length}
                  /255 characters
                </label>
                <textarea
                  className="form-control"
                  required
                  name="bio"
                  id="bio"
                  rows="4"
                  value={this.state.bio}
                  onChange={this.onChange}
                />
              </div>
            </form>
          </div>
        </div>
        {/* <div
          className="card"
          style={{
            maxWidth: 600,
            margin: "auto",
            marginBottom: 40
          }}
        >
          <div className="card-body">
            <h5 className="card-title">Change Password</h5>
            <hr />
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                className="form-control"
                required
                name="currentPassword"
                id="currentPassword"
                value={this.state.currentPassword}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className="form-control"
                required
                name="newPassword"
                id="newPassword"
                value={this.state.newPassword}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                required
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={this.state.confirmNewPassword}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default EditProfile;
