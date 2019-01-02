import React from "react";
import AgentDisplay from ".././AgentDisplay/AgentDisplay";

export default class StudentPaused extends React.Component {
  render() {
    let studentPaused = [];
    let studentUnavailable = [];
    console.log(this.props.studentQueue);
    this.props.studentQueue.forEach(agent => {
      //console.log(agent.name + " : " + agent.timer);
      if (agent.paused === true && agent.status !== 5) {
        studentPaused.push(agent);
      }
      if (agent.status === 5) {
        studentUnavailable.push(agent);
      }
    });

    return (
      <div className="cbstats stats6 agentcontainer">
        <table>
          <tbody>
            <tr>
              <td>
                Paused Agents:{" "}
                {studentPaused.length + studentUnavailable.length}
              </td>
              <td id="st-calls-paused-total" />
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-paused" id="st-calls-paused">
            {studentPaused.map(agent => {
              return [
                <AgentDisplay name={agent.name} callsTaken={agent.callsTaken} />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-offline" id="st-calls-offline">
            {studentUnavailable.map(agent => {
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
