import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Shared/Navbar";
import PhotoGrid from "./components/PhotoGrid/PhotoGrid";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import { apiCall, setTokenHeader } from "./services/api";

class App extends Component {
  state = {
    currentUser: undefined,
    photos: [],
    likeUpdateTimer: undefined
  };

  async componentDidMount() {
    const { jwtToken: token } = localStorage;
    if (token) {
      setTokenHeader(token);
      const res = await apiCall("post", "api/auth/login", { token });
      this.setCurrentUser(res.user);
      this.props.history.push("/");
      console.log("Auto login", res.user);
    }
    this.fetchPhotos();
  }

  fetchPhotos = async () => {
    const res = await apiCall("get", "/api/photos");
    this.setState({ photos: res });
  };

  login = async loginData => {
    try {
      const { user, token } = await apiCall("post", "api/auth/login", {
        user: loginData
      });
      localStorage.setItem("jwtToken", token);
      setTokenHeader(token);
      this.setCurrentUser(user);
      this.props.history.push("/");
      console.log("Welcome back!", user);
    } catch (err) {
      console.log(err);
    }
  };

  setCurrentUser = user => {
    this.setState({ currentUser: user });
  };

  togglePhotoLike = photo => {
    if (this.state.currentUser) {
      this.setState(state => {
        clearTimeout(state.likeUpdateTimer);
        const { currentUser } = state;
        let updatedLikes, totalLikeChange, newTimer;
        if (currentUser.likes.find(x => x.photo_id === photo.id)) {
          // User currently likes photo
          updatedLikes = currentUser.likes.filter(x => x.photo_id !== photo.id);
          totalLikeChange = -1;
          newTimer = setTimeout(() => this.removePhotoLike(photo.id), 500);
        } else {
          // User currently does NOT like photo
          updatedLikes = [...currentUser.likes, { photo_id: photo.id }];
          totalLikeChange = 1;
          newTimer = setTimeout(() => this.addPhotoLike(photo), 500);
        }
        let findPhoto = state.photos.find(x => x.id === photo.id);
        let photoIndex = state.photos.indexOf(findPhoto);
        let updatedPhoto = {
          ...state.photos[photoIndex]
        };
        updatedPhoto.likes = updatedPhoto.likes + totalLikeChange;
        let newPhotoState = [...state.photos];
        newPhotoState[photoIndex] = updatedPhoto;
        return {
          currentUser: { ...currentUser, likes: updatedLikes },
          photos: newPhotoState,
          likeUpdateTimer: newTimer
        };
      });
    } else {
      this.props.history.push("/login");
    }
  };

  addPhotoLike = async photo => {
    const res = await apiCall("post", "/api/likes", {
      photo,
      user: this.state.currentUser
    });
    console.log(res);
  };

  removePhotoLike = async photoID => {
    const { currentUser } = this.state;
    const res = await apiCall(
      "delete",
      `/api/likes/${photoID}/user/${currentUser.id}`
    );
    console.log(res);
  };

  addNewComment = async comment => {
    // console.log(this.state.photos)
    // const res = await apiCall("post", "/api/comments", { comment });
    // console.log(res);
  };

  logout = () => {
    localStorage.clear();
    setTokenHeader(false);
    this.setState({ currentUser: undefined });
  };

  render() {
    return (
      <div className="App">
        <Navbar currentUser={this.state.currentUser} logout={this.logout} />
        <div className="container">
          <Route
            path="/signup"
            exact
            render={props => (
              <Signup {...props} setCurrentUser={this.setCurrentUser} />
            )}
          />
          <Route
            path="/login"
            exact
            render={props => (
              <Login
                {...props}
                setCurrentUser={this.setCurrentUser}
                login={this.login}
              />
            )}
          />
          <Route
            path="/"
            exact
            render={props => (
              <PhotoGrid
                {...props}
                currentUser={this.state.currentUser}
                photos={this.state.photos}
                togglePhotoLike={this.togglePhotoLike}
                addNewComment={this.addNewComment}
              />
            )}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
