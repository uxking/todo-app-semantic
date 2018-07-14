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
  Modal,
  Form
} from "semantic-ui-react";

import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import firebase from "firebase";

export default class TaskList extends React.Component {
  state = {
    email: "",
    uid: "",
    todosLoading: true,
    dueDate: "",
    modalOpen: false,
    status: "",
    priority: null,
    taskName: ""
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

  handleDateChange = day => {
    console.log(day);
    this.setState({
      dueDate: day
    });
  };

  openAddTodoModal = () => {
    this.setState({
      modalOpen: true
    });
  };

  closeAddTodoModal = () => {
    this.setState({
      modalOpen: false,
      dueDate: ""
    });
  };

  handleChange = (e, { name, value }) => {
    e.preventDefault();
    console.log(e.target.name);
    console.log(name, value);
    this.setState({
      [name]: value
    });
  };

  handleTodoSubmit = e => {
    console.log(this.state);
  };

  render() {
    const { loggedIn } = this.props;
    const { email, uid, todosLoading, todos } = this.state;

    // arrays for the todo form select lists
    const addTodoFormPriorityOptions = [
      { key: "l", text: "Low", value: 3 },
      { key: "m", text: "Medium", value: 2 },
      { key: "h", text: "High", value: 1 }
    ];
    const addTodoFormStatusOptions = [
      { key: "p", text: "Pending", value: "pending" },
      { key: "c", text: "Completed", value: "completed" }
    ];

    // Module used in the input form as controll for dueDate field
    const DueDatePicker = () => (
      <DayPickerInput
        value={this.state.dueDate}
        onDayChange={this.handleDateChange}
      />
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
        {loggedIn ? (
          <Container>
            <Dimmer active={todosLoading}>
              <Loader inverted content="Almost there..." />
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
                      <Table.HeaderCell textAlign="center">
                        Status
                      </Table.HeaderCell>
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
                        <Modal
                          closeIcon
                          closeOnDimmerClick={false}
                          open={this.state.modalOpen}
                          onClose={this.closeAddTodoModal}
                          trigger={
                            <Button
                              color="teal"
                              circular
                              icon="add"
                              floated="right"
                              style={{ marginRight: "20px" }}
                              onClick={this.openAddTodoModal}
                            />
                          }
                        >
                          <Modal.Header>Add a ToDo</Modal.Header>
                          <Modal.Content>
                            <Header icon="pencil" color="blue" />
                            <Modal.Description>
                              Here you can add a new ToDo
                            </Modal.Description>
                            <Segment>
                              <Form>
                                <Form.Group>
                                  <Form.Input
                                    fluid
                                    label="Due Date"
                                    placeholder="Due Date"
                                    width="3"
                                    value={this.state.dueDate}
                                    control={DueDatePicker}
                                    //onChange={e => this.handleDateChange(e)}
                                    name="dueDate"
                                    required
                                  />
                                  <Form.Select
                                    fluid
                                    label="Priority"
                                    placeholder="Priority"
                                    name="priority"
                                    value={this.state.priority}
                                    options={addTodoFormPriorityOptions}
                                    onChange={this.handleChange}
                                    width="two"
                                  />
                                  <Form.Select
                                    fluid
                                    label="Status"
                                    placeholder="Status"
                                    name="status"
                                    value={this.state.status}
                                    options={addTodoFormStatusOptions}
                                    onChange={this.handleChange}
                                    width="three"
                                  />
                                  <Form.Input
                                    fluid
                                    label="Description"
                                    placeholder="What do you need To Do?"
                                    name="taskName"
                                    value={this.state.taskName}
                                    onChange={this.handleChange}
                                    width="eight"
                                  />

                                  <Form.Button
                                    color="teal"
                                    icon="add"
                                    labelPosition="right"
                                    content="Add"
                                    type="submit"
                                    style={{ marginTop: "24px" }}
                                    onClick={e => this.handleTodoSubmit(e)}
                                  />
                                </Form.Group>
                              </Form>
                            </Segment>
                          </Modal.Content>
                          <Modal.Actions>
                            <Button
                              onClick={this.closeAddTodoModal}
                              style={{ marginRight: "20px" }}
                            >
                              <Icon name="cancel" /> Cancel
                            </Button>
                          </Modal.Actions>
                        </Modal>
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
        ) : (
          <NotLoggedIn />
        )}
      </React.Fragment>
    );
  }
}
