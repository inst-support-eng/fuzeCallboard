import React from "react";

export default class StudentSLA extends React.Component {
  render() {
    return (
      <div className="cbstats stats4">
        SLA{" "}
        <div className="queuestats" id="st-call-sla">
          {this.props.studentSLA}%
        </div>
      </div>
    );
  }
}
