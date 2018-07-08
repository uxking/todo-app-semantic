import React from "react";
import { MainContext } from "../../contexts/MainContext";

import TaskList from "./TaskList";

export default props => (
  <MainContext.Consumer>
    {({ loggedIn }) => (
      <TaskList
        {...props}
        loggedIn={loggedIn}
      />
    )}
  </MainContext.Consumer>
);

// if you want additinal props not from the provider, export default (props)
// pass them to the coponent via {...props}
// most of th time not needed
