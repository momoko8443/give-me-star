var express = require('express');

var logger = require('../util/Logger');
var userService = require('../service/UserService');
var sessionPool = require('../model/SessionTokenPool');

var router = express.Router();

// 重定向到github登录页面，获得用户授权
router.get('/', function(req, res) {
    var token = sessionPool[req.session.id];
    if(token){
        userService.getUserInfoWithRepos(token,function(err,userVM){
            if(err){
                res.sendStatus(500);
            }else{
                res.send(userVM);
            }
        });
    }else{
        res.render('login',{message:'Please login first'});
    }
});


module.exports = router;