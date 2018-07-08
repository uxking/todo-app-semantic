import React from "react";
import { MainContext } from "../../contexts/MainContext";

import SignUpForm from "./SignUpForm";

export default props => (
  <MainContext.Consumer>
    {({ signUpModal, handleSignUpClose }) => (
      <SignUpForm
        {...props}
        signUpModal={signUpModal}
        handleSignUpClose={handleSignUpClose}
      />
    )}
  </MainContext.Consumer>
);

// if you want additinal props not from the provider, export default (props)
// pass them to the coponent via {...props}
// most of th time not needed
