import React from "react";

export default class AdminSLA extends React.Component {
  render() {
    return (
      <div className="cbstats stats4">
        SLA{" "}
        <div className="queuestats" id="at-call-sla">
          {this.props.adminSLA}%
        </div>
      </div>
    );
  }
}
