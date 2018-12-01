import React, { Component } from "react";
import classes from "./App.css";
import Agents from "../components/Agent/Agent";

const axios = require("axios");

class App extends Component {
  constructor() {
    super();
    this.state = {
      agents: [],
      loading: true
    };
  }
  componentDidMount() {
    axios
      .get("https://rest.data.fuze.com/agentEvents", {
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer 2.pmSBucbQczzE2yj.dXNlcjpyOW5va2pOdEdOOmUzaW15azlpZmU"
        }
      })
      .then(res => {
        const response = res.data;
        const agents = response.agentEvents;
        this.setState({ agents: agents });
      });
  }

  render() {
    return (
      <div>
        <p>agents</p>
        {this.state.agents.map(agent => (
          <div>
            {agent.eventType == "Connect" && (
              <li>{agent.userId} is On a Call</li>
            )}
            {agent.eventType == "Pause" && (
              <li>
                {agent.userId} is Paused for {agent.reason}
              </li>
            )}
            {agent.eventType != "Connect" &&
              agent.eventType != "Pause" &&
              agent.newState != "NotInQueue" && (
                <li>{agent.userId} is Available</li>
              )}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
