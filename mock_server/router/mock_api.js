var fs = require('fs');
var express = require('express');
var router = express.Router();

var mock_map = JSON.parse(fs.readFileSync('./mock_map.json'));
var path_map = convertMockMapPath2RegExp(mock_map);
module.exports = function(req, res, next){
    var url = req.url;
    var jsonPath = getJsonByPath(url,path_map);
    if(jsonPath){
        var result = JSON.parse(fs.readFileSync(jsonPath));
        res.send(result);
    }else{
        next();
    }
}

function convertMockMapPath2RegExp(map){
    var new_map = {};
    for(var key in map){
        var json = map[key];
        var newKey = key.replaceAll('\\/','\\\/');
        newKey = newKey.replaceAll('\\*','\\w*');
        newKey = '^'+newKey+'$';
        new_map[newKey] = json;
    }
    return new_map;
}

function getJsonByPath(path,map){
    for(var key in map){
        var re = new RegExp(key);
        if(path.search(re) !== -1){
            return map[key];
        }
    }
    return undefined;
}    