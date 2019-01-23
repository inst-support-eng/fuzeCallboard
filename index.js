const express = require("express");
const keys = require("./config/keys");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// uses fuzeRoutes
require("./routes/fuzeRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
