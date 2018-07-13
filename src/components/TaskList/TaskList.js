import React from "react";
import {
  Container,
  Segment,
  Table,
  Header,
  Button,
  Message,
  Label,
  Icon,
  Dimmer,
  Loader,
  Input,
  Modal
} from "semantic-ui-react";

import firebase from "firebase";

export default class TaskList extends React.Component {
  state = {
    email: "",
    uid: "",
    todosLoading: true
  };

  authListener = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          uid: user.uid,
          email: user.email
        });

        // START get todos code
        const todosRef = firebase.database().ref("todos/" + this.state.uid);
        todosRef.on("value", snapshot => {
          this.setState({ todos: snapshot.val(), todosLoading: false });
        });
        console.log(this.state.uid);
        // END get todos code;
      } // end of if user
    }); // end of authstatechanged
  }; //end of authListener

  addTodo = () => {
    // BEGIN add todo entry code
    const database = firebase.database();
    const todoRef = database.ref("todos/" + this.state.uid);
    todoRef
      .push({
        taskName: "go to gym",
        status: "pending",
        dueDate: "2018-07-30",
        priority: 2
      })
      .catch(error => {
        console.log(error);
      });
    // END add todo entry code
  };

  componentDidMount = () => {
    this.authListener();
  };

  render() {
    const { loggedIn } = this.props;
    const { email, uid, todosLoading } = this.state;

    const todos = this.state.todos;

    const TaskTable = () => (
      <Container>
        <Dimmer active={todosLoading}>
          <Loader />
        </Dimmer>
        <Segment>
          <Segment vertical>
            <Label color="blue">
              <Icon name="mail" />
              {email}
            </Label>
            <Label color="teal">
              <Icon name="user" />
              {uid}
            </Label>
          </Segment>
          <Header as="h2" textAlign="center">
            Tasks
          </Header>
          {todos ? (
            <Table celled compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Due Date</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">
                    Priority
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right" />
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {Object.keys(todos).map(element => {
                  return (
                    <Table.Row key={element}>
                      <Table.Cell collapsing>
                        {todos[element].dueDate}
                      </Table.Cell>

                      <Table.Cell collapsing textAlign="center">
                        {todos[element].priority}
                      </Table.Cell>
                      <Table.Cell collapsing textAlign="center">
                        {todos[element].status}
                      </Table.Cell>
                      <Table.Cell>{todos[element].taskName}</Table.Cell>
                      <Table.Cell collapsing textAlign="right">
                        <Button icon="checkmark" />
                        <Button icon="edit" color="blue" />
                        <Button icon="trash" color="red" />
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan="5">
                    <AddTodoModal />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          ) : (
            <React.Fragment>
              <Message positive>
                <Message.Header>No Todos</Message.Header>
                <p>
                  Looks like your all <b>caught up!</b>
                </p>
              </Message>
              <Table celled singleLine>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Due Date</Table.HeaderCell>
                    <Table.HeaderCell>Priority</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">
                      Modify
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell />
                    <Table.Cell />
                    <Table.Cell />
                    <Table.Cell />
                    <Table.Cell textAlign="right">
                      <Button icon="checkmark" disabled />
                      <Button icon="edit" color="blue" disabled />
                      <Button icon="trash" color="red" disabled />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer fullWidth>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan="5">
                      <Button
                        color="teal"
                        circular
                        icon="add"
                        floated="right"
                        style={{ marginRight: "20px" }}
                        onClick={this.addTodo}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </React.Fragment>
          )}
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

    const AddTodoModal = () => (
      <Modal
        trigger={
          <Button
            color="teal"
            circular
            icon="add"
            floated="right"
            style={{ marginRight: "20px" }}
          />
        }
      >
        <Modal.Header>Add a ToDo</Modal.Header>
        <Modal.Content>
          <Segment content="hi" />
          <Modal.Description>
            <Header>Fill out the form</Header>
            <p>
              We've found the following gravatar image associated with your
              e-mail address.
            </p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );

    return (
      <React.Fragment>
        {loggedIn ? <TaskTable /> : <NotLoggedIn />}
      </React.Fragment>
    );
  }
}
