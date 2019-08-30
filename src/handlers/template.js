const path = require("path");
const fs = require("fs");

const CONSTANTS = require("../constants");

const promisify = require('util').promisify;
const statPromise = promisify(fs.stat);
const mkdirPromise = promisify(fs.mkdir);
const readdirPromise = promisify(fs.readdir);

const TemplateHandler = {
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

    return walk(CONSTANTS.BASE_TEMPLATES_DIR, []);
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
    
    return await walk(templateName, CONSTANTS.BASE_TEMPLATES_DIR, false);    
  },

  lineHasKey(line, key) {
    return (line.indexOf('{{ #' + key + " }}") > -1);
  },

  async create(config, answers){
    try {
      let newTemplatePath = path.join(CONSTANTS.CREATE_TEMPLATES, config.template);
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
};

module.exports = TemplateHandler;