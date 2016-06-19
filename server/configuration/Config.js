
var fs = require('fs');
var conf_string = fs.readFileSync('conf/app.json');
var config;
try{
     config = JSON.parse(conf_string);
}catch(err){
    throw err;
}
module.exports = config;