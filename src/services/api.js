import axios from "axios";

// Create React App environment variables are embedded
// into the final built application. They must be prefixed
// with REACT_APP_ to be picked up by Create React App. The
// standard .env file can be overriden with more specific files
// such as .env.local, .env.production, etc. if necesary.
const API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

export function apiCall(method, path, data) {
  const url = API_SERVER_URL + path;
  return new Promise((resolve, reject) => {
    return axios[method](url, data)
      .then(res => {
        return resolve(res.data);
      })
      .catch(err => {
        return reject(err.response.data.error);
      });
  });
}

export function uploadFile(file, signedRequest) {
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
}
