import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import { MainProvider } from "./contexts/MainContext";

import "./styles.css";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <MainProvider>
    <App />
  </MainProvider>,

  rootElement
);
