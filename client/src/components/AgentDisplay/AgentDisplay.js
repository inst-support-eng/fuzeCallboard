import React from "react";

export default class AgentDisplay extends React.Component {
  render() {
    return (
      <tbody>
        <tr>
          <td>{this.props.userId}</td>
          <td>{this.props.counter}</td>
          <td align="right">{this.props.statusTimer}</td>
          <td align="right">{this.props.callsTaken}</td>
        </tr>
      </tbody>
    );
  }
}
