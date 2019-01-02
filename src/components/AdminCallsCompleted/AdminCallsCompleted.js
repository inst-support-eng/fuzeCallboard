import React from "react";

export default class AdminCallsCompleted extends React.Component {
  render() {
    return (
      <div className="cbstats stats3">
        Completed{" "}
        <div className="queuestats" id="at-calls-completed">
          {this.props.adminCallsCompleted}
        </div>
      </div>
    );
  }
}
