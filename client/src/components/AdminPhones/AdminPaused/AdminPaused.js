import React from "react";
import AgentDisplay from "../.././AgentDisplay/AgentDisplay";

export default class AdminPaused extends React.Component {
  render() {
    let adminPaused = [];
    let adminUnavailable = [];

    this.props.adminQueue.forEach(agent => {
      if (agent.agentStatus === "Paused") {
        adminPaused.push(agent);
      }
      if (agent.agentStatus === "Unavailable") {
        adminUnavailable.push(agent);
      }
    });

    adminPaused = adminPaused.sort((a, b) => {
      return a.statusChangeTime - b.statusChangeTime;
    });

    adminUnavailable = adminUnavailable.sort((a, b) => {
      return a.statusChangeTime - b.statusChangeTime;
    });

    return (
      <div className="cbstats stats6 agentcontainer at-calls-paused-tab">
        <table>
          <tbody>
            <tr>
              <td>Paused Agents:</td>
              <td id="at-calls-paused-total">{adminPaused.length} </td>
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-paused" id="at-calls-paused">
            {adminPaused.map(agent => {
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
          <table className="calls-offline" id="at-calls-offline">
            {adminUnavailable.map(agent => {
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
      </div>
    );
  }
}
