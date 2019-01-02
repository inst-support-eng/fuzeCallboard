import React from "react";

export default class StudentCallsWaiting extends React.Component {
  render() {
    return (
      <div className="cbstats stats1">
        Calls Waiting{" "}
        <div className="queuestats" id="st-callswaiting">
          {this.props.studentCallsWaiting}
        </div>
      </div>
    );
  }
}
