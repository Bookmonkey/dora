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
    const walk = async (dir, directoryList = "") => {
      const files = await readdirPromise(dir);

      for (file of files) {
        const filepath = path.join(dir, file);
        const stat = await statPromise(filepath);
        
        if (stat.isDirectory()) {

          directoryList.push(filepath);
          directoryList = await walk(filepath, directoryList);
        }
      }
      return directoryList;
    }

    return walk(this.BASE_TEMPLATES_DIR, []);
  },
  // just to get the process 
  async getByName(templateName) {
    const walk = async (templateName, dir, foundDirectory = "") => {
      const files = await readdirPromise(dir);

      for (file of files) {
        const filepath = path.join(dir, file);
        const stat = await statPromise(filepath);
        
        if (stat.isDirectory()) {
          if(file === templateName){
            foundDirectory = filepath;
          }
          else {
            foundDirectory = await walk(templateName, filepath, foundDirectory);
          }
        }
      }
          
      return foundDirectory;
    }
    
    return await walk(templateName, this.BASE_TEMPLATES_DIR, false);    
  },

  lineHasKey(line, key) {
    return (line.indexOf('{{ #' + key + " }}") > -1);
  },

  async create(config, answers){
    try {
      let newTemplatePath = path.join(this.CREATE_TEMPLATES, config.template);
      let doraTemplatePath = config.filePath;
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

    } catch (error) {
      console.error(error);
    }
  }
}


let Config = {
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

program
  .command("explore")
  .alias("e")
  .alias("l")
  .description("List all templates")
  .action(async (cmd, args) => {
    let list = await Template.list();

    list.map(ele => {
      console.log(ele);
    });
  });

program
  .command("fetch <template>")
  .alias("f")
  .description("Fetch the template")
  .action(async (template, args) => {
    let filePath = await Template.getByName(template);

    let configPath = path.join(filePath, "doraConfig.js");

    const validPath = await Config.validatePath(configPath);    
    if(validPath){
      const config = require(configPath);
      console.log(`Creating a new Template using ${config.template}, language ${config.language}`)

      let result = await Config.handle(config);
      config.filePath = filePath;

      console.log("Creating new template");
      Template.create(config, result);

      console.log("Created new template :)");
    }
    else {
      console.error("Full file path:", configPath);
      throw "There is a problem with the template, either doesnt exist or there is no doraConfig.js file";
    }
  });

program.parse(process.argv);
