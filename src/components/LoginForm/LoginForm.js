import React from "react";
import {
  Button,
  Modal,
  Segment,
  Form,
  Message,
  Grid,
  Header
} from "semantic-ui-react";

import firebase from "firebase";

export default class LoginForm extends React.Component {
  state = {
    uid: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    loading: false,
    logInFocus: true,
    welcomeMessage: "Welcome Back",
    errorMessage: "",
    formError: false,
    formWarning: false,
    formFirstNameError: false,
    formLastNameError: false
  };

  setFocus = e => {
    if (e.target.name === "loginFocusButton") {
      this.setState({
        welcomeMessage: "Welcome back!",
        logInFocus: true,
        errorMessage: "",
        formError: false,
        formFirstNameError: false,
        formLastNameError: false,
        warning: false
      });
    } else {
      this.setState({
        welcomeMessage: "Create a free account",
        logInFocus: false
      });
    }
  };

  handleChange = e => {
    e.target.name === "firstName" &&
      this.setState({ formFirstNameError: false });
    e.target.name === "lastName" && this.setState({ formLastNameError: false });
    if (e.target.name.firstName !== "" && e.target.name.lastName !== "") {
      this.setState({ formError: false });
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    // start showing the loading animation while we use firebase
    this.setState({
      loading: true
    });

    if (e.target.name === "logInButton") {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          this.props.handleValidLogin();
          // set the warning message and loading animation to false for the next loginButton push
          this.setState({
            warning: false,
            loading: false,
            dimmerActive: false,
            errorMessage: ""
          });
          this.props.handleLoginClose();
          //this.authListener();
        })
        .catch(error => {
          this.setState({
            warning: true,
            loading: false,
            dimmerActive: false,
            errorMessage: error.message
          });
        });
    } else {
      if (this.state.firstName === "") {
        this.setState({
          formError: true,
          formFirstNameError: true,
          loading: false
        });
        return;
      } else if (this.state.lastName === "") {
        this.setState({
          formError: true,
          formLastNameError: true,
          loading: false
        });
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          this.props.handleValidLogin();
          this.setState({
            warning: false,
            loading: false,
            dimmerActive: false,
            errorMessage: ""
          });
          this.props.handleLoginClose();
          this.addUser();
        })
        .catch(error => {
          this.setState({
            warning: true,
            loading: false,
            dimmerActive: false,
            errorMessage: error.message
          });
        });
    }
  };

  addUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          uid: user.uid,
          email: user.email
        });
        const database = firebase.database();
        database.ref("users/" + this.state.uid).set({
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        });
        this.props.handleValidLogin();
      }
    });
  };
  authListener = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          email: user.email
        });
        this.props.handleValidLogin();
      }
    });
  };

  componentDidMount() {
    this.authListener();
  }

  render() {
    const { loginModal, handleLoginClose } = this.props;

    const {
      email,
      password,
      warning,
      loading,
      logInFocus,
      firstName,
      lastName,
      welcomeMessage,
      errorMessage,
      formError,
      formFirstNameError,
      formLastNameError
    } = this.state;

    return (
      <Modal
        open={loginModal}
        closeIcon
        onClose={handleLoginClose}
        dimmer="blurring"
        size="tiny"
      >
        <Modal.Header>Login or Sign Up</Modal.Header>
        <Modal.Content>
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column>
                <Button
                  color="teal"
                  fluid
                  icon="sign in"
                  labelPosition="left"
                  content="Log In"
                  name="loginFocusButton"
                  onClick={e => this.setFocus(e)}
                />
              </Grid.Column>
              <Grid.Column>
                <Button
                  primary
                  fluid
                  icon="signup"
                  labelPosition="left"
                  content="Sign Up"
                  name="signUpFocusButton"
                  onClick={e => this.setFocus(e)}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Form
            size="tiny"
            warning={warning}
            loading={loading}
            error={formError}
          >
            <Segment stacked>
              <Header>{welcomeMessage}</Header>
              {!logInFocus && (
                <React.Fragment>
                  <Form.Input
                    error={formFirstNameError}
                    fluid
                    placeholder="First Name"
                    name="firstName"
                    value={firstName}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    error={formLastNameError}
                    fluid
                    placeholder="Last Name"
                    name="lastName"
                    value={lastName}
                    onChange={this.handleChange}
                  />
                </React.Fragment>
              )}
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                name="password"
                value={password}
                type="password"
                onChange={this.handleChange}
              />
              <Message
                warning
                header="Oops... Something went wrong."
                content={errorMessage}
              />
              <Message error header="Error" content="Values cannot be blank." />
              {logInFocus ? (
                <Button
                  color="teal"
                  fluid
                  size="small"
                  name="logInButton"
                  onClick={e => this.handleSubmit(e)}
                >
                  Login
                </Button>
              ) : (
                <Button
                  primary
                  fluid
                  size="small"
                  name="signUpButton"
                  onClick={e => this.handleSubmit(e)}
                >
                  Sign Up
                </Button>
              )}
            </Segment>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
