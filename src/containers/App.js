import React, { Component } from "react";
import classes from "./App.css";
require("dotenv").config();
const axios = require("axios");
const API_TOKEN = process.env.REACT_APP_API_TOKEN;
const USERNAME = process.env.REACT_APP_USERNAME;
const PASSWORD = process.env.REACT_APP_PASSWORD;
const ADMIN_QUEUE = process.env.REACT_APP_ADMIN_QUEUE;
const STUDENT_QUEUE = process.env.REACT_APP_STUDENT_QUEUE;

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
            Authorization: API_TOKEN
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
      let url =
        "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/$QUEUE/status";
      axios
        .get(url.replace("$QUEUE", ADMIN_QUEUE), {
          headers: {
            username: USERNAME,
            password: "PASSWORD".replace("PASSWORD", PASSWORD)
          }
        })
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
            adminQueue: temp,
            adminCallsWaiting: response.callsWaiting,
            adminWaitTime: response.avgHoldTime,
            adminCallsCompleted: response.numCompleted,
            adminCallsAbandoned: response.numAbandoned,
            adminSLA: response.serviceLevelPerf
          });
        });

      // get student queue
      axios
        .get(url.replace("$QUEUE", STUDENT_QUEUE), {
          headers: {
            username: USERNAME,
            password: PASSWORD
          }
        })
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
        if (name === name2) {
          admin.name = toChange;
        }
      });
      this.state.studentQueue.forEach(student => {
        let name2 = student.name;
        if (name === name2) {
          student.name = toChange;
        }
      });
    });
  }

  counter(int) {
    int++;
  }

  componentDidMount() {
    // calls above functions
    this.getAgents();
    this.getCalls();
  }

  render() {
    this.replaceNames();
    let counter = setInterval(this.counter(1), 1000);
    let adminAvailable = [];
    let adminOnCall = [];
    let adminPaused = [];
    let studentAvailable = [];
    let studentOnCall = [];
    let studentPaused = [];
    // status codes
    // 1: "Available";
    // 2: "On a Call";
    // 3: "Busy";
    // 4: "Invalid";
    // 5: "Unavailable";
    // 6: "Ringing";
    // 7: "Ringing";
    // 8: "On Hold";

    // paused status comes from paused param
    // paused param is a boolean

    this.state.adminQueue.forEach(agent => {
      if (agent.status === 1 && agent.paused === false) {
        adminAvailable.push(agent);
      }
      if (agent.status === 2) {
        adminOnCall.push(agent);
      }
      if (agent.paused === true && agent.status !== 5) {
        adminPaused.push(agent);
      }
    });

    this.state.studentQueue.forEach(agent => {
      if (agent.status === 1) {
        studentAvailable.push(agent);
      }
      if (agent.status === 2) {
        studentOnCall.push(agent);
      }
      if (agent.paused === true && agent.status !== 5) {
        studentPaused.push(agent);
      }
    });
    return (
      <div className="callBoard">
        <p className="adminStats">
          admin calls SLA : {this.state.adminSLA} Calls Completed :
          {this.state.adminCallsCompleted} Wait Time :{" "}
          {this.state.adminWaitTime}
        </p>
        <p className="adminAvailable">
          Available Agents
          {adminAvailable.map(agent => (
            <p key={agent.name}>
              {agent.name} Calls : {agent.callsTaken}
            </p>
          ))}
        </p>
        <p className="adminOnCall">
          On Call
          {adminOnCall.map(agent => (
            <p key={agent.name}>
              {agent.name} Calls : {agent.callsTaken}
            </p>
          ))}
        </p>
        <p className="adminPaused">
          {" "}
          Paused
          {adminPaused.map(agent => (
            <p key={agent.name}>
              {agent.name} Paused for {counter}
            </p>
          ))}
        </p>

        <p className="studentStats">
          student calls SLA : {this.state.studentSLA} Calls Completed :
          {this.state.studentCallsCompleted} Wait Time :{" "}
          {this.state.studentWaitTime}{" "}
        </p>
        <p className="studentAvailable">
          Available Agents
          {studentAvailable.map(agent => (
            <p key={agent.name}>
              {agent.name} Calls : {agent.callsTaken}
            </p>
          ))}
        </p>

        <p className="studentOnCall">
          On Call
          {studentOnCall.map(agent => (
            <p key={agent.name}>
              {agent.name} Calls : {agent.callsTaken}
            </p>
          ))}
        </p>
        <p className="studentPaused">
          {" "}
          Paused
          {studentPaused.map(agent => (
            <p key={agent.name}>
              {agent.name} Paused for : {counter}
            </p>
          ))}
        </p>
      </div>
    );
  }
}

export default App;
