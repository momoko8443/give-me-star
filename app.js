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

app.use(function (req, res, next) {
    if (sessionPool[req.session.id]) {
        if (req.url === '/' || req.url.search('/index2.html') !== -1) {
            if (req.url.search('signin=successful') !== -1) {
                next();
            } else {
                res.redirect('/index2.html?signin=successful');
            }
        } else {
            next();
        }
    } else {
        if (req.url.search('/authorization') !== -1) {
            next();
        } else {
            res.redirect('/index2.html');
        }
    }
});

app.use('/authorization', authorizationRouter);
app.use('/user', userRouter);

app.listen(server.port, function () {
    console.log('give me star is running on port %d', server.port);
});