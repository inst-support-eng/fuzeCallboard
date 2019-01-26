import React from "react";
import AgentDisplay from "../.././AgentDisplay/AgentDisplay";

export default class AdminPaused extends React.Component {
  render() {
    let adminPaused = [];
    let adminUnavailable = [];

    this.props.adminQueue.forEach(agent => {
      if (agent.status === "Paused") {
        adminPaused.push(agent);
      }
      if (agent.status === "Unavailable") {
        adminUnavailable.push(agent);
      }
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
                  statusTimer={agent.statusTimer}
                  callsTaken={agent.callsTaken}
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
                  statusTimer={agent.statusTimer}
                  callsTaken={agent.callsTaken}
                />
              ];
            })}
          </table>
        </div>
      </div>
    );
  }
}
