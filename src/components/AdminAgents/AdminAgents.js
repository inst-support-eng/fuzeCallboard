import React from "react";
import AdminOnCall from "./AdminOnCall/AdminOnCall";
import AdminAvailable from "./AdminAvailable/AdminAvailable";

export default class AdminAgents extends React.Component {
  render() {
    let adminAvailable = [];
    let adminOnCall = [];
    let adminPaused = [];

    this.props.adminQueue.forEach(agent => {
      if (agent.status === 1) {
        adminAvailable.push(agent);
      }
      if (agent.status === 2) {
        adminOnCall.push(agent);
      }
    });
    return (
      <div className="cbstats stats5 agentcontainer">
        <table>
          <tbody>
            <tr>
              <td>Available:</td>
              <td id="at-calls-available-total" />
            </tr>
          </tbody>
        </table>
        <div>
          <table className="calls-available" id="at-calls-available">
            {adminAvailable.map(agent => {
              return [
                <AdminAvailable
                  name={agent.name}
                  callsTaken={agent.callsTaken}
                />
              ];
            })}
          </table>
        </div>
        <div>
          <table className="calls-oncall" id="at-calls-oncall">
            {adminOnCall.map(agent => {
              return [
                <AdminOnCall name={agent.name} callsTaken={agent.callsTaken} />
              ];
            })}
          </table>
        </div>
      </div>
    );
  }
}
