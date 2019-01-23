import React from "react";

export default class StudentWaitTime extends React.Component {
  render() {
    return (
      <div className="cbstats stats2">
        Wait Time{" "}
        <div className="queuestats" id="st-call-waittime">
          {this.props.studentWaitTime}
        </div>
      </div>
    );
  }
}
