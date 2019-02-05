import React from "react";
import AgentDisplay from "../.././AgentDisplay/AgentDisplay";

export default class AdminAgents extends React.Component {
  render() {
    let adminAvailable = [];
    let adminOnCall = [];

    this.props.adminQueue.forEach(agent => {
      if (agent.agentStatus === "Available") {
        adminAvailable.push(agent);
      }
      if (agent.agentStatus === "On a Call") {
        adminOnCall.push(agent);
      }
    });

    adminAvailable = adminAvailable.sort((a, b) => {
      return a.statusChangeTime - b.statusChangeTime;
    });

    adminOnCall = adminOnCall.sort((a, b) => {
      return a.statusChangeTime - b.statusChangeTime;
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
                <AgentDisplay
                  key={agent.name}
                  userId={agent.userId}
                  status={agent.status}
                  statusTimer={agent.statusChangeTime}
                  callsTaken={agent.callsTaken}
                  penalty={agent.penalty}
                />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-oncall" id="at-calls-oncall">
            {adminOnCall.map(agent => {
              return [
                <AgentDisplay
                  key={agent.name}
                  userId={agent.userId}
                  statusTimer={agent.statusChangeTime}
                  callsTaken={agent.callsTaken}
                  penalty={agent.penalty}
                />
              ];
            })}
          </table>
        </div>
      </div>
    );
  }
}
