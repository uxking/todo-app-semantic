import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import firebase from "firebase";

import { MainProvider } from "./contexts/MainContext";

const rootElement = document.getElementById("root");

// Initialize Firebase
// Paste your firebase config in config.json
// Format is:
//
// {
//   "apiKey": "YOUR KEY",
//   "authDomain": "YOUR DOMAIN",
//   "databaseURL": "YOUR URL",
//   "projectId": "YOUR PROJECT",
//   "storageBucket": "YOUR BUCKET",
//   "messagingSenderId": "YOUR ID"
// }
const config = require("./config.json");
firebase.initializeApp(config);

ReactDOM.render(
  <MainProvider>
    <App />
  </MainProvider>,

  rootElement
);
