import React from "react";
import { Button, Modal, Segment, Form, Message } from "semantic-ui-react";

import fire from "firebase";

export default class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
    warning: false,
    loading: false
  };

  handleChange = e => {
    console.log(e.target.name, e.target.value);

    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    // start showing the loading animation while we use firebase
    this.setState({
      loading: true
    });

    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        console.log(user);
        this.props.handleValidLogin();
        // set the warning message to false for the next loginButton push
        this.setState({
          warning: false
        });
        this.props.handleLoginClose();
        // once we close, set the loading to false for the next loginButton push
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          warning: true,
          loading: false
        });
      });
  };

  authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      user && this.props.handleValidLogin();
    });
  };

  componentDidMount() {
    this.authListener();
  }

  render() {
    const { loginModal, handleLoginClose } = this.props;

    const { email, password, warning, loading } = this.state;

    return (
      <Modal
        open={loginModal}
        closeIcon
        onClose={handleLoginClose}
        dimmer="blurring"
      >
        <Modal.Header>Login to React Task List</Modal.Header>
        <Modal.Content>
          <Form
            size="large"
            warning={warning}
            loading={loading}
            onSubmit={e => this.handleSubmit(e)}
          >
            <Segment stacked>
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
                header="Invalid Login"
                content="Email or password is not recognized."
              />
              <Button color="teal" fluid size="large" type="submit">
                Login
              </Button>
            </Segment>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
