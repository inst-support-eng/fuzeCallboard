import React from "react";

export default class AdminAvailable extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.callsTaken}</td>
      </tr>
    );
  }
}
