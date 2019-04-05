import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";

const config = {
  apiKey: "AIzaSyAkT2F06bi0jMFK8vuOf5d1HCZR1_ywO8o",
  authDomain: "facebook-auth-9054d.firebaseapp.com",
  databaseURL: "https://facebook-auth-9054d.firebaseio.com",
  projectId: "facebook-auth-9054d",
  storageBucket: "facebook-auth-9054d.appspot.com",
  messagingSenderId: "654015793385"
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
