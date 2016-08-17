var config = require('./server/configuration/Config');
var express = require('express');
var session = require('express-session');
var path = require('path');
var hack = require('./server/util/Hack');
var authorizationRouter = require('./server/router/AuthorizationRouter');
var userRouter = require('./server/router/UserRouter');
var sessionPool = require('./server/model/SessionTokenPool');
var app = express();

var server = config.server;
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'give me star',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs'); 
app.get('/',function(req,res){
    if (sessionPool[req.session.id]){
        //已登录
        res.render('home');
    }else{
        //未登录
        res.render('login',{message:''});
    }
});
app.use('/authorization', authorizationRouter);
app.use('/user', userRouter);

app.listen(server.port, function () {
    console.log('give me star is running on port %d', server.port);
});