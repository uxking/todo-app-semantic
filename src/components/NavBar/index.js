import React from "react";
import { MainContext } from "../../contexts/MainContext";

import NavBar from "./NavBar";

export default props => (
  <MainContext.Consumer>
    {({ loggedIn, handleMenuItemClick, handleLogOut }) => (
      <NavBar
        {...props}
        loggedIn={loggedIn}
        handleMenuItemClick={handleMenuItemClick}
        handleLogOut={handleLogOut}
      />
    )}
  </MainContext.Consumer>
);

// if you want additinal props not from the provider, export default (props)
// pass them to the coponent via {...props}
// most of th time not needed
