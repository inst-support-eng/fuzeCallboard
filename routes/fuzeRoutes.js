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
  app.get("/api/adminQueue", async (req, res) => {
    let url =
      "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/$QUEUE/status";
    const response = await axios.get(url.replace("$QUEUE", ADMIN_QUEUE), {
      headers: {
        username: USERNAME,
        password: PASSWORD
      }
    });

    await res.send(response.data);
  });

  app.get("/api/StudentQueue", async (req, res) => {
    let url =
      "https://synapse.thinkingphones.com/tpn-webapi-broker/services/queues/$QUEUE/status";
    const response = await axios.get(url.replace("$QUEUE", STUDENT_QUEUE), {
      headers: { username: USERNAME, password: PASSWORD }
    });

    await res.send(response.data);
  });

  app.get("/api/getAgents", async (req, res) => {
    const response = await axios.get("https://rest.data.fuze.com/agentEvents", {
      headers: {
        Accept: "application/json",
        Authorization: API_TOKEN
      },
      params: {
        limit: 1000
      }
    });
    await res.send(response.data);
  });
};
