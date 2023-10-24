const fs = require("fs").promises;
const {spawn} = require("child_process");
const path = require('path')
const exportTypes = ["pdf", "docx", "xlsx", "pptx","rtf","html","xhtml","xml"];
const generateReport = ({reportName,jasperReport, reportOutput, jsonPath},{exportType = "pdf",jsonQuery = "", parameters = {}, bufferReturn = false} = {}) => new Promise((success, reject) => {
    Promise.all([checkPath(jasperReport), checkPath(reportOutput,fs.constants.F_OK | fs.constants.W_OK), checkPath(jsonPath)])
        .then(() => {
            let errorMessages = "";
            const generate = spawn(path.resolve('./jasperstarter/bin/jasperstarter'), generateCommand(reportName,jasperReport, reportOutput, jsonPath, exportType, jsonQuery = "", parameters = {}));

            generate.stderr.on('data', (dataError) => {
                errorMessages += dataError + "\r\n";
            })

            generate.on('exit', (code) => {
                if (code === 0) {
                    if (!bufferReturn) {
                        return success({
                            //todo
                            reportPath: reportOutput + reportName + "." + exportType
                        })
                    }
                    fs.readFile(reportOutput)
                        .then((fileBuffer) => {
                            fs.unlink(reportOutput)
                                .then(() => {
                                    return success(fileBuffer);
                                }).catch(() => {
                                return reject("Error on unlink output file");
                            })
                        })
                } else {
                    return reject(errorMessages);
                }
            })
        })
        .catch((errorPaths) => {
            reject(errorPaths)
        })
});

const checkPath = (pathFile,permission = fs.constants.F_OK) => new Promise((success, reject) => {
    fs.access(pathFile, permission)
        .then(() => {
            return success(true);
        })
        .catch(() => {
            return reject(pathFile);
        })
});

function generateCommand(reportName,jasperReport, reportOutput, jsonPath, exportType, jsonQuery = "", parameters = {}){
    let command = ["--locale","pt_BR",
        jasperReport,
        "-o",(reportOutput + reportName),
        "-f",exportType,
        "-t","json",
        "--data-file",jsonPath,
    ]

    if(jsonQuery){
        command.push("--json-query");
        command.push(jsonQuery);
    }

    if(Object.keys(parameters).length){
        command.push("-P")
        Object.keys(parameters).forEach((parameterKey)=>{
            command.push(`${parameterKey}=${parameters[parameterKey]}`);
        })
    }
    return command;
}

module.exports = {generateReport}