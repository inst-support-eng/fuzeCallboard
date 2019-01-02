import React from "react";

export default class StudentOnCall extends React.Component {
  render() {
    return (
      <tbody>
        <tr>
          <td>{this.props.name}</td>
          <td align="right">{this.props.callsTaken}</td>
        </tr>
      </tbody>
    );
  }
}
