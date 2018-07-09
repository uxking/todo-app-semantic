import React from "react";

export const MainContext = React.createContext();

export class MainProvider extends React.Component {
  state = {
    loggedIn: false,
    activeMenuItem: "",
    loginModal: false,
    signUpModal: false,
    username: "",
    email: ""
  };

  /* send the following functions to the Provider so others modules can use them */
  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeMenuItem: name });
    console.log("ActiveMenuItem is: " + name);
    switch (name) {
      case "loginButton":
        this.setState({ loginModal: true });
        break;
      case "signUpButton":
        this.setState({ signUpModal: true });
        break;
      default:
        // execute default code block
        break;
    }
  };

  handleLoginClose = () => {
    this.setState({
      loginModal: false
    });
  };

  handleSignUpClose = () => {
    this.setState({
      signUpModal: false
    });
  };

  handleValidLogin = () => {
    this.setState({
      loggedIn: true
    });
  };

  handleLogOut = () => {
    this.setState({
      loggedIn: false
    });
  };
  /* end of functions to send to Provider */

  render() {
    return (
      <MainContext.Provider
        value={{
          ...this.state,
          handleMenuItemClick: this.handleMenuItemClick,
          handleLoginClose: this.handleLoginClose,
          handleSignUpClose: this.handleSignUpClose,
          handleValidLogin: this.handleValidLogin,
          handleLogOut: this.handleLogOut
        }}
      >
        {this.props.children}
      </MainContext.Provider>
    );
  }
}
