import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import firebase from "firebase";

import { MainProvider } from "./contexts/MainContext";

const rootElement = document.getElementById("root");

// Initialize Firebase

const config = require("./config.json");
firebase.initializeApp(config);

ReactDOM.render(
  <MainProvider>
    <App />
  </MainProvider>,

  rootElement
);
