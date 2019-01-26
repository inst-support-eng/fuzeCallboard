const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// uses fuzeRoutes
require("./routes/fuzeRoutes")(app);

// catchall handler for any request that doesnt match the above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// listen for dev / prod port
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`application is listening on port : ${port}`);
