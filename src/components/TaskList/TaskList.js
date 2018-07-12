import React from "react";
import {
  Container,
  Segment,
  Table,
  Header,
  Button,
  Message
} from "semantic-ui-react";

import firebase from "firebase";

export default class TaskList extends React.Component {
  state = {
    email: "",
    uid: ""
  };

  authListener = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          uid: user.uid,
          email: user.email
        });
        // const database = firebase.database();
        // database
        //   .ref("todos/" + this.state.uid)
        //   .set({
        //     taskName: "go to gym",
        //     status: "pending",
        //     dueDate: "2018-07-30"
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
      }
    });
  };

  componentDidMount = () => {
    this.authListener();
  };

  render() {
    const { loggedIn } = this.props;
    const { email, uid } = this.state;

    const TaskTable = () => (
      <Container>
        <Segment>
          <Segment vertical>
            Account: {email} UID: {uid}
          </Segment>
          <Header as="h2" textAlign="center">
            Tasks
          </Header>
          <Table celled fixed singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">Modify</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>John</Table.Cell>
                <Table.Cell>Approved</Table.Cell>
                <Table.Cell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Button icon="checkmark" />
                  <Button icon="edit" color="blue" />
                  <Button icon="trash" color="red" />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>
      </Container>
    );

    const NotLoggedIn = () => (
      <Container>
        <Message warning>
          <Message.Header>Not Logged In</Message.Header>
          <p>
            You are currently not logged in. Please login to view your To Do
            items.
          </p>
        </Message>
      </Container>
    );

    return (
      <React.Fragment>
        {loggedIn ? <TaskTable /> : <NotLoggedIn />}
      </React.Fragment>
    );
  }
}
