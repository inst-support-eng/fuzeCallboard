import React, { Component } from "react";
import classes from "./App.css";
import StudentAgents from ".././components/StudentAgents/StudentAgents";
import AdminAgents from ".././components/AdminAgents/AdminAgents";
import StudentPaused from ".././components/StudentPaused/StudentPaused";
// import AdminAvailable from ".././components/AdminAvailable/AdminAvailable";
// import AdminOnCall from ".././components/AdminOnCall/AdminOnCall";
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
            adminWaitTime: response.maxWaiting,
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
          let callsWaiting = response.callsWaiting;
          let waitTime = response.maxWaiting;
          let callsCompleted = response.numCompleted;
          let callsAbandoned = response.numAbandoned;
          let sla = response.serviceLevelPerf;

          let temp = response.members;
          for (let i = 0; i < temp.length; i++) {
            let name = temp[i].name.substring(4);
            temp[i].name = name;
          }
          this.setState({
            studentQueue: temp,
            studentCallsWaiting: callsWaiting,
            studentWaitTime: waitTime,
            studentCallsCompleted: callsCompleted,
            studentCallsAbandoned: callsAbandoned,
            studentSLA: sla
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
    let adminPaused = [];
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

    return (
      <div className="grid-container">
        <div className="item1">
          {" "}
          <div className="row-title">Student Phones</div>
          <div className="stats">
            <div className="cbstats stats1">
              Calls Waiting{" "}
              <div className="queuestats" id="st-callswaiting">
                {this.state.studentCallsWaiting}
              </div>
            </div>
            <div className="cbstats stats2">
              Wait Time{" "}
              <div className="queuestats" id="st-call-waittime">
                {this.state.studentWaitTime}
              </div>
            </div>
            <div className="cbstats stats3">
              Completed{" "}
              <div className="queuestats" id="st-calls-completed">
                {this.state.studentCallsCompleted}
              </div>
            </div>
            <div className="cbstats stats4">
              SLA{" "}
              <div className="queuestats" id="st-call-sla">
                {this.state.studentSLA}
              </div>
            </div>
            <StudentAgents studentQueue={this.state.studentQueue} />
            <div className="cbstats stats6 agentcontainer">
              <table>
                <tbody>
                  <tr>
                    <td>Paused Agents:</td>
                    <td id="st-calls-paused-total" />
                  </tr>
                </tbody>
              </table>
              <div>
                <table className="calls-paused" id="st-calls-paused">
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
                <table className="calls-offline" id="st-calls-offline">
                  <tbody>
                    <tr>
                      <td>Test Agent</td>
                      <td>10:15</td>
                      <td>32</td>
                    </tr>
                  </tbody>
                  <tbody>
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
        <div className="item2">
          {" "}
          <div className="row-title">Admin Phones</div>
          <div className="stats">
            <div className="cbstats stats1">
              Calls Waiting{" "}
              <div className="queuestats" id="at-callswaiting">
                {this.state.adminCallsWaiting}
              </div>
            </div>
            <div className="cbstats stats2">
              Wait Time{" "}
              <div className="queuestats" id="at-call-waittime">
                {this.state.adminWaitTime}
              </div>
            </div>
            <div className="cbstats stats3">
              Completed{" "}
              <div className="queuestats" id="at-calls-completed">
                {this.state.adminCallsCompleted}
              </div>
            </div>
            <div className="cbstats stats4">
              SLA{" "}
              <div className="queuestats" id="at-call-sla">
                {this.state.adminSLA}
              </div>
            </div>
            <AdminAgents adminQueue={this.state.adminQueue} />
            <div className="cbstats stats6 agentcontainer at-calls-paused-tab">
              <table>
                <tbody>
                  <tr>
                    <td>Paused Agents:</td>
                    <td id="at-calls-paused-total" />
                  </tr>
                </tbody>
              </table>
              <div>
                <table className="calls-paused" id="at-calls-paused">
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
                <table className="calls-offline" id="at-calls-offline">
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
        <div className="item3">
          {" "}
          <div className="row-title">Student Chats</div>
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
            <div className="cbstats stats5 agentcontainer-chats">
              <table>
                <tbody>
                  <tr>
                    <td>Accepting:</td>
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
            <div className="cbstats stats6 agentcontainer-chats">
              <table>
                <tbody>
                  <tr>
                    <td>Not Accepting:</td>
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
        <div className="item4">
          {" "}
          <div className="row-title">Admin Chats</div>
          <div className="stats">
            <div className="cbstats stats1">
              Queued <div className="queuestats" id="st-queuedchats" />
            </div>
            <div className="cbstats stats2">
              Wait Time <div className="queuestats" id="st-chat-waittime" />
            </div>
            <div className="cbstats stats3">
              Active Chats <div className="queuestats" id="st-activechats" />
            </div>
            <div className="cbstats stats4">
              SLA <div className="queuestats" id="st-chat-sla" />
            </div>
            <div className="cbstats stats5 agentcontainer-chats">
              <table>
                <tbody>
                  <tr>
                    <td>Paused:</td>
                    <td id="at-chats-available-total" />
                  </tr>
                </tbody>
              </table>
              <div>
                <table className="chats-active" id="at-chats-available">
                  <tbody>
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
                  </tbody>
                </table>
              </div>
            </div>
            <div className="cbstats stats6 agentcontainer-chats">
              <table>
                <tbody>
                  <tr>
                    <td>Paused:</td>
                    <td id="at-chats-paused-total" />
                  </tr>
                </tbody>
              </table>
              <div>
                <table className="chats-paused" id="at-chats-paused">
                  <tbody>
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
