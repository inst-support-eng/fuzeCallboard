import React from "react";
import AgentDisplay from "../.././AgentDisplay/AgentDisplay";

export default class StudentAgents extends React.Component {
  render() {
    let studentAvailable = [];
    let studentOnCall = [];
    this.props.studentQueue.forEach(agent => {
      if (agent.agentStatus === "Available") {
        studentAvailable.push(agent);
      }
      if (agent.agentStatus === "On a Call") {
        studentOnCall.push(agent);
      }
    });
    return (
      <div className="cbstats stats5 agentcontainer">
        <table>
          <tbody>
            <tr>
              <td>Available Agents:</td>
              <td id="st-calls-available-total">{studentAvailable.length} </td>
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-available" id="st-calls-available">
            {studentAvailable.map(agent => {
              return [
                <AgentDisplay
                  key={agent.name}
                  userId={agent.userId}
                  statusTimer={agent.statusChangeTime}
                  callsTaken={agent.callsTaken}
                />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-oncall" id="st-calls-oncall">
            {studentOnCall.map(agent => {
              return [
                <AgentDisplay
                  key={agent.name}
                  userId={agent.userId}
                  statusTimer={agent.statusChangeTime}
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
