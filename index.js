const fs = require("fs").promises;
const {spawn} = require("child_process");
const path = require('path')
const {constants} = require("fs");
const exportTypes = ["pdf", "docx", "xlsx", "pptx", "rtf", "html", "xhtml", "xml"];
const generateReport = (reportName, jasperReport, reportOutput, jsonPath, {exportType = "pdf", jsonQuery = "", parameters = {}, bufferReturn = false} = {}) => new Promise((success, reject) => {
    Promise.all([validateData(reportName, exportType), checkPath(jasperReport), checkPath(reportOutput,constants.F_OK | constants.W_OK), checkPath(jsonPath)])
        .then(() => {
            let errorMessages = "";
            const generate = spawn(path.resolve(__dirname, './jasperstarter/bin/jasperstarter'), generateCommand(reportName, jasperReport, reportOutput, jsonPath, exportType, jsonQuery, parameters));

            generate.stderr.on('data', (dataError) => {
                errorMessages += dataError + "\r\n";
            })

            generate.on('exit', (code) => {
                if (code === 0) {
                    if (!bufferReturn) {
                        return success({
                            reportPath: reportOutput + reportName + "." + exportType
                        });
                    }
                    fs.readFile(reportOutput + reportName + "." + exportType)
                        .then((fileBuffer) => {
                            fs.unlink(reportOutput + reportName + "." + exportType)
                                .then(() => {
                                    return success(fileBuffer);
                                }).catch(() => {
                                return reject(Error("Error on unlink output file"));
                            })
                        })
                } else {
                    return reject(Error(errorMessages));
                }
            })
        })
        .catch((errorPaths) => {
            reject(errorPaths);
        })
});

const checkPath = (pathFile, permissions = constants.F_OK) => new Promise((success, reject) => {
    fs.access(pathFile, permissions)
        .then(() => {
            return success(true);
        })
        .catch(() => {
            return reject(Error(pathFile));
        })
});

function generateCommand(reportName, jasperReport, reportOutput, jsonPath, exportType, jsonQuery , parameters ) {
    let command = ["--locale", "pt_BR", "process",
        jasperReport,
        "-o", (reportOutput + reportName),
        "-f", exportType,
        "-t", "json",
        "--data-file", jsonPath
    ]

    if (jsonQuery) {
        command.push("--json-query");
        command.push(jsonQuery);
    }

    if (Object.keys(parameters).length) {
        command.push("-P");
        Object.keys(parameters).forEach((parameterKey) => {
            command.push(`${parameterKey}=${parameters[parameterKey]}`);
        })
    }
    return command;
}

const validateData = (reportName, exportType) => new Promise((success, reject) => {
    if (!reportName) {
        return reject(Error("Report name is necessary and can`t be a empty string."));
    }

    if (!exportTypes.includes(exportType.toLowerCase())) {
        return reject(Error(`Export Type don't mismatch a valid option.("${exportType}")`));
    }
    return success(true);
})

function isLiteralObject(obj){
    return ((!!obj) && (obj.constructor === Object ))
}

module.exports = {generateReport}