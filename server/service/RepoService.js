var config = require('../configuration/Config');
var request = require('request');
var logger = require('../util/Logger');
var api = config.api;
var app = config.app;

module.exports = {
    getReposByUser:function(user,token,callback){
        var url = api.repos.format(user);
        request({
                    url:url,
                    json:true,
                    headers:{'User-Agent':app.app_name,Authorization:'token ' + token}
            },function(error,response,body){
                if(error){
                    logger.error(error);
                    callback && callback(error);
                }else{
                    logger.debug('Get Repos by user', body);
                    callback && callback(undefined, body);
                }    
            }
        );
    }
}