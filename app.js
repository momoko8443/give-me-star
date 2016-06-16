var express = require('express');
var request = require('request');
var querystring = require('querystring');
var crypto = require('crypto');


var app = express();
//move to other module
var client_id = 'd7555f0b2d932fd46695';
var client_secret = 'b8bd615a953cbd2122a261e72688696dfa4b3ad2';
var redirect_uri = 'http://gms.ittun.com/oauth';
var scope = 'user public_repo';
var state = generateState();
var allow_signup = true;
var code = undefined;
var app_name = 'give-me-star';


function generateState(){
    const secret = 'give-me-star';
    const hash = crypto.createHmac('sha256', secret)
                    .update('I love ukulele')
                    .digest('hex');
    return hash;
}
//
var github_authorization_url = 'https://github.com/login/oauth/authorize';
var github_access_token_url = 'https://github.com/login/oauth/access_token';
var github_api_get_user = "https://api.github.com/user";

app.get('/',function(req,res){
    var opt = {
        client_id:client_id,
        redirect_uri:redirect_uri,
        scope:scope,
        state:state,
        allow_signup:allow_signup
    };
    var url = github_authorization_url+'?'+querystring.stringify(opt);
    res.redirect(url);
});
var access_token = undefined;
app.get('/oauth',function(req,res){
    code = req.query.code;
    var returnState = req.query.state;
    if(code && state === returnState){
        var opt = {
            client_id:client_id,
            client_secret:client_secret,
            redirect_uri:redirect_uri,
            code:code,
            state:state
        };
        request.post({url:github_access_token_url,form:opt,json:true},function(error,response,body){
            if(error){
                console.error(error);
                return;
            }
            access_token = body.access_token;
            console.log(body);
            res.redirect('/user');
        });
    }else{
        res.sendStatus(500);
    }
});

app.get('/user',function(req,res){
    if(access_token){
        request({url:github_api_get_user,json:true,headers:{'User-Agent':app_name,Authorization:'token '+access_token}},function(error,response,body){
            console.log(body);
        });
    }
});

app.listen(8080,function(){
    console.log('give me star is running on port 8080');
    //console.log(querystring.stringify(opt));
});