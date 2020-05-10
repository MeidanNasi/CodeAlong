import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Room from "./components/Room/room";
import { CreateRoom } from "./components/CreateRoom/createRoom";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/:roomId" exact component={Room} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
