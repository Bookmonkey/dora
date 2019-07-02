#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const process = require("process");

const program = require("commander");

const directoryPath = path.join(__dirname, "..", "templates");

let currentWorkingDirectory = [];

function readFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) process.exit(err);

    files.map(file => {
      const filePath = path.join(directory, file);

      fs.lstat(filePath, (err, stats) => {
        if (err) process.exit(err);

        if (stats.isDirectory()) {
          console.log(filePath);
          readFilesInDirectory(filePath);
        }
      });
    });

    return files;
  });
}

// List all files in a directory in Node.js recursively in a synchronous fashion
var findTemplate = function(directoryPath, lookingForTemplate, found) {
  currentWorkingDirectory = fs.readdirSync(directoryPath);
  filePath = "";
  found = found;

  if (!found) {
    currentWorkingDirectory.forEach(function(file) {
      filePath = path.join(directoryPath, file);
      if (lookingForTemplate === file && !found) {
        found = true;
      }

      if (fs.statSync(filePath).isDirectory() && !found) {
        filePath = findTemplate(filePath, lookingForTemplate, found);
      } else {
        filePath = filePath;
      }
    });
  }
  return filePath;
};

program
  .command("list")
  .alias("l")
  .description("List all templates")
  .action((cmd, args) => {
    let files = [];
    readFilesInDirectory(directoryPath, files);
  });

program
  .command("fetch <template>")
  .alias("f")
  .description("Fetch the template")
  .action((template, args) => {
    let filePath = findTemplate(directoryPath, template, false);
    console.log(filePath);
  });

program.parse(process.argv);
