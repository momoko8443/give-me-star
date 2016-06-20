
var fs = require('fs');
var conf_string;
if(process.env.NODE_ENV === "dev_mock"){
    conf_string = fs.readFileSync('conf/app_mock.json');
}else{
    conf_string = fs.readFileSync('conf/app.json');
}
var config;
try{
     config = JSON.parse(conf_string);
}catch(err){
    throw err;
}
module.exports = config;