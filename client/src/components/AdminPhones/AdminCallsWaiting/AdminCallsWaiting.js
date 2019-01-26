import React from "react";

export default class AdminCallsWaiting extends React.Component {
  render() {
    return (
      <div className="cbstats stats1">
        Calls Waiting{" "}
        <div className="queuestats" id="at-callswaiting">
          {this.props.adminCallsWaiting}
        </div>
      </div>
    );
  }
}
