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
  Form,
  Transition,
  Image,
  Confirm,
  Input,
  Select,
  Grid,
  Divider,
  Popup
} from "semantic-ui-react";

import moment from "moment";

import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import firebase from "firebase";

export default class TaskList extends React.Component {
  state = {
    email: "",
    uid: "",
    todosLoading: true,
    dueDate: "None",
    modalOpen: false,
    status: "",
    statusError: false,
    priority: null,
    priorityError: false,
    taskName: "",
    taskNameError: false,
    visible: false,
    confirmOpen: false,
    editButtonsVisible: false,
    element: {}
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
  };
  //end of authListener

  // BEGIN add todo entry code
  addTodo = () => {
    const database = firebase.database();
    const todoRef = database.ref("todos/" + this.state.uid);
    todoRef
      .push({
        taskName: this.state.taskName,
        status: this.state.status,
        dueDate: this.state.dueDate,
        priority: this.state.priority
      })
      .then(() => {
        this.setState({
          visible: true,
          taskName: "",
          status: "",
          dueDate: "None",
          priority: null
        });
        setTimeout(() => this.setState({ visible: false }), 1000); // simulates an async action, and hides the spinner
      })
      .catch(error => {
        console.log(error);
      });
  };
  // END add todo entry code

  // Begin delete todo entry
  deleteTodo = taskElement => {
    console.log("Delete pushed");
    console.log(taskElement);
    const database = firebase.database();
    const deleteRef = database.ref(
      "todos/" + this.state.uid + "/" + taskElement
    );
    deleteRef
      .remove()
      .then(() => {
        this.setState({ confirmOpen: false });
      })
      .catch(error => {
        console.log(error);
      });
  };
  // END delete todo entry

  completeTodo = (taskElement, currentStatus) => {
    const database = firebase.database();
    const completeRef = database.ref(
      "todos/" + this.state.uid + "/" + taskElement
    );
    console.log(taskElement);
    console.log(currentStatus);
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    completeRef
      .update({ status: newStatus })
      .then(() => {
        console.log("todo completed");
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleSaveEditTodo = () => {
    const database = firebase.database();
    const saveEditRef = database.ref(
      "todos/" + this.state.uid + "/" + this.state.element
    );

    saveEditRef
      .update({
        dueDate: this.state.dueDate,
        priority: this.state.priority,
        status: this.state.status,
        taskName: this.state.taskName
      })
      .then(() => {
        console.log("todo update completed");
        this.setState({
          dueDate: "None",
          priority: null,
          status: "",
          taskName: "",
          editButtonsVisible: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Executes when "edit" button in tableis pressed
  editTodo = (
    currentElement,
    currentDueDate,
    currentPriority,
    currentStatus,
    currentTaskName
  ) => {
    this.setState({
      element: currentElement,
      dueDate: currentDueDate,
      priority: currentPriority,
      status: currentStatus,
      taskName: currentTaskName,
      editButtonsVisible: true,
      priorityError: false,
      statusError: false,
      taskNameError: false
    });
  };
  // END "edit" in table button pressed

  // Cancels the edit function
  handleCancelEditPushed = () => {
    this.setState({
      dueDate: "Never",
      priority: null,
      status: "",
      taskName: "",
      editButtonsVisible: false,
      priorityError: false,
      statusError: false,
      taskNameError: false
    });
  };
  // END cancl edit function

  componentDidMount = () => {
    this.authListener();
  };

  handleDateChange = day => {
    const submittedDate = moment(day).format("MM-DD-YYYY");
    this.setState({
      dueDate: submittedDate
    });
  };

  openConfirm = () => {
    this.setState({ confirmOpen: true });
  };
  closeConfirm = () => {
    this.setState({ confirmOpen: false });
  };

  openAddTodoModal = () => {
    this.setState({
      modalOpen: true
    });
  };

  closeAddTodoModal = () => {
    this.setState({
      modalOpen: false,
      dueDate: "None",
      priority: null,
      status: "",
      taskName: ""
    });
  };

  handleChange = (e, { name, value }) => {
    name === "priority" && this.setState({ priorityError: false });
    name === "status" && this.setState({ statusError: false });
    name === "taskName" && this.setState({ taskNameError: false });

    this.setState({
      [name]: value
    });
  };

  handleTodoSubmit = e => {
    console.log(this.state);

    this.state.priority === null && this.setState({ priorityError: true });
    this.state.status === "" && this.setState({ statusError: true });
    this.state.taskName === "" && this.setState({ taskNameError: true });

    this.state.priority !== null &&
      this.state.status !== "" &&
      this.state.taskName !== "" &&
      this.addTodo();
  };

  render() {
    const { loggedIn } = this.props;
    const { email, uid, todosLoading, todos } = this.state;

    // arrays for the todo form priority and select lists
    const addTodoFormPriorityOptions = [
      { key: "l", text: "Low", value: 3 },
      { key: "m", text: "Medium", value: 2 },
      { key: "h", text: "High", value: 1 }
    ];
    const addTodoFormStatusOptions = [
      { key: "p", text: "Pending", value: "Pending" },
      { key: "c", text: "Completed", value: "Completed" }
    ];
    // End arrays for the todo form priority and select lists

    // Module used in the input form as controll for dueDate field
    const DueDatePicker = () => (
      <DayPickerInput
        format="MM-DD-YYYY"
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
            <Dimmer inverted active={todosLoading}>
              <Loader content="Almost there..." />
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
                      <Table.HeaderCell width="two">Due Date</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Priority
                      </Table.HeaderCell>
                      <Table.HeaderCell width="two" textAlign="center">
                        Status
                      </Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell textAlign="right" />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {/* We get an Object for todos so we have to map and pull out each "element" */}
                    {Object.keys(todos).map(element => {
                      // Begin decorationStyle
                      const decorationStyle = {
                        textDecorationLine:
                          todos[element].status === "Completed"
                            ? "line-through"
                            : "none",
                        textDecorationColor: "#00b5ad",
                        textDecorationStyle: "solid",
                        color:
                          todos[element].status === "Completed"
                            ? "#00b5ad"
                            : "#000",
                        fontWeight:
                          todos[element].status === "Completed" ? 100 : 600,
                        backgroundColor:
                          todos[element].status === "Completed"
                            ? "#fffaf3"
                            : "#fff"
                      };
                      // END of decorationStyle
                      return (
                        <Table.Row key={element} style={decorationStyle}>
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
                            <Popup
                              trigger={
                                <Button
                                  icon="checkmark"
                                  color={
                                    todos[element].status === "Completed"
                                      ? "teal"
                                      : "grey"
                                  }
                                  onClick={(taskElement, currentStatus) =>
                                    this.completeTodo(
                                      element,
                                      todos[element].status
                                    )
                                  }
                                />
                              }
                              content={
                                todos[element].status === "Completed"
                                  ? "Undo Completed"
                                  : "Mark Completed"
                              }
                            />
                            <Popup
                              trigger={
                                <Button
                                  icon="edit"
                                  name="edit"
                                  color="blue"
                                  onClick={(
                                    currentElement,
                                    currentDueDate,
                                    currentPriority,
                                    currentStatus,
                                    currentTaskName
                                  ) =>
                                    this.editTodo(
                                      element,
                                      todos[element].dueDate,
                                      todos[element].priority,
                                      todos[element].status,
                                      todos[element].taskName
                                    )
                                  }
                                />
                              }
                              content="Edit Todo"
                            />
                            <Popup
                              trigger={
                                <Button
                                  icon="trash"
                                  color="red"
                                  name="delete"
                                  onClick={this.openConfirm}
                                />
                              }
                              content="Delete"
                            />
                            {/* confirm delete modal */}
                            <Confirm
                              size="tiny"
                              header="Delete"
                              content="Are you sure you want to delete this To Do Item?"
                              open={this.state.confirmOpen}
                              cancelButton="Nevermind"
                              confirmButton="Do it!"
                              onCancel={this.closeConfirm}
                              onConfirm={taskElement =>
                                this.deleteTodo(element)
                              }
                            />
                            {/* End confirm delete modal */}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                    {/* End of Object.keys */}
                  </Table.Body>
                </Table>
              ) : (
                <Message positive>
                  <Message.Header>No Todos</Message.Header>
                  <p>
                    Looks like your all <b>caught up!</b>
                  </p>
                </Message>
              )}
              {/* Add a form at the end of the table */}
              <Divider />
              <Form>
                <Form.Group widths="equal">
                  <Form.Field
                    label="Due Date"
                    placeholder="Due Date"
                    value={this.state.dueDate}
                    control={DueDatePicker}
                    name="dueDate"
                    width="three"
                  />
                  <Form.Field
                    control={Select}
                    error={this.state.priorityError}
                    label="Priority"
                    placeholder="Priority"
                    name="priority"
                    value={this.state.priority}
                    options={addTodoFormPriorityOptions}
                    onChange={this.handleChange}
                    width="three"
                  />
                  <Form.Field
                    control={Select}
                    error={this.state.statusError}
                    label="Status"
                    placeholder="Status"
                    name="status"
                    value={this.state.status}
                    options={addTodoFormStatusOptions}
                    onChange={this.handleChange}
                    width="three"
                  />
                  <Form.Field
                    control={Input}
                    error={this.state.taskNameError}
                    label="Description"
                    placeholder="What do you need To Do?"
                    name="taskName"
                    value={this.state.taskName}
                    onChange={this.handleChange}
                    width="eight"
                  />
                </Form.Group>
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      floated="right"
                      textAlign="right"
                      width="twelve"
                    >
                      {/* Start of transition after adding todo */}
                      <Transition.Group
                        animation="vertical flip"
                        duration={500}
                      >
                        {this.state.visible && (
                          <Image floated="right">
                            <Label
                              content="Todo Added"
                              color="teal"
                              icon="circle check"
                              size="large"
                            />
                          </Image>
                        )}
                      </Transition.Group>
                      {/* End of transtion after adding todo */}
                    </Grid.Column>
                    {/* BEGIN show edit buttons */
                    this.state.editButtonsVisible ? (
                      <React.Fragment>
                        <Grid.Column width="two">
                          <Form.Field
                            control={Button}
                            color="teal"
                            icon="save"
                            name="editBtn"
                            labelPosition="right"
                            content="Save"
                            onClick={this.handleSaveEditTodo}
                          />
                        </Grid.Column>
                        <Grid.Column width="two" textAlign="right">
                          <Form.Field
                            icon="cancel"
                            control={Button}
                            name="cancelBtn"
                            content="Cancel"
                            onClick={this.handleCancelEditPushed}
                          />
                        </Grid.Column>
                      </React.Fragment>
                    ) : (
                      <Grid.Column floated="right" width="two">
                        <Form.Field
                          floated="right"
                          control={Button}
                          color="teal"
                          icon="add"
                          name="addBtn"
                          labelPosition="right"
                          content="Add"
                          onClick={e => this.handleTodoSubmit(e)}
                        />
                      </Grid.Column>
                    )}
                  </Grid.Row>
                </Grid>
              </Form>
              {/* End add a form at the end of the table */}
            </Segment>
          </Container>
        ) : (
          <NotLoggedIn />
        )}
      </React.Fragment>
    );
  }
}
