const {generateReport} = require("./index");
generateReport("teste",process.cwd() + "\\test\\HelloWorld.jrxml",process.cwd() + "\\test\\",process.cwd() + "\\test\\test.json",{exportType:"html"})
.then((test)=>{
    console.log(test)
})
.catch((error)=>{
    console.log(error);
})