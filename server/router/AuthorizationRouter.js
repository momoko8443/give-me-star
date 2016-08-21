var config = require('../configuration/Config');
var request = require('request');
var express = require('express');
var querystring = require('querystring');
var logger = require('../util/Logger');
var idmService = require('../service/IDMService');
var sessionPool = require('../model/SessionTokenPool');

var router = express.Router();
var app = config.app;
var oauth = config.oauth;

// 重定向到github登录页面，获得用户授权
router.get('/', function(req, res) {
    var opt = {
        client_id:app.client_id,
        redirect_uri:app.redirect_uri,
        scope:app.scope,
        state:req.session.id,
        allow_signup:app.allow_signup
    };
    var url = oauth.authorization_url+'?'+querystring.stringify(opt);
    logger.debug('Redirect to github to get code. URL='+ url);
    res.redirect(url);
});
// github会请求这个/authorization/oauth 路由带上code参数，凭此参数再次访问github接口可获得access_token,
// 获得access_token成功后则视为整个认证过程成功，之后就可以通过该token请求具体的业务api了。
router.get('/oauth', function(req, res) {
    code = req.query.code;
    var returnState = req.query.state;
    if(code && returnState){
        var opt = {
            client_id:app.client_id,
            client_secret:app.client_secret,
            redirect_uri:app.redirect_uri,
            code:code,
            state:returnState
        };
        idmService.getAccessToken(opt,function(err,token){
            if(err){
                res.render('login',{message:"Login Failed"});
            }else if(token){
                logger.debug('Authorizate successfully');
                logger.debug('Save Token with sesson id, session: ' + returnState + ' , token: ' + token);
                sessionPool[returnState] = token;
                res.render('main');
            }
        });
    }else{
        res.sendStatus(500);
    }
});

module.exports = router;