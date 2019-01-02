import React from "react";
import AgentDisplay from ".././AgentDisplay/AgentDisplay";

export default class StudentAgents extends React.Component {
  render() {
    let studentAvailable = [];
    let studentOnCall = [];
    this.props.studentQueue.forEach(agent => {
      if (agent.status === 1 && agent.paused === false) {
        studentAvailable.push(agent);
      }
      if (agent.status === 2) {
        studentOnCall.push(agent);
      }
    });
    return (
      <div className="cbstats stats5 agentcontainer">
        <table>
          <tbody>
            <tr>
<<<<<<< HEAD
              <td>Available Agents: {studentAvailable.length}</td>
              <td id="st-calls-available-total" />
=======
              <td>Available:</td>
              <td id="at-calls-available-total" />
>>>>>>> 6801c4c196c5d9b8ec2ec1df861a049d2ed1fb08
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-available" id="st-calls-available">
            {studentAvailable.map(agent => {
              return [
                <AgentDisplay name={agent.name} callsTaken={agent.callsTaken} />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-oncall" id="st-calls-oncall">
            {studentOnCall.map(agent => {
              return [
                <AgentDisplay
                  name={agent.name}
                  callsTaken={agent.callsTaken}
                  timer={agent.timer}
                />
              ];
            })}
          </table>
        </div>
      </div>
    );
  }
}
