var express = require('express');

var logger = require('../util/Logger');
var userService = require('../service/UserService');
var sessionPool = require('../model/SessionTokenPool');
var userDAO = require('../database/UserDAO');
var router = express.Router();

// 重定向到github登录页面，获得用户授权
router.get('/', function(req, res) {
    var token = sessionPool[req.session.id];
    var user;
    if(token){
        userService.getUserInfoWithRepos(token)
            .then(function(userVM){
                user = userVM;
                return userDAO.getUserInfo(userVM.name);
            })
            .then(function(userInfo){
                user.id = userInfo.id;
                user.star_money = userInfo.star_money;
                user.pushed_repos = userInfo.pushed_repos;
                res.send(user);
            })
            .error(function(error){
                res.sendStatus(500);
            });
    }else{
        res.render('login',{message:'Please login first'});
    }
});


module.exports = router;