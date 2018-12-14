import React from "react";

export default class StudentPaused extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.callsTaken}</td>
      </tr>
    );
  }
}
