var config = require('../configuration/Config');
var request = require('request');
var logger = require('../util/Logger');
var repoService = require('./RepoService');
var UserVM = require('../view_model/UserVM');
var RepoVM = require('../view_model/RepoVM');

var api = config.api;
var app = config.app;
module.exports = {
    getUserInfoWithRepos:function(token,callback){
        this.getUserInfo(token,function(err,user){
            if(err){
                callback || callback(err);
            }else{
                var userVM = new UserVM();
                userVM.name = user.name;
                userVM.avatar_url = user.avatar_url;
                userVM.repos = [];
                repoService.getReposByUser(user.name,token,function(err,repos){
                    if(err){
                        callback && callback(err);
                    }else{
                        for(var i=0;i<repos.length;i++){
                            var repoVM = new RepoVM();
                            repoVM.name = repos[i].name;
                            repoVM.starts = repos[i].stargazers_count;
                            userVM.repos.push(repoVM);
                        }
                        callback && callback(undefined,userVM);
                    }
                });
            }
        });
    },

    getUserInfo:function(token,callback){
        request({
                    url:api.user,
                    json:true,
                    headers:{'User-Agent':app.app_name,Authorization:'token ' + token}
            },function(error,response,body){
                if(error){
                    logger.error(error);
                    callback && callback(error);
                }else{
                    logger.debug('Get user info', body);
                    callback && callback(undefined, body);
                }    
            }
        );
    }
}