#!/usr/bin/env node

const path = require("path");
const process = require("process");
const program = require("commander");

const Config = require("./handlers/config");
const Template = require("./handlers/template");

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
