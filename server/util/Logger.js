var log4js = require('log4js');
log4js.configure({
    appenders: [
        {type: 'console'},
        {
            type: 'file',
            filename: 'server/log/gms.log',
            maxLogSize:20480,
            category:'gms'
        }
    ]
});
var logger = log4js.getLogger('gms');
logger.setLevel('ERROR');
module.exports = logger;