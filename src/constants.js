const path = require("path");

const CONSTANTS = {
  BASE_TEMPLATES_DIR: path.join(__dirname, "..", "templates"),
  CREATE_TEMPLATES: path.join(__dirname, "..", ".dora"),
  DORA_CONFIG: "doraConfig.js"
}

module.exports = CONSTANTS;