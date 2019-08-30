const path = require("path");

const CONSTANTS = {
  BASE_TEMPLATES_DIR: path.join(__dirname, "..", "templates"),
  CREATE_TEMPLATES: path.join(__dirname, "..", ".dora"),

  DORA_CONFIG: "doraConfig.js",

  INSTALL_NPM_PROMPT = {
    "name": "install", 
    "message": "This template has some 'required' npm modules, would you like to install them",
    "type": "confirm"
  },

  INSTALL_COMPOSER_PROMPT = {
    "name": "install", 
    "message": "This template has some 'required' composer modules, would you like to install them",
    "type": "confirm"
  }
}

module.exports = CONSTANTS;