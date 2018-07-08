import React from "react";
import { MainContext } from "../../contexts/MainContext";

import NavBar from "./NavBar";

export default props => (
  <MainContext.Consumer>
    {({ handleMenuItemClick }) => (
      <NavBar
        {...props}
        handleMenuItemClick={handleMenuItemClick}
      />
    )}
  </MainContext.Consumer>
);

// if you want additinal props not from the provider, export default (props)
// pass them to the coponent via {...props}
// most of th time not needed
