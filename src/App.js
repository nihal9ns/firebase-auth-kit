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

  checkIfUserExists = async (email, providerId) => {
    const db = firebase.firestore();
    let result = [];
    const doc = await db
      .collection("user")
      .where("email", "==", email)
      .where("providerId", "==", providerId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          result.push(doc.data());
        });
        return result;
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });

    if (doc) {
      return true;
    } else {
      return false;
    }
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

  googleLogin = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth().signInWithPopup(provider);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(({ user }) => {
        this.setState({ user }, async () => {
          const data = user.providerData[0];
          const db = firebase.firestore();
          const test = await this.checkIfUserExists(
            user.email,
            data.providerId
          );
          if (this.checkIfUserExists(user.email, data.providerId)) {
            console.log("USER EXISTS");
          } else {
            db.collection("user").add({
              displayName: data.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              photoURL: data.photoURL,
              providerId: data.providerId,
              refreshToken: user.refreshToken,
              uid: data.uid
            });
          }
        });
      });
  };

  twitterLogin = () => {
    var provider = new firebase.auth.TwitterAuthProvider();
    auth().signInWithPopup(provider);
    firebase
      .auth()
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

  githubLogin = () => {
    var provider = new firebase.auth.GithubAuthProvider();
    auth().signInWithPopup(provider);
    firebase
      .auth()
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
        <button onClick={this.twitterLogin}>Login with Twitter</button> <br />
        <br />
        <button onClick={this.githubLogin}>Login with GitHub</button> <br />
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
