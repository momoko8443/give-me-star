var mysql = require('mysql');
var logger = require('../util/Logger');
var pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'gms'
});

pool.on('connection',function(connection){
    if(connection){
        logger.debug('db connected successfully');
    }
});

module.exports = pool;