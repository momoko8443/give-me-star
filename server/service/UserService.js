var config = require('../configuration/Config');
var got = require('got');
var logger = require('../util/Logger');
var repoService = require('./RepoService');
var UserVM = require('../view_model/UserVM');
var RepoVM = require('../view_model/RepoVM');

var api = config.api;
var app = config.app;
module.exports = {
    getUserInfoWithRepos: function (token, callback) {
        this.getUserInfo(token, function (err, user) {
            if (err) {
                callback || callback(err);
            } else {
                var userVM = new UserVM();
                userVM.name = user.name;
                userVM.avatar_url = user.avatar_url;
                userVM.company = user.company;
                userVM.blog = user.blog;
                userVM.location = user.location;
                userVM.email = user.email;
                userVM.created_at = user.created_at;
                userVM.updated_at = user.updated_at;
                userVM.repos = [];
                repoService.getReposByUser(user.name, token, function (err, repos) {
                    if (err) {
                        callback && callback(err);
                    } else {
                        for (var i = 0; i < repos.length; i++) {
                            if (repos[i].fork === false) {
                                var repoVM = new RepoVM();
                                repoVM.name = repos[i].name;
                                repoVM.wawatchers = repos[i].wawatchers;
                                repoVM.forks = repos[i].forks;
                                repoVM.stars = repos[i].stargazers_count;
                                userVM.repos.push(repoVM);
                            }

                        }
                        callback && callback(undefined, userVM);
                    }
                });
            }
        });
    },

    getUserInfo: function (token, callback) {
        got.get(api.user,{headers: { 'User-Agent': app.app_name, 'Authorization': 'token ' + token },json: true})
        .then(function(result){
            logger.debug('Get user info', result.body);
            callback && callback(undefined, result.body);
        })
        .catch(function(error){
            logger.error(error);
            callback && callback(error);
        });
    }
}