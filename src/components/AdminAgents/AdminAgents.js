import React from "react";
import AgentDisplay from ".././AgentDisplay/AgentDisplay";

export default class AdminAgents extends React.Component {
  render() {
    let adminAvailable = [];
    let adminOnCall = [];
    let adminPaused = [];

    this.props.adminQueue.forEach(agent => {
      if (agent.status === 1 && agent.paused === false) {
        adminAvailable.push(agent);
      }
      if (agent.status === 2 && agent.paused === false) {
        adminOnCall.push(agent);
      }
    });
    return (
      <div className="cbstats stats5 agentcontainer">
        <table>
          <tbody>
            <tr>
<<<<<<< HEAD
              <td>Available Agents: {adminAvailable.length}</td>
=======
              <td>Available:</td>
>>>>>>> 6801c4c196c5d9b8ec2ec1df861a049d2ed1fb08
              <td id="at-calls-available-total" />
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-available" id="at-calls-available">
            {adminAvailable.map(agent => {
              return [
                <AgentDisplay name={agent.name} callsTaken={agent.callsTaken} />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-oncall" id="at-calls-oncall">
            {adminOnCall.map(agent => {
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
