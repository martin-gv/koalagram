import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Shared/Navbar";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import LoginMessage from "./components/Shared/LoginMessage";
import PhotoGrid from "./components/PhotoGrid/PhotoGrid";
import User from "./components/User/User";
import { apiCall, setTokenHeader } from "./services/api";

class App extends Component {
  state = {
    currentUser: undefined,
    photos: [],
    user: {},
    likeUpdateTimer: undefined,
    errorMessage: "",
    loginMessage: false,
    storePhotos: [],
    photosLikedByUser: []
  };

  async componentDidMount() {
    const { jwtToken: token } = localStorage;
    if (token) {
      setTokenHeader(token);
      const res = await apiCall("post", "/api/auth/login", { token });
      this.setCurrentUser(res.user);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.props.location.pathname !== "/login") {
        this.setState({ errorMessage: "" });
      }
      if (this.props.location.pathname !== "/") {
        this.setState({ loginMessage: false });
      }
    }
  }

  fetchPhotos = username => {
    // username is optional
    return apiCall("get", username ? `/api/users/${username}` : "/api/photos")
      .then(res => {
        const user = res.user ? { ...res.user[0] } : {};
        this.setState({ photos: res.photos, user, storePhotos: res.photos });
        return true;
      })
      .catch(err => console.log(err));
  };

  fetchPhotosByHashtag = hashtag => {
    return apiCall("get", "/api/photos/" + hashtag)
      .then(res => {
        this.setState({ photos: res.photos });
        return true;
      })
      .catch(err => console.log(err));
  };

  fetchPhotosLikedByUser = username => {
    return apiCall("get", "/api/users/" + username + "/likes")
      .then(res => {
        this.setState({ photosLikedByUser: res.photos });
        return true;
      })
      .catch(err => console.log(err));
  };

  addNewPhoto = photo => {
    this.setState(state => {
      return { photos: [photo, ...state.photos] };
    });
  };

  switchPhotos = type => {
    if (type === "likes") {
      this.setState(state => ({ storePhotos: state.photos }));
      this.setState(state => ({ photos: state.photosLikedByUser }));
    } else if (type === "photos") {
      this.setState(state => ({ photosLikedByUser: state.photos }));
      this.setState(state => ({ photos: state.storePhotos }));
    }
  };

  login = loginData => {
    apiCall("post", "api/auth/login", {
      user: loginData
    })
      .then(res => {
        const { user, token } = res;
        localStorage.setItem("jwtToken", token);
        setTokenHeader(token);
        this.setCurrentUser(user);
        this.props.history.push("/");
        this.setState({ errorMessage: "", loginMessage: true });
      })
      .catch(err => {
        console.log(err);
        if (err.message) {
          this.setState({ errorMessage: err.message });
        }
      });
  };

  setCurrentUser = user => this.setState({ currentUser: user });

  setErrorMessage = errorMessage => this.setState({ errorMessage });

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
      this.loginRequired();
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

  onChangeCommentText = (id, e) => {
    const newState = this.state.photos.map(x => {
      if (x.id !== id) return x;
      return { ...x, commentText: e.target.value };
    });
    this.setState({ photos: newState });
  };

  addNewComment = async (photo, commentsContainer) => {
    const { currentUser } = this.state;
    const comments = [
      ...photo.comments,
      { username: currentUser.username, comment_text: photo.commentText }
    ];
    const newState = this.state.photos.map(x => {
      if (x.id !== photo.id) return x;
      return { ...x, comments, commentText: "" };
    });
    this.setState({ photos: newState }, () => {
      commentsContainer.scrollTop = commentsContainer.scrollHeight;
    });
    const res = await apiCall("post", "/api/comments", {
      photoID: photo.id,
      userID: currentUser.id,
      comment: photo.commentText
    });
    console.log(res);
  };

  loginRequired = () => {
    this.setState({ errorMessage: "You must be logged in" });
    this.props.history.push("/login");
  };

  logout = () => {
    localStorage.clear();
    setTokenHeader(false);
    this.setState({ currentUser: undefined });
    // to do: clear logged in user message?
  };

  render() {
    return (
      <div className="App">
        <Navbar
          currentUser={this.state.currentUser}
          logout={this.logout}
          fetchPhotosByHashtag={this.fetchPhotosByHashtag}
          addNewPhoto={this.addNewPhoto}
        />
        <div className="container">
          {this.state.loginMessage && (
            <LoginMessage
              currentUser={this.state.currentUser}
              clearLoginMessage={() => this.setState({ loginMessage: false })}
            />
          )}
          <Switch>
            <Route
              path="/signup"
              exact
              render={props => (
                <Signup
                  {...props}
                  setCurrentUser={this.setCurrentUser}
                  errorMessage={this.state.errorMessage}
                  setErrorMessage={this.setErrorMessage}
                />
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
                  errorMessage={this.state.errorMessage}
                />
              )}
            />
            <Route
              path={"/photos/:hashtag"}
              exact
              render={props => (
                <PhotoGrid
                  {...props}
                  fetchPhotos={this.fetchPhotos}
                  fetchPhotosByHashtag={this.fetchPhotosByHashtag}
                  currentUser={this.state.currentUser}
                  photos={this.state.photos}
                  togglePhotoLike={this.togglePhotoLike}
                  onChangeCommentText={this.onChangeCommentText}
                  addNewComment={this.addNewComment}
                  loginRequired={this.loginRequired}
                  readyCallback={() => null}
                />
              )}
            />
            <Route
              path="/:username"
              exact
              render={props => (
                <User
                  {...props}
                  fetchPhotos={this.fetchPhotos}
                  fetchPhotosLikedByUser={this.fetchPhotosLikedByUser}
                  currentUser={this.state.currentUser}
                  photos={this.state.photos}
                  storePhotos={this.state.storePhotos}
                  user={this.state.user}
                  togglePhotoLike={this.togglePhotoLike}
                  onChangeCommentText={this.onChangeCommentText}
                  addNewComment={this.addNewComment}
                  loginRequired={this.loginRequired}
                  switchPhotos={this.switchPhotos}
                />
              )}
            />
            <Route
              path="/"
              exact
              render={props => (
                <PhotoGrid
                  {...props}
                  fetchPhotos={this.fetchPhotos}
                  fetchPhotosByHashtag={this.fetchPhotosByHashtag}
                  currentUser={this.state.currentUser}
                  photos={this.state.photos}
                  togglePhotoLike={this.togglePhotoLike}
                  onChangeCommentText={this.onChangeCommentText}
                  addNewComment={this.addNewComment}
                  loginRequired={this.loginRequired}
                  readyCallback={() => null}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
