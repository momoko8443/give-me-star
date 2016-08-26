var config = require('../../configuration/Config');
var request = require('request');
var logger = require('../../util/Logger');
var repoService = require('./RepoService');
var UserVM = require('../../view_model/UserVM');
var RepoVM = require('../../view_model/RepoVM');
var userDAO = require('../../database/UserDAO');
var Promise = require('bluebird');
var api = config.api;
var app = config.app;

function UserService(){

    var self = this;
    this.getUserInfoWithRepos = function (token) {
        return new Promise(function(resolve,reject){
            var userVM;
            self.getUserInfo(token)
            .then(function(user){
                return user;
            })
            .then(function(user){
                userVM = buildUserVM(user);
                return repoService.getReposByUser(user.name, token)
                    
            })
            .then(function(repos){
                for (var i = 0; i < repos.length; i++) {
                    var repo = repos[i];
                    if (repo.fork === false && repo.private === false) {
                        var repoVM = buildRepoVM(repo);
                        userVM.repos.push(repoVM);
                    }
                }
                resolve(userVM);
            })
            .error(function(err){
                reject(err);
            });
        });
    };

    this.getUserInfo = function(token) {
        return new Promise(function(resolve,reject){
            request({
                url: api.user,
                json: true,
                headers: { 'User-Agent': app.app_name, Authorization: 'token ' + token }
            }, function (error, response, body) {
                if (error) {
                    logger.error(error);
                    reject(error);
                } else {
                    logger.debug('Get user info', body);
                    resolve(body);
                }
            });
        });
    };

    function buildUserVM(user){
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
        return userVM;
    }

    function buildRepoVM(repo){
        var repoVM = new RepoVM();
        repoVM.name = repo.name;
        repoVM.description = repo.description;
        repoVM.stargazers_count = repo.stargazers_count;
        repoVM.watchers = repo.watchers;
        repoVM.forks = repo.forks;
        return repoVM;
    }
}
var userService = new UserService();
module.exports = userService;