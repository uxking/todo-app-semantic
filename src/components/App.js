import React from "react";

import NavBar from "../components/NavBar";
import TaskList from "../components/TaskList";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm"

export default () => (
  <div>
    
    <NavBar />
    <LoginForm />
    <SignUpForm />
    <TaskList />
    
  </div>
);
