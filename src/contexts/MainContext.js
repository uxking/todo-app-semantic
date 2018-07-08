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
    this.setState({ loginModal: false });
    console.log("I'm the handleLoginClose");
  };

  handleSignUpClose = () => {
    this.setState({ signUpModal: false });
  };

  handleValidLogin = () => {
    this.setState({
      loggedIn : true
    })
  };

  render() {
    return (
      <MainContext.Provider
        value={{
          ...this.state,
          handleMenuItemClick: this.handleMenuItemClick,
          handleLoginClose: this.handleLoginClose,
          handleSignUpClose: this.handleSignUpClose,
          handleValidLogin: this.handleValidLogin
        }}
      >
        {this.props.children}
      </MainContext.Provider>
    );
  }
}
