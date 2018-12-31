import React from "react";

export default class AdminAvailable extends React.Component {
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
