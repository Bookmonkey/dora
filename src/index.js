#!/usr/bin/env node

const path = require("path");
const promisify = require('util').promisify;
const fs = require("fs");
const process = require("process");


// should just use a promise lib like bluebird 
const statPromise = promisify(fs.stat);

const program = require("commander");
const inquirer = require("inquirer");

let Template = {
  BASE_DIRECTORY: path.join(__dirname, "..", "templates"),
  list() {
    console.log(this.BASE_DIRECTORY);
    return [];
  },
  // just to get the process 
  getByName(templateName) {
    // need to scan templates directory
    return templateName;
  },

  create(config, answers){
    // make new directory and copy template
    // write where {{#NAME}} (answer key)
    // if failure, stop and die
  }
}


let Config = {
  validatePath(path){
    return statPromise(path)
    .then(stat => true)
    .catch(error => false);
  },
  handle(path) {
    const config = require(path);
    return inquirer
      .prompt(config.questions)
      .then(answers => {
        anwsers = this.handleAfterAnswers(config, answers);
        return {
          config,
          answers
        }
      });
  },

  // returns the new formatted answers object
  handleAfterAnswers(config, answers){
    config.questions.map(ele => {
      let answerHandler = ele.afterAnswerHandler
      if(answerHandler){
        if(answerHandler === 'createArray'){
          answers[ele.name] = answers[ele.name].split(',');
        }
      }
    });

    return answers;
  }
}

program
  .command("list")
  .alias("l")
  .description("List all templates")
  .action((cmd, args) => {
    let list = Template.list();
  });

program
  .command("fetch <template>")
  .alias("f")
  .description("Fetch the template")
  .action(async (template, args) => {
    let filePath = Template.getByName(template);
    
    // temp for dev purpoces
    let configPath = path.join(__dirname, filePath, "doraConfig.js");

    const validPath = await Config.validatePath(configPath);

    if(validPath){
      let result = await Config.handle(configPath);

      console.log("Creating new template");
      Template.create(configPath, result.answers);
    }
    else {
      console.error("Full file path:", configPath);
      throw "There is a problem with the template, either doesnt exist or there is no doraConfig.js file";
    }
  });

program.parse(process.argv);
