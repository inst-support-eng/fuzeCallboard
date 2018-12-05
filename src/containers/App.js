import React, { Component } from "react";
import classes from "./App.css";
const keys = require("../config/keys");

const axios = require("axios");

class App extends Component {
  constructor() {
    super();
    this.state = {
      agents: [],
      adminQueue: [],
      adminCallsWaiting: 0,
      adminWaitTime: 0,
      adminActiveAgents: 0,
      adminCallsCompleted: 0,
      adminCallsAbandoned: 0,
      adminSLA: 0,
      studentQueue: [],
      studentCallsWaiting: 0,
      studentWaitTime: 0,
      studentActiveAgents: 0,
      studentCallsCompleted: 0,
      studentCallsAbandoned: 0,
      studentSLA: 0
    };
  }

  getAgents() {
    setInterval(() => {
      axios
        .get("https://rest.data.fuze.com/agentEvents", {
          headers: {
            Accept: "application/json",
            Authorization: keys.apiToken
          },
          params: {
            limit: 1000
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          const response = res.data;
          let agents = response.agentEvents;
          this.setState({ agents: agents });
        });
    }, 5000);
  }
  getCalls() {
    // get admin queue
    setInterval(() => {
      axios
        .get(
          "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/instru-prem-admin-service-q/status",
          {
            headers: {
              username: keys.username,
              password: keys.password
            }
          }
        )
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          const response = res.data;
          let temp = response.members;
          for (let i = 0; i < temp.length; i++) {
            let name = temp[i].name.replace("SIP/", "");
            temp[i].name = name;
          }
          this.setState({
            adminQueue: temp,
            adminCallsWaiting: response.callsWaiting,
            adminWaitTime: response.avgHoldTime,
            adminCallsCompleted: response.numCompleted,
            adminCallsAbandoned: response.numAbandoned,
            adminSLA: response.serviceLevelPerf
          });
        });

      // get studentqueue
      axios
        .get("https://rest.data.fuze.com/agentEvents", {
          headers: {
            Accept: "application/json",
            Authorization: keys.apiToken
          },
          params: {
            limit: 100
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          const response = res.data;
          let agents = response.agentEvents;
          this.setState({ agents: agents });
        });
      axios
        .get(
          "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/instru-english-service-q/status",
          {
            headers: {
              username: keys.username,
              password: keys.password
            }
          }
        )
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          const response = res.data;
          let temp = response.members;
          for (let i = 0; i < temp.length; i++) {
            let name = temp[i].name.substring(4);
            temp[i].name = name;
          }
          this.setState({
            studentQueue: temp,
            studentCallsWaiting: response.callsWaiting,
            studentWaitTime: response.avgHoldTime,
            studentCallsCompleted: response.numCompleted,
            studentCallsAbandoned: response.numAbandoned,
            studentSLA: response.serviceLevelPerf
          });
        });
    }, 5000);
  }

  replaceNames() {
    // replaces names from admin/ student q with less crap ones
    this.state.agents.forEach(agent => {
      let name = agent.peerName;
      let toChange = agent.userId;
      this.state.adminQueue.forEach(admin => {
        let name2 = admin.name;
        if (name == name2) {
          admin.name = toChange;
          admin.status = this.getStatus(admin.status);
        }
      });
      this.state.studentQueue.forEach(student => {
        let name2 = student.name;
        if (name == name2) {
          student.name = toChange;
          student.status = this.getStatus(student.status);
        }
      });
    });
  }

  getStatus(status) {
    let displayValue = ["Agent", "Status", "Calls"];

    let result;

    switch (status) {
      case 1:
        result = "Available";
        break;
      case 2:
        result = "On a Call";
        break;
      case 3:
        result = "Busy";
        break;
      case 4:
        result = "Invalid";
        break;
      case 5:
        result = "Unavailable";
        break;
      case 6:
        result = "Ringing";
        break;
      case 7:
        result = "Ringing";
        break;
      case 8:
        result = "On Hold";
        break;
      default:
        result = "Other";
        break;
    }
    return result;
  }

  componentDidMount() {
    // calls above functions
    this.getAgents();
    this.getCalls();
  }

  render() {
    this.replaceNames();
    return (
      <div className="callBoard">
        <p className="adminStats">
          admin calls SLA : {this.state.adminSLA} Calls Completed :
          {this.state.adminCallsCompleted} Wait Time :{" "}
          {this.state.adminWaitTime}
        </p>

        {this.state.adminQueue.map(agent => (
          <p key={agent.name}>
            {agent.name} is {agent.status} and took {agent.callsTaken} calls
          </p>
        ))}

        <p>
          {" "}
          student calls SLA : {this.state.studentSLA} Calls Completed :
          {this.state.studentCallsCompleted} Wait Time :{" "}
          {this.state.studentWaitTime}{" "}
        </p>
        {this.state.studentQueue.map(agent => (
          <p>
            {agent.name} is {agent.status} and took {agent.callsTaken} calls
          </p>
        ))}
      </div>
    );
  }
}

export default App;
