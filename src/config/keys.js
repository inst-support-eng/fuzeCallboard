if (process.env.NODE_ENV === "production") {
  module.exports = require("./keys_prod");
} else {
  try {
    module.exports = require("./keys_dev");
  } catch (e) {
    console.log(e);
  }
}
