import React from "react";

export default class AgentDisplay extends React.Component {
  render() {
    return (
      <tbody>
        <tr>
          <td>{this.props.name}</td>
          <td>{this.props.counter}</td>
          <td align="right">{this.props.callsTaken}</td>
          <td align="right">{this.props.statusTimer}</td>
        </tr>
      </tbody>
    );
  }
}
