const path = require("path");
const promisify = require('util').promisify;
const fs = require("fs");
const statPromise = promisify(fs.stat);
const inquirer = require("inquirer");

const CONSTANTS = require("../constants");

const ConfigHandler = {
  REQUIRED_KEYS: ["template", "language", "questions"],

  async validate(path){

    // validates there is a doraConfig.js file. if not bail out
    let pathExisits = await statPromise(path);
    if(!pathExisits) throw new Error(`The DoraConfig couldnt be found`);


    // compare config with required keys
    let config = require(path);
    let keys = Object.keys(config);
    let hasMissingKey = false;
    let missingKeys = [];

    this.REQUIRED_KEYS.map(ele => {
      if(keys.indexOf(ele) === -1) {
        hasMissingKey = true;
        missingKeys.push(ele);
      }
    });

    if(hasMissingKey) {
      throw new Error(`The DoraConfig file is missing the following key: ${missingKeys}`);
    }

    return true;
  },

  handle(config) {
    return inquirer
      .prompt(config.questions)
      .then(answers => {
        anwsers = this.handleAfterAnswers(config, answers);
        return answers;
      });
  },

  // returns the new formatted answers object
  handleAfterAnswers(config, answers) {
    config.questions.map(ele => {
      let answerHandler = ele.afterAnswerHandler
      if(answerHandler){
        if(answerHandler === 'createArray'){

          if(config.language === "PHP"){ 
            let arrayElements = answers[ele.name].trim().split(',');
            let arrayFormat = `[
                ${
                  arrayElements.map(element => {
                    let split = element.split(":");
                    return `"${split[0].trim()}" => "${split[1].trim()}"`
                  })
                }
              ]
            `;

            arrayFormat = arrayFormat.replace(',', ", \n");

            answers[ele.name] = arrayFormat;
          }
        }
      }
    });

    return answers;
  },

  handleRequirements(config) {
    if(config.requirements){
      if(config.requirements.npm){
        await inquirer.prompt([CONSTANTS.INSTALL_NPM_PROMPT])
        .then(answer => {
          console.log(answer);
          if(answer.install){
            console.log("Installing NPM modules");
          } else {
            console.log("NPM modules not installed!")
          }
        });
      }
      if(config.requirements.composer){
        await inquirer.prompt([CONSTANTS.INSTALL_COMPOSER_PROMPT])
        .then(answer => {
          console.log(answer);
          if(answer.install){
            console.log("Installing Composer modules");
          } else {
            console.log("Composer modules not installed!")
          }
      }
    }
  }
}
module.exports = ConfigHandler;