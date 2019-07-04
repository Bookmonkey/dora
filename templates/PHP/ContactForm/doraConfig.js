module.exports = {
  'template': 'SS_ContactForm',
  "questions": [
    {
      "name": "tableName",
      "message": "Table name:",
      "type": "input",
    },
    {
      "name": "fields",
      "message": "What fields do you want to add (to add multiple use comma to seperate)s",
      "type": "input",
      "afterAnswerHandler": "createArray",
    },
    
  ],
}