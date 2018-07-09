import React from "react";
import { Button, Container, Segment, Grid, Header } from "semantic-ui-react";
import fire from "firebase";

export default class NavBar extends React.Component {
  hanldeLogout = () => {
    fire.auth().signOut();
    this.props.handleLogOut(); // get from props since we aren't in render yet.
  };

  render() {
    const { loggedIn, handleMenuItemClick } = this.props;

    return (
      <Container>
        <Grid divided="vertically" columns={3}>
          <Grid.Row>
            <Grid.Column>
              <Segment vertical>
                <Button
                  name="hamburgerbutton"
                  icon="bars"
                  color="teal"
                  onClick={handleMenuItemClick}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column verticalAlign="bottom">
              <Segment vertical>
                <Header as="h1">React Task List</Header>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment vertical textAlign="right">
                {!loggedIn ? (
                  <Button name="loginButton" onClick={handleMenuItemClick}>
                    Login
                  </Button>
                ) : (
                  <Button name="logOutButton" onClick={this.hanldeLogout}>
                    Log Out
                  </Button>
                )}
                <Button
                  name="signUpButton"
                  primary
                  onClick={handleMenuItemClick}
                >
                  Sign Up
                </Button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
