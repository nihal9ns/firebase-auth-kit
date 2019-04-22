import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";

const config = {
  apiKey: "AIzaSyBw_hfmUcnwYpiZdmP2tEpsFSS3tXxrJXo",
  authDomain: "my-firebase-auth-kit.firebaseapp.com",
  databaseURL: "https://my-firebase-auth-kit.firebaseio.com",
  projectId: "my-firebase-auth-kit",
  storageBucket: "my-firebase-auth-kit.appspot.com",
  messagingSenderId: "278267327043"
};

firebase.initializeApp(config);

const auth = firebase.auth;

class App extends Component {
  state = {
    user: null
  };

  facebookLogin = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth()
      .signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user }, () => {
          const data = user.providerData[0];
          const db = firebase.firestore();
          db.collection("user").add({
            displayName: data.displayName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            photoURL: data.photoURL,
            providerId: data.providerId,
            refreshToken: user.refreshToken,
            uid: data.uid
          });
        });
      });
  };

  googleLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth().signInWithPopup(provider);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // console.log("token : ", token);
        // The signed-in user info.
        var user = result.user;
        // console.log("user : ", user);
        this.setState({ user }, () => {
          const data = user.providerData[0];
          const db = firebase.firestore();
          db.collection("user").add({
            displayName: data.displayName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            photoURL: data.photoURL,
            providerId: data.providerId,
            refreshToken: user.refreshToken,
            uid: data.uid
          });
        });
      })
      .catch(error => {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        alert("Error : ", errorMessage);
      });
  };

  signUpWithEmailPassword = () => {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    console.log("email : ", email);
    console.log("password : ", password);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error : ", errorMessage);
      });
  };

  loginWithEmailPassword = () => {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    console.log("email : ", email);
    console.log("password : ", password);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error : ", errorMessage);
      });
  };

  logout = () => {
    auth()
      .signOut()
      .then(() => {
        this.setState({ user: null });
      })
      .catch(error => {
        alert("Error : ", error);
      });
  };

  render() {
    const { user } = this.state;
    return (
      <div className="App">
        <p>{user ? `Hi, ${user.displayName}!` : "Hi!"}</p>
        <button onClick={this.facebookLogin}>Login with Facebook</button> <br />
        <br />
        <button onClick={this.googleLogin}>Login with Google</button> <br />
        <br />
        <form>
          <input type="text" ref="email" placeholder="email" /> <br />
          <br />
          <input type="password" ref="password" placeholder="password" />
          <br />
          <br />
          <button onClick={this.signUpWithEmailPassword.bind(this)}>
            Sign Up
          </button>
          <br />
          <br />
        </form>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default App;
