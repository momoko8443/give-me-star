var express = require('express');
var bodyParser = require('body-parser');
var authRouter = require('./router/mock_auth');
var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/login',authRouter);

app.listen(8089, function () {
  console.log('github mock server is running on port %d', 8089);
});