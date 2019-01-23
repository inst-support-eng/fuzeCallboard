import React from "react";

import AdminAgents from "./AdminAgents/AdminAgents";
import AdminPaused from "./AdminPaused/AdminPaused";
import AdminSLA from "./AdminSLA/AdminSLA";
import AdminCallsWaiting from "./AdminCallsWaiting/AdminCallsWaiting";
import AdminWaitTime from "./AdminWaitTime/AdminWaitTime";
import AdminCallsCompleted from "./AdminCallsCompleted/AdminCallsCompleted";

export default class AdminPhones extends React.Component {
  render() {
    return (
      <div className="item2">
        {" "}
        <div className="row-title">Admin Phones</div>
        <div className="stats">
          <AdminCallsWaiting adminCallsWaiting={this.props.adminCallsWaiting} />
          <AdminWaitTime adminWaitTime={this.props.adminWaitTime} />
          <AdminCallsCompleted
            adminCallsCompleted={this.props.adminCallsCompleted}
          />
          <AdminSLA adminSLA={this.props.adminSLA} />
          <AdminAgents adminQueue={this.props.adminQueue} />
          <AdminPaused adminQueue={this.props.adminQueue} />
        </div>
      </div>
    );
  }
}
