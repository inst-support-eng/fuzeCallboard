const express = require("express");
const path = require("path");
const generatePassword = require("password-generator");

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/passwords", (req, res) => {
  const count = 5;

  const passwords = Array.from(Array(count).keys()).map(el =>
    generatePassword(12, false)
  );

  res.json(passwords);

  console.log(`sent ${count} passwords`);
});

// catchall handler for any request that doesnt match the above

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`application is listening on port : ${port}`);
