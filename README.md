# Dora 
A command line tool which allows you to create reusable components/templates for projects.

### Built using:
- NodeJS
- CommanderJS

### Commands:
- dora fetch [template] 
- `dora explore` - logs out all the directories within the templates directory.


### DoraConfig example
``` json
  {
    "template": "...",
    "language": "...", 
    "requirements": [
      "npm" [...],
      "composer": [...]
    ],

    "questions": [
      { 
        "name": '...',
        "message": '...',
        "afterAnswerHandler": "..." // todo allow for either string or array of options
      }
    ]

  }
```