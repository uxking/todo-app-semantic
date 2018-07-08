import React from "react";
import { Button, Modal, Segment, Form, Message } from "semantic-ui-react";

const userData = require("../Data/data.json");

export default class LoginForm extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    warning: false
  };

  handleChange = e => {
    console.log(e.target.name, e.target.value);

    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    console.log(userData);
    if (
      e.target.email.value === userData.email &&
      e.target.password.value === userData.password
    ) {
      this.props.handleValidLogin(); // call from props to close the Login modal
      this.setState({ warning: false }); // valid login should reset form's warning=false
      this.props.handleLoginClose(); //call from props to close the Login modal
    } else {
      this.setState({
        warning: true
      });
    }
  };

  render() {
    const { loginModal, handleLoginClose } = this.props;

    const { email, password, warning } = this.state;

    return (
      <Modal
        open={loginModal}
        closeIcon
        onClose={handleLoginClose}
        dimmer="blurring"
      >
        <Modal.Header>Login to React Task List</Modal.Header>
        <Modal.Content>
          <Form size="large" warning={warning} onSubmit={this.handleSubmit}>
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
