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
        <Grid divided="vertically" columns={3} container>
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
            <Grid.Column>
              <Segment vertical>
                <Header as="h1">React Task List</Header>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment vertical textAlign="right">
                {!loggedIn ? (
                  <Button
                    color="teal"
                    name="loginButton"
                    onClick={handleMenuItemClick}
                  >
                    Login / Sign Up
                  </Button>
                ) : (
                  <Button name="logOutButton" onClick={this.hanldeLogout}>
                    Log Out
                  </Button>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
