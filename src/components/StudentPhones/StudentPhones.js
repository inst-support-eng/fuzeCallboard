import React from "react";

import StudentAgents from "./StudentAgents/StudentAgents";

import StudentPaused from "./StudentPaused/StudentPaused";

import StudentSLA from "./StudentSLA/StudentSLA";
import StudentCallsWaiting from "./StudentCallsWaiting/StudentCallsWaiting";
import StudentWaitTime from "./StudentWaitTime/StudentWaitTime";
import StudentCallsCompleted from "./StudentCallsCompleted/StudentCallsCompleted";

export default class StudentPhones extends React.Component {
  render() {
    return (
      <div className="item1">
        {" "}
        <div className="row-title">Student Phones</div>
        <div className="stats">
          <StudentCallsWaiting
            studentCallsWaiting={this.props.studentCallsWaiting}
          />
          <StudentWaitTime studentWaitTime={this.props.studentWaitTime} />
          <StudentCallsCompleted
            studentCallsCompleted={this.props.studentCallsCompleted}
          />
          <StudentSLA studentSLA={this.props.studentSLA} />
          <StudentAgents studentQueue={this.props.studentQueue} />
          <StudentPaused studentQueue={this.props.studentQueue} />
        </div>
      </div>
    );
  }
}
