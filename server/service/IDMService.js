var config = require('../configuration/Config');
var got = require('got');
var logger = require('../util/Logger');
const tunnel = require('tunnel');
var oauth = config.oauth;

module.exports = {
    getAccessToken:function(opt,callback){
        got.post(oauth.access_token_url,{
                                            body:opt,
                                            json:true
                                        })
            .then(function(result){
                callback && callback(undefined,result.body.access_token);
            })
            .catch(function(error){
                logger.error(error);
                callback && callback(error);
            });
    }
}