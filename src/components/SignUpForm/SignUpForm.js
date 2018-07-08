import React from "react";
import { Button, Modal, Segment, Form } from "semantic-ui-react";

export default class SignUpForm extends React.Component {
  render() {
    const { signUpModal, handleSignUpClose } = this.props;

    const ShowSignUpForm = () => (
      <Modal
        open={signUpModal}
        closeIcon
        onClose={handleSignUpClose}
        dimmer="blurring"
      >
        <Modal.Header>Sign Up for an Account</Modal.Header>
        <Modal.Content>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

              <Button color="teal" fluid size="large">
                Sign Up
              </Button>
            </Segment>
          </Form>
        </Modal.Content>
      </Modal>
    );

    return <ShowSignUpForm />;
  }
}
