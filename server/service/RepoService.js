var config = require('../configuration/Config');
var got = require('got');
var logger = require('../util/Logger');
var api = config.api;
var app = config.app;

module.exports = {
    getReposByUser: function (user, token, callback) {
        var url = api.repos.format(user);
        got.get(url, {
            headers: {
                'User-Agent': app.app_name,
                'Authorization': 'token ' + token
            },
            json: true
        })
            .then(function (result) {
                logger.debug('Get Repos by user', result.body);
                callback && callback(undefined, result.body);
            })
            .catch(function (error) {
                logger.error(error);
                callback && callback(error);
            });
    }
}