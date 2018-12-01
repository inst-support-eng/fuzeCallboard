import React from "react";
import classes from "./Agent.css";

export default class Agent extends React.Component {
  render() {
    return (
      <div className={classes.Agent}>
        <p>
          {this.props.name} is {this.props.eventType}
        </p>
      </div>
    );
  }
}
