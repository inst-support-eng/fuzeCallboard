import React from "react";
import Agent from "./Agent/Agent";

export default class Agents extends React.Component {
  render() {
    return this.props.persons.map((agent, index) => {
      return <Agent />;
    });
  }
}
