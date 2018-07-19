import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

import NavBar from "../components/NavBar";
import LoginForm from "../components/LoginForm";
import TaskList from "../components/TaskList";

export default class App extends React.Component {
  state = {
    loading: true
  };

  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          loading: false
        }),
      1500
    ); // simulates an async action, and hides the spinner
  }

  render() {
    const { loading } = this.state;

    return loading ? (
      <Dimmer inverted active={loading}>
        <Loader content="One second.  We're working on it..." />
      </Dimmer>
    ) : (
      <div>
        <NavBar />
        <LoginForm />
        <TaskList />
      </div>
    );
  }
}
