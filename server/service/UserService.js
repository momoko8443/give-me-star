var userGithubService = require('./github/UserService');
var userDAO = require('../database/UserDAO');
var Promise = require('bluebird');
function UserService(){
    this.getUser = function(token){
        return new Promise(function(resolve, reject){
            userGithubService.getUserInfoWithRepos(token)
                .then(function(userVM){
                    user = userVM;
                    return userDAO.getUserInfo(userVM);
                })
                .then(function(userInfo){
                    user.id = userInfo.id;
                    user.star_money = userInfo.star_money;
                    resolve(user);
                })
                .error(function(error){
                    reject(error);
                });
        });
    }
}
var userService = new UserService();
module.exports = userService;

