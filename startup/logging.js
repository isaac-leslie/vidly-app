const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    winston.handleExceptions(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
        new winston.transports.Console({ colorize: true, prettyPrint: true }));

    
    process.on('unhandledRejection', (ex) => {
        throw ex; // handleExceptions will catch this
    });
    
    winston.add(winston.transports.File, { filename: 'logfile.log' });
    winston.add
        (winston.transports.MongoDB, { 
            db: 'mongodb://localhost/vidly-app',
            level: 'info' 
        });
}
