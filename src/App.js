import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";

const config = {
  apiKey: "AIzaSyDLwrJMzPRdO_Ras4YNoCo3KuYdF-rfbpY",
  authDomain: "my-facebook-auth-app.firebaseapp.com",
  databaseURL: "https://my-facebook-auth-app.firebaseio.com",
  projectId: "my-facebook-auth-app",
  storageBucket: "my-facebook-auth-app.appspot.com",
  messagingSenderId: "119026616980"
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
