const express = require("express");
const router = express.Router();
const axios = require("axios");
const keys = require("../config/keys");
const replaceNames = require("../helpers/replaceNames");

const API_TOKEN = keys.REACT_APP_API_TOKEN;
const USERNAME = keys.REACT_APP_USERNAME;
const PASSWORD = keys.REACT_APP_PASSWORD;
const ADMIN_QUEUE = keys.REACT_APP_ADMIN_QUEUE;
const STUDENT_QUEUE = keys.REACT_APP_STUDENT_QUEUE;

module.exports = app => {
  // arrays with data that will later be sent to react side
  let adminData = [];
  let studentData = [];
  let agentData = [];

  let url =
    "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/$QUEUE/status";

  // these are the actual api calls made to the fuze data
  // what is returns is then stored in the above arrays
  getAdminData = async () => {
    const response = await axios.get(url.replace("$QUEUE", ADMIN_QUEUE), {
      headers: { username: USERNAME, password: PASSWORD }
    });

    let adminQueue = [];
    let temp = response.data.members;

    temp.forEach(el => {
      let penalty = el.penalty
      console.log(name + " => " + penalty);
      let name = el.name.substr(4);
      el.name = name;
      if (el.callsTaken === 0) {
        el.statusChangeTime = "—   ";
      } else {
        el.statusChangeTime = el.lastCall;
      }
    });

    if (!adminData.members) {
      adminQueue = temp;
    }

    if (adminData.members) {
      adminQueue = [...adminData.members];

      temp.forEach(agent => {
        let admin = agent;

        let index = adminQueue.forEach(el => {
          if (el.name === agent.name) {
            admin = el;
          }
        });

        if (admin == agent) {
          let name = admin.name.replace("SIP/", "");
          admin.name = name;
          if (admin.callsTaken === 0) {
            admin.statusChangeTime = "—   ";
          } else {
            admin.statusChangeTime = admin.lastCall;
          }
          adminQueue.push(admin);
        }

        if (admin.status !== agent.status || admin.paused != agent.paused) {
          let statusTime = Math.round(new Date().getTime() / 1000);
          admin.statusChangeTime = statusTime;
          admin.callsTaken = agent.callsTaken;
          admin.status = agent.status;
          admin.paused = agent.paused;
        }

        let exists = adminQueue.some(el => {
          return el.name === admin.name;
        });

        if (!exists) {
          console.log(exists, admin.name);
          adminQueue.push(admin);
        }
      });
    }

    let newArr = adminQueue.filter(el1 => {
      return temp.some(el2 => {
        return el1.name === el2.name;
      });
    });

    response.data.members = newArr;
    return (adminData = response.data);
  };

  getStudentData = async () => {
    const response = await axios.get(url.replace("$QUEUE", STUDENT_QUEUE), {
      headers: { username: USERNAME, password: PASSWORD }
    });

    let studentQueue = [];
    let temp = response.data.members;

    temp.forEach(el => {
      let name = el.name.replace("SIP/", "");
      el.name = name;
      if (el.callsTaken === 0) {
        el.statusChangeTime = "—   ";
      } else {
        el.statusChangeTime = el.lastCall;
      }
    });

    if (!studentData.members) {
      studentQueue = temp;
    }

    if (studentData.members) {
      studentQueue = [...studentData.members];

      temp.forEach(agent => {
        let student = agent;

        studentQueue.forEach(async el => {
          if (el.name === agent.name) {
            student = el;
          }
        });

        if (student == agent) {
          let name = student.name.replace("SIP/", "");
          student.name = name;
          if (student.callsTaken === 0) {
            student.statusChangeTime = "—   ";
          } else {
            student.statusChangeTime = student.lastCall;
          }
        }

        if (student.status !== agent.status || student.paused != agent.paused) {
          let statusTime = Math.round(new Date().getTime() / 1000);
          student.statusChangeTime = statusTime;
          student.callsTaken = agent.callsTaken;
          student.status = agent.status;
          student.paused = agent.paused;
        }
        let exists = studentQueue.some(el => {
          return el.name === student.name;
        });
        if (!exists) {
          console.log(student.name);
          studentQueue.push(student);
        }
      });
    }

    let newArr = studentQueue.filter(el1 => {
      return temp.some(el2 => {
        return el1.name === el2.name;
      });
    });

    response.data.members = newArr;
    return (studentData = response.data);
  };

  getAgentData = async () => {
    const response = await axios.get("https://rest.data.fuze.com/agentEvents", {
      headers: {
        Accept: "application/json",
        Authorization: API_TOKEN
      },
      params: {
        limit: 1000
      }
    });
    return (agentData = response.data);
  };

  // makes the above calls to fuze every 5 seconds. not browser based
  setInterval(() => {
    getAdminData(),
      getStudentData(),
      getAgentData(),
      replaceNames(
        agentData.agentEvents,
        studentData.members,
        adminData.members
      );
  }, 5000);
  // these are the routes react reaches
  // they just return the data that is stored in the arrays
  // so it doesnt matter how many calls are made
  // as the calls to fuze onlu happen every five seconds
  app.get("/api/adminQueue", async (req, res) => {
    await res.send(adminData);
  });

  app.get("/api/studentQueue", async (req, res) => {
    await res.send(studentData);
  });

  app.get("/api/getAgents", async (req, res) => {
    await res.send(agentData);
  });
};
