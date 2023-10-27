# node-json-jasper
A simple node library to generate Jasper Reports using JasperStarter with json files.

------------

### Required
NodeJS Version 16.x.x or greater
Java 8 installed

------------
### Usage
`npm install node-json-jasper`
```javascript
    const {generateReport} = require("node-json-jasper")

let report = generateReport(reportName ,jasperReport ,reportOutput, jsonPath, {exportType:"pdf",bufferRetrun:true})
```
### generateReport (options,{Optional Parameters})
| Options  | Information  |
| ------------ | ------------ |
|  reportName | (string) Name that will be saved the report on output folder  |
| jasperReport  | (string) The full path to the .jrxml or .jasper file  |
| reportOutput  | (string) The full path were the report will be generated  |
| jsonPath | (string) The full path to the json file that will be used to fill the report|

| Optional Parameters | Information |
|---------------------| ------------ |
| exportType          | (string) The type of the exported file ("pdf", "docx", "xlsx", "pptx", "rtf", "html", "xhtml", "xml")  |
| jsonQuery           | (string) The key that will be used on the json to filter on report |
| parameters          |(object) A Simple object with key-value to used as Parameter on the jasper report  |
| bufferReturn        | (bool) When true the file saved on output folder will be opened return the buffer of file and delete|

------------


## Thanks
Created based on [Lavela](https://github.com/lavela/phpjasper/ "Lavela") php solution
Thanks [Raphael](https://github.com/raphael-heilbuth "Raphael") for always helping with this things

------------



## Upcoming Features
Option to pass JSON Object to generate the report

------------


##Me
[Luiz Mello](https://github.com/loez/ "Luiz Mello")