const path = require("path");
const promisify = require('util').promisify;
const fs = require("fs");
const statPromise = promisify(fs.stat);
const inquirer = require("inquirer");

const ConfigHandler = {
  validatePath(path){
    return statPromise(path)
    .then(stat => true)
    .catch(error => false);
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
  }
}
module.exports = ConfigHandler;