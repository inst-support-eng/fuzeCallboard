import React from "react";
import AgentDisplay from ".././AgentDisplay/AgentDisplay";

export default class AdminAgents extends React.Component {
  render() {
    let adminAvailable = [];
    let adminOnCall = [];

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
              <td>Available Agents: </td>
              <td id="at-calls-available-total">{adminAvailable.length} </td>
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
                <AgentDisplay name={agent.name} callsTaken={agent.callsTaken} />
              ];
            })}
          </table>
        </div>
      </div>
    );
  }
}
