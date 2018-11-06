import React from "react";
import { apiCall } from "../../services/api";
import "./EditProfile.css";

class EditProfile extends React.Component {
  state = {
    selectedFile: undefined,
    loadingImage: false,
    localImage: undefined,
    bio: this.props.user.bio || "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  };

  fileInput = React.createRef();
  handleFileChange = e => {
    this.setState({ loadingImage: true, selectedFile: e.target.files[0] });
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({ loadingImage: false, localImage: e.target.result });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  onChange = e => {
    if (e.target.name === "bio" && e.target.value.length > 255) return;
    this.setState({ [e.target.name]: e.target.value });
  };

  saveChanges = async () => {
    // this.setState({ loading: true });

    const { selectedFile, bio } = this.state;
    const { username } = this.props.user;
    const formData = new FormData();

    if (selectedFile)
      formData.append("imageFile", selectedFile, selectedFile.name);
    formData.append("bio", bio);

    const res = await apiCall("put", "/api/users/" + username, formData);
    if (res.image) this.props.updateCurrentUserProfileImage(res.image);
    this.props.history.push("/" + username);
  };

  render() {
    const formatToUrl = this.props.user.profile_image_url.includes("http")
      ? this.props.user.profile_image_url
      : "http://localhost:8080/" + this.props.user.profile_image_url;
    const imageUrl = formatToUrl.replace("\\", "/");

    const imageStyle = this.state.loadingImage
      ? {}
      : this.state.localImage
        ? { backgroundImage: "url('" + this.state.localImage + "')" }
        : this.props.user
          ? {
              backgroundImage: "url('" + imageUrl + "')"
            }
          : {};

    return (
      <div className="EditProfile">
        <div
          className="card"
          style={{
            maxWidth: 600,
            margin: "auto",
            marginTop: 100,
            marginBottom: 40
          }}
        >
          <div className="card-body">
            <h5 className="card-title" style={{ display: "inline-block" }}>
              Edit your profile
            </h5>
            <button
              className="btn btn-sm btn-primary"
              style={{ float: "right" }}
              onClick={this.saveChanges}
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
                <label htmlFor="image">Change Profile Image</label>
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
