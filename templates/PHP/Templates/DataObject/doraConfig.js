module.exports = {
  'template': 'SS_DataObject',
  'language': 'PHP',
  "questions": [
    {
      "name": "namespace",
      "message": "Namespace",
      "type": "input"
    },
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