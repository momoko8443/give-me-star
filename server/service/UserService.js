var config = require('../configuration/Config');
var request = require('request');
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
                            var repo = repos[i];
                            if (repo.fork === false && repo.private === false) {
                                var repoVM = new RepoVM();
                                repoVM.name = repo.name;
                                repoVM.description = repo.description;
                                repoVM.stargazers_count = repo.stargazers_count;
                                repoVM.watchers = repo.watchers;
                                repoVM.forks = repo.forks;
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
        request({
            url: api.user,
            json: true,
            headers: { 'User-Agent': app.app_name, Authorization: 'token ' + token }
        }, function (error, response, body) {
            if (error) {
                logger.error(error);
                callback && callback(error);
            } else {
                logger.debug('Get user info', body);
                callback && callback(undefined, body);
            }
        }
        );
    }
}