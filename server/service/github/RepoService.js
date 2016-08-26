var config = require('../../configuration/Config');
var request = require('request');
var logger = require('../../util/Logger');
var Promise = require('bluebird');
var api = config.api;
var app = config.app;

function RepoService() {
    this.getReposByUser = function(user,token){
        return new Promise(function(resolve,reject){
            var url = api.repos.format(user);
            request({
                url: url,
                json: true,
                headers: { 'User-Agent': app.app_name, Authorization: 'token ' + token }
            }, function (error, response, body) {
                if (error) {
                    logger.error(error);
                    reject(error);
                } else {
                    logger.debug('Get Repos by user', body);
                    resolve(body);
                }
            });
        });
    };
}
var repoService = new RepoService();
module.exports = repoService;