import React from "react";
import AgentDisplay from "../.././AgentDisplay/AgentDisplay";

export default class AdminPaused extends React.Component {
  render() {
    let adminPaused = [];
    let adminUnavailable = [];

    this.props.adminQueue.forEach(agent => {
      if (agent.paused === true && agent.status !== 5) {
        adminPaused.push(agent);
      }
      if (agent.status === 5) {
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
                  name={agent.name}
                  callsTaken={agent.callsTaken}
                  timer={agent.timer}
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
