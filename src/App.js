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
const provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  state = {
    user: null
  };

  login = () => {
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

  logout = () => {
    auth()
      .signOut()
      .then(() => {
        this.setState({ user: null });
      });
  };

  render() {
    const { user } = this.state;
    return (
      <div className="App">
        <p>{user ? `Hi, ${user.displayName}!` : "Hi!"}</p>
        <button onClick={this.login}>Login with Facebook</button>

        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default App;
