const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
    // Connect to database
    mongoose.connect('mongodb://localhost/vidly-app')
    .then(() => winston.info('Connected to MongoDB'));

}
