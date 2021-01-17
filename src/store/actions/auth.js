import axios from "axios";

import * as actionTypes from "./actionTypes";

const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken,
    userId
  };
};

const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error,
  };
};

const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime * 1000);
  }
}

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true
    }
    let url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA4xTbkvlV_PLl9fn_M9Znw9a1CGmvNZMk";
    if (isSignUp) url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA4xTbkvlV_PLl9fn_M9Znw9a1CGmvNZMk";
    axios.post(url, authData)
    .then((resp) => {
      dispatch(authSuccess(resp.data.idToken, resp.data.localId));
      dispatch(checkAuthTimeout(resp.data.expiresIn));
    })
    .catch((error) => {
      dispatch(authFailed(error.response.data.error));
    })
  };
};
