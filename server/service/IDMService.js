var config = require('../configuration/Config');
var request = require('request');
var logger = require('../util/Logger');
var Promise = require('bluebird');
var oauth = config.oauth;

function IDMService(){
    this.getAccessToken = function(opt){
        return new Promise(function(resolve,reject){
            request.post({url:oauth.access_token_url,formData:opt,json:true},
            function(error,response,body){
                if(error){
                    logger.error(error);
                    reject(error);
                }
                else{
                    resolve(body.access_token);
                }
            });
        });
        
    };
}
var idmService = new IDMService();
module.exports = idmService;