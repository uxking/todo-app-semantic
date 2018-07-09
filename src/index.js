import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import firebase from "firebase";

import { MainProvider } from "./contexts/MainContext";

import "./styles.css";

const rootElement = document.getElementById("root");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDyROVb1zpCruA0g8zXjxVTH4OSXCQe2dk",
  authDomain: "crucial-zodiac-203604.firebaseapp.com",
  databaseURL: "https://crucial-zodiac-203604.firebaseio.com",
  projectId: "crucial-zodiac-203604",
  storageBucket: "crucial-zodiac-203604.appspot.com",
  messagingSenderId: "892834384609"
};
firebase.initializeApp(config);

ReactDOM.render(
  <MainProvider>
    <App />
  </MainProvider>,

  rootElement
);
