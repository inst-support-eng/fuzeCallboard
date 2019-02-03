import React from "react";

export default class AgentDisplay extends React.Component {
  ppSeconds(time) {
    let hours = Math.floor(time / 3600);
    time %= 3600;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (hours === 0 && minutes === 0 && seconds < 10) {
      return "0:0" + seconds;
    } else if (hours === 0 && minutes === 0) {
      return "00:" + seconds;
    } else if (hours === 0 && minutes < 10 && seconds < 10) {
      return "0" + minutes + ":0" + seconds;
    } else if (hours === 0 && minutes < 10) {
      return "0" + minutes + ":" + seconds;
    } else if (hours === 0 && seconds < 10) {
      return minutes + ":0" + seconds;
    } else if (hours === 0) {
      return minutes + ":" + seconds;
    } else if (hours > 1 && minutes === 0 && seconds < 10) {
      return hours + ":00:0" + seconds;
    } else if (hours > 1 && minutes === 0) {
      return hours + ":00:" + seconds;
    } else if (hours > 1 && minutes < 10 && seconds < 10) {
      return hours + ":0" + minutes + ":0" + seconds;
    } else if (hours > 1 && minutes < 10) {
      return hours + ":0" + minutes + seconds;
    } else if (hours > 1 && seconds < 10) {
      return hours + ":" + minutes + ":0" + seconds;
    } else if (hours > 1) {
      return hours + ":" + minutes + ":" + seconds;
    } else {
      return "—   ";
    }
  }

  render() {
    let time = this.props.statusTimer;
    let penalty = this.props.penalty;
    if (penalty >= 5) {
      var displayTime = "overflow"
    } else {
      let currentTime = Math.round(new Date().getTime() / 1000);
      let difference = currentTime - time;
      var displayTime = this.ppSeconds(difference);
    }

    return (
      <tbody>
        <tr>
          <td>{this.props.userId ? this.props.userId.substring(0, 10) : ""}</td>
          <td>{this.props.counter}</td>
          <td align="right">{displayTime}</td>
          <td align="right">{this.props.callsTaken}</td>
        </tr>
      </tbody>
    );
  }
}
