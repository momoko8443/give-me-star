var config = require('../configuration/Config');
var request = require('request');
var logger = require('../util/Logger');

var oauth = config.oauth;

module.exports = {
    getAccessToken:function(opt,callback){
        request.post({url:oauth.access_token_url,formData:opt,json:true},
        function(error,response,body){
            if(error){
                logger.error(error);
                callback && callback(error);
            }
            else{
                callback && callback(undefined,body.access_token);
            }
        });
    }
}