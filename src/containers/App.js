import React, { Component } from "react";
import "./App.css";

import StudentPhones from ".././components/StudentPhones/StudentPhones";
import AdminPhones from ".././components/AdminPhones/AdminPhones";

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

  // get agent nice name data from fuze
  async getAgents() {
    const res = await axios.get("https://rest.data.fuze.com/agentEvents", {
      headers: { Accept: "application/json", Authorization: API_TOKEN },
      params: { limit: 1000 }
    });

    const response = res.data;
    let agents = response.agentEvents;
    this.setState({ agents: agents });
  }

  // get calls for admin and student queue from fuze
  async getAdminCalls() {
    // get admin queue
    let url =
      "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/$QUEUE/status";
    const res = await axios.get(url.replace("$QUEUE", ADMIN_QUEUE), {
      headers: { username: USERNAME, password: PASSWORD }
    });

    // take respose and members array, and remove needless characters from name string
    const response = res.data;
    let temp = response.members;
    temp.forEach(agent => {
      let name = agent.name.substring(4);
      agent.name = name;
      agent.status = this.getStatus(agent);
    });
    this.setState({
      adminQueue: temp,
      adminCallsWaiting: response.callsWaiting,
      adminWaitTime: response.maxWaiting,
      adminCallsCompleted: response.numCompleted,
      adminCallsAbandoned: response.numAbandoned,
      adminSLA: response.serviceLevelPerf
    });
  }

  // get student queue
  async getStudentCalls() {
    let url =
      "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/$QUEUE/status";
    const res = await axios.get(url.replace("$QUEUE", STUDENT_QUEUE), {
      headers: { username: USERNAME, password: PASSWORD }
    });

    const response = res.data;
    let temp = response.members;
    temp.forEach(agent => {
      let name = agent.name.substring(4);
      agent.name = name;
      agent.status = this.getStatus(agent);
    });
    this.setState({
      studentQueue: temp,
      studentCallsWaiting: response.callsWaiting,
      studentWaitTime: response.maxWaiting,
      studentCallsCompleted: response.numCompleted,
      studentCallsAbandoned: response.numAbandoned,
      studentSLA: response.serviceLevelPerf
    });
  }

  replaceNames() {
    // replaces names from admin/ student q with less crap ones
    this.state.agents.forEach(agent => {
      let peerName = agent.peerName;
      let toChange = "";
      if (agent.userId.includes(".instru")) {
        toChange = agent.userId.replace(".instru", "");
      } else if (agent.userId.includes("@instructure")) {
        toChange = agent.userId.replace("@instructure.com", "");
      } else {
        toChange = agent.userId;
      }

      this.state.adminQueue.forEach(admin => {
        let agentName = admin.name;
        if (peerName === agentName) {
          return (admin.agentName = toChange);
        }
      });
      this.state.studentQueue.forEach(student => {
        let agentName = student.name;
        if (peerName === agentName) {
          return (student.agentName = toChange);
        }
      });
    });
  }

  getStatus(agent) {
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

    if (agent.status === 1 && agent.paused === false) {
      return (agent.status = "Available");
    }
    if (agent.status === 2 && agent.paused === false) {
      return (agent.status = "On a Call");
    }

    if (agent.paused === true && agent.status !== 5) {
      return (agent.status = "Paused");
    }
    if (agent.status === 5) {
      return (agent.status = "Unavailable");
    }
  }

  componentDidMount() {
    // calls above functions
    setInterval(() => this.getAgents(), 1000);
    setInterval(() => this.getAdminCalls(), 1000);
    setInterval(() => this.getStudentCalls(), 1000);
  }

  render() {
    this.replaceNames();

    return (
      <div className="grid-container">
        <StudentPhones
          studentCallsWaiting={this.state.studentCallsWaiting}
          studentWaitTime={this.state.studentWaitTime}
          studentCallsCompleted={this.state.studentCallsCompleted}
          studentSLA={this.state.studentSLA}
          studentQueue={this.state.studentQueue}
        />

        <AdminPhones
          adminCallsWaiting={this.state.adminCallsWaiting}
          adminWaitTime={this.state.adminWaitTime}
          adminCallsCompleted={this.state.adminCallsCompleted}
          adminSLA={this.state.adminSLA}
          adminQueue={this.state.adminQueue}
        />
        <div className="item3">
          {" "}
          <div className="row-title">Chats</div>
          <div className="stats">
            <div className="cbstats stats1">
              Queued <div className="queuestats" id="at-queuedchats" />
            </div>
            <div className="cbstats stats2">
              Wait Time <div className="queuestats" id="at-chat-waittime" />
            </div>
            <div className="cbstats stats3">
              Active Chats <div className="queuestats" id="at-activechats" />
            </div>
            <div className="cbstats stats4">
              SLA <div className="queuestats" id="at-chat-sla" />
            </div>
            <div className="cbstats stats5 agentcontainer">
              <table>
                <tbody>
                  <tr>
                    <td>Available:</td>
                    <td id="st-chats-available-total" />
                  </tr>
                </tbody>
              </table>
              <div>
                <table className="chats-active" id="st-chats-available">
                  <tbody>
                    <tr>
                      <td>Test Agent</td>
                      <td>10:15</td>
                      <td>32</td>
                    </tr>
                    <tr>
                      <td>Test Agent</td>
                      <td>10:15</td>
                      <td>32</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="cbstats stats6 agentcontainer">
              <table>
                <tbody>
                  <tr>
                    <td>Paused:</td>
                    <td id="st-chats-paused-total" />
                  </tr>
                </tbody>
              </table>
              <div>
                <table className="chats-paused" id="st-chats-paused">
                  <tbody>
                    <tr>
                      <td>Test Agent</td>
                      <td>10:15</td>
                      <td>32</td>
                    </tr>
                    <tr>
                      <td>Test Agent</td>
                      <td>10:15</td>
                      <td>32</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
