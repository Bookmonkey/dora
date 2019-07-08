#!/usr/bin/env node

const path = require("path");
const promisify = require('util').promisify;
const fs = require("fs");
const process = require("process");


// should just use a promise lib like bluebird 
const statPromise = promisify(fs.stat);
const mkdirPromise = promisify(fs.mkdir);
const readdirPromise = promisify(fs.readdir);
const copyPromise = promisify(fs.copyFile);
const readFilePromise = promisify(fs.readFile);

const program = require("commander");
const inquirer = require("inquirer");

let Template = {
  BASE_TEMPLATES_DIR: path.join(__dirname, "..", "templates"),
  CREATE_TEMPLATES: path.join(__dirname, "..", ".dora"),
  list() {
    console.log(this.BASE_TEMPLATES_DIR);
    return [];
  },
  // just to get the process 
  getByName(templateName) {
    // need to scan templates directory
    return templateName;
  },

  lineHasKey(line, key) {
    return (line.indexOf('{{ #' + key + " }}") > -1);
  },

  async create(config, answers){
    try {
      let newTemplatePath = path.join(this.CREATE_TEMPLATES, config.template);
      let doraTemplatePath = path.join(__dirname, config.filePath);

      console.log(answers);
      await mkdirPromise(newTemplatePath);

      readdirPromise(doraTemplatePath)
      .then(files => {
        files.map(async file => {
          if(file === 'doraConfig.js') return;

          const writeStream = fs.createWriteStream(path.join(newTemplatePath, file), {
            encoding: "utf8"
          });


          let reader = require('readline').createInterface({
            input: fs.createReadStream(path.join(doraTemplatePath, file))
          });

          reader.on('line', line => {
            if(line.indexOf("{{#") > -1 || line.indexOf("{{ #") > -1) {
              Object.keys(answers).map(ele => {
                if(this.lineHasKey(line, ele)) {
                  let templateRegex = new RegExp("{{ #" + ele + " }}", 'g');
                  line = line.replace(templateRegex, answers[ele]);
                }
              });
            }
            writeStream.write(line + "\n");
          });
          
        });
      })
      .catch(error => {
        console.error(error)
      });
      // await copyFiles();

    } catch (error) {
      console.error(error);
    }

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

      result.config.filePath = filePath;

      console.log("Creating new template");
      Template.create(result.config, result.answers);
    }
    else {
      console.error("Full file path:", configPath);
      throw "There is a problem with the template, either doesnt exist or there is no doraConfig.js file";
    }
  });

program.parse(process.argv);
