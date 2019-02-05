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

    studentAvailable = studentAvailable.sort((a, b) => {
      return a.statusChangeTime - b.statusChangeTime;
    });

    studentOnCall = studentOnCall.sort((a, b) => {
      return a.statusChangeTime - b.statusChangeTime;
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
          <table className="calls-oncall" id="st-calls-oncall">
            {studentOnCall.map(agent => {
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
