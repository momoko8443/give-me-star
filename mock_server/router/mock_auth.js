var request = require('request');
var express = require('express');
var querystring = require('querystring');
var crypto = require('crypto');
var router = express.Router();


router.get('/oauth/authorize',function(req,res){
    var url= req.url;
    var qs = url.split('?')[1];
    var params = querystring.parse(qs);
    var state = params.state;
    var redirect_uri = params.redirect_uri;
    var code = crypto.randomBytes(16).toString('hex');

    var return_url = redirect_uri+'?'+querystring.stringify({code:code,state:state});
    console.log('/oauth/authorize has been accessed',url);
    // request(return_url,function (error, response, body){
    //     if(error){
    //         console.error(error);
    //     }
    // });
    res.redirect(return_url);
});

router.post('/oauth/access_token',function(req,res){
    // var client_id = req.body.client_id;
    // var client_secret = req.body.client_secret;
    // var code = req.body.code;
    // var redirect_uri = req.body.redirect_uri;
    // var state = req.body.state;

    var access_token = crypto.randomBytes(40).toString('hex');
    console.log('/oauth/access_token has been accessed',req.url);
    res.send({"access_token":access_token,"token_type":"bearer"});
});

module.exports = router;

