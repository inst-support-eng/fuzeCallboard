const express = require("express");
const router = express.Router();
const axios = require("axios");
const keys = require("../config/keys");

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
    return (adminData = response.data);
  };

  getStudentData = async () => {
    const response = await axios.get(url.replace("$QUEUE", STUDENT_QUEUE), {
      headers: { username: USERNAME, password: PASSWORD }
    });
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
    getAdminData(), getStudentData(), getAgentData();
  }, 5000);

  // these are the routes react reaches
  // they just return the data that is stored in the arrays
  // so it doesnt matter how many calls are made
  // as the calls to fuze onlu happen every five seconds
  app.get("/api/adminQueue", async (req, res) => {
    await res.send(adminData);
  });

  app.get("/api/StudentQueue", async (req, res) => {
    await res.send(studentData);
  });

  app.get("/api/getAgents", async (req, res) => {
    await res.send(agentData);
  });
};
