import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

import NavBar from "../components/NavBar";
import TaskList from "../components/TaskList";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

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

    return (
      <div>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <NavBar />
        <LoginForm />
        <SignUpForm />
        <TaskList />
      </div>
    );
  }
}
