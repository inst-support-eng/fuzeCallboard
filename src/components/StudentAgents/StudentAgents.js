import React from "react";
import StudentOnCall from "./StudentOnCall/StudentOnCall";
import StudentAvailable from "./StudentAvailable/StudentAvailable";

export default class StudentAgents extends React.Component {
  render() {
    let studentAvailable = [];
    let studentOnCall = [];

    this.props.studentQueue.forEach(agent => {
      if (agent.status === 1) {
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
              <td>Available Agents:</td>
              <td id="at-calls-available-total" />
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-available" id="at-calls-available">
            {studentAvailable.map(agent => {
              return [
                <StudentAvailable
                  name={agent.name}
                  callsTaken={agent.callsTaken}
                />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-oncall" id="at-calls-oncall">
            {studentOnCall.map(agent => {
              return [
                <StudentOnCall
                  name={agent.name}
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
