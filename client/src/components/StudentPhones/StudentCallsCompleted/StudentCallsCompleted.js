import React from "react";

export default class StudentCallsCompleted extends React.Component {
  render() {
    return (
      <div className="cbstats stats3">
        Completed{" "}
        <div className="queuestats" id="st-calls-completed">
          {this.props.studentCallsCompleted}
        </div>
      </div>
    );
  }
}
