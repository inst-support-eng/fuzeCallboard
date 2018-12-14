import React, { Component } from "react";
import classes from "./App.css";
import StudentAvailable from ".././components/StudentAvailable/StudentAvailable";
import StudentOnCall from ".././components/StudentOnCall/StudentOnCall";
import StudentPaused from ".././components/StudentPaused/StudentPaused";
import AdminAvailable from ".././components/AdminAvailable/AdminAvailable";
import AdminOnCall from ".././components/AdminOnCall/AdminOnCall";
import AdminPaused from ".././components/AdminPaused/AdminPaused";
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
          console.log(res);
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
      let toChange = agent.userId.replace(".instru", "");
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

  componentDidMount() {
    // calls above functions
    this.getAgents();
    this.getCalls();
  }

  render() {
    this.replaceNames();
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
      <div class="grid-container">
        <div class="item1">
          {" "}
          Student Phones
          <div class="stats">
            <div class="cbstats stats1">
              Calls Waiting{" "}
              <div class="queuestats" id="st-callswaiting">
                {this.studentCallsWaiting}
              </div>
            </div>
            <div class="cbstats stats2">
              Wait Time{" "}
              <div class="queuestats" id="st-call-waittime">
                {this.studentWaitTime}
              </div>
            </div>
            <div class="cbstats stats3">
              Completed <div class="queuestats" id="st-calls-completed" />
            </div>
            <div class="cbstats stats4">
              SLA <div class="queuestats" id="st-call-sla" />
            </div>
            <div class="cbstats stats5 agentcontainer">
              <table>
                <tr>
                  <td>Available Agents:</td>
                  <td id="st-calls-available-total" />
                </tr>
              </table>
              <div>
                <table class="calls-available" id="st-calls-available">
                  {studentAvailable.map(agent => {
                    return [
                      <StudentAvailable
                        name={agent.name}
                        callsTaken={agent.callsTaken}
                      />
                    ];
                  })}
                </table>
              </div>
              <div>
                <table class="calls-oncall" id="st-calls-oncall">
                  {studentOnCall.map(agent => {
                    return [
                      <StudentOnCall
                        name={agent.name}
                        callsTaken={agent.callsTaken}
                      />
                    ];
                  })}
                </table>
              </div>
            </div>
            <div class="cbstats stats6 agentcontainer">
              <table>
                <tr>
                  <td>Paused Agents:</td>
                  <td id="st-calls-paused-total" />
                </tr>
              </table>
              <div>
                <table class="calls-paused" id="st-calls-paused">
                  {studentPaused.map(agent => {
                    return [
                      <StudentPaused
                        name={agent.name}
                        callsTaken={agent.callsTaken}
                      />
                    ];
                  })}
                </table>
              </div>
              <div>
                <table class="calls-offline" id="st-calls-offline">
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
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="item2">
          {" "}
          Admin Phones
          <div class="stats">
            <div class="cbstats stats1">
              Calls Waiting <div class="queuestats" id="at-callswaiting" />
            </div>
            <div class="cbstats stats2">
              Wait Time <div class="queuestats" id="at-call-waittime" />
            </div>
            <div class="cbstats stats3">
              Completed <div class="queuestats" id="at-calls-completed" />
            </div>
            <div class="cbstats stats4">
              SLA <div class="queuestats" id="at-call-sla" />
            </div>
            <div class="cbstats stats5 agentcontainer">
              <table>
                <tr>
                  <td>Available Agents:</td>
                  <td id="at-calls-available-total" />
                </tr>
              </table>
              <div>
                <table class="calls-available" id="at-calls-available">
                  {adminAvailable.map(agent => {
                    return [
                      <AdminAvailable
                        name={agent.name}
                        callsTaken={agent.callsTaken}
                      />
                    ];
                  })}
                </table>
              </div>
              <div>
                <table class="calls-oncall" id="at-calls-oncall">
                  {adminOnCall.map(agent => {
                    return [
                      <AdminOnCall
                        name={agent.name}
                        callsTaken={agent.callsTaken}
                      />
                    ];
                  })}
                </table>
              </div>
            </div>
            <div class="cbstats stats6 agentcontainer at-calls-paused-tab">
              <table>
                <tr>
                  <td>Paused Agents:</td>
                  <td id="at-calls-paused-total" />
                </tr>
              </table>
              <div>
                <table class="calls-paused" id="at-calls-paused">
                  {adminPaused.map(agent => {
                    return [
                      <AdminPaused
                        name={agent.name}
                        callsTaken={agent.callsTaken}
                      />
                    ];
                  })}
                </table>
              </div>
              <div>
                <table class="calls-offline" id="at-calls-offline">
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
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="item3">
          {" "}
          Student Chats
          <div class="stats">
            <div class="cbstats stats1">
              Queued <div class="queuestats" id="at-queuedchats" />
            </div>
            <div class="cbstats stats2">
              Wait Time <div class="queuestats" id="at-chat-waittime" />
            </div>
            <div class="cbstats stats3">
              Active Chats <div class="queuestats" id="at-activechats" />
            </div>
            <div class="cbstats stats4">
              SLA <div class="queuestats" id="at-chat-sla" />
            </div>
            <div class="cbstats stats5 agentcontainer-chats">
              <table>
                <tr>
                  <td>Accepting:</td>
                  <td id="st-chats-available-total" />
                </tr>
              </table>
              <div>
                <table class="chats-active" id="st-chats-available">
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
                </table>
              </div>
            </div>
            <div class="cbstats stats6 agentcontainer-chats">
              <table>
                <tr>
                  <td>Not Accepting:</td>
                  <td id="st-chats-paused-total" />
                </tr>
              </table>
              <div>
                <table class="chats-paused" id="st-chats-paused">
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
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="item4">
          {" "}
          Admin Chats
          <div class="stats">
            <div class="cbstats stats1">
              Queued <div class="queuestats" id="st-queuedchats" />
            </div>
            <div class="cbstats stats2">
              Wait Time <div class="queuestats" id="st-chat-waittime" />
            </div>
            <div class="cbstats stats3">
              Active Chats <div class="queuestats" id="st-activechats" />
            </div>
            <div class="cbstats stats4">
              SLA <div class="queuestats" id="st-chat-sla" />
            </div>
            <div class="cbstats stats5 agentcontainer-chats">
              <table>
                <tr>
                  <td>Paused:</td>
                  <td id="at-chats-available-total" />
                </tr>
              </table>
              <div>
                <table class="chats-active" id="at-chats-available">
                  <tr>
                    <td>Test Agent</td>
                    <td>10:15</td>
                    <td>3/4</td>
                  </tr>
                  <tr>
                    <td>Test Agent</td>
                    <td>10:15</td>
                    <td>3/4</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="cbstats stats6 agentcontainer-chats">
              <table>
                <tr>
                  <td>Paused:</td>
                  <td id="at-chats-paused-total" />
                </tr>
              </table>
              <div>
                <table class="chats-paused" id="at-chats-paused">
                  <tr>
                    <td>Test Agent</td>
                    <td>10:15</td>
                    <td>3/4</td>
                  </tr>
                  <tr>
                    <td>Test Agent</td>
                    <td>10:15</td>
                    <td>3/4</td>
                  </tr>
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
