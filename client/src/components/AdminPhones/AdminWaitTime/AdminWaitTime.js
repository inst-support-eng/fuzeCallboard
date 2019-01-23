import React from "react";

export default class AdminWaitTime extends React.Component {
  render() {
    return (
      <div className="cbstats stats2">
        Wait Time{" "}
        <div className="queuestats" id="at-call-waittime">
          {this.props.adminWaitTime}
        </div>
      </div>
    );
  }
}
