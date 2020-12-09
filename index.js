// Build the backend services for the Vidly application (an imaginary service for renting videos).
// Functionality includes an endpoint for all genres, and all CRUD operations
// Create database using mongoose
// Validate user input using Joi

const express =     require('express');
const winston =     require('winston');
const app =         express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();

// throw new Error('startup failure?!?!');

// Take environmental variable for port or a default
    // Have the web server listen on that port
    const port = process.env.port || 3000
    app.listen(port, () => winston.info(`Listening on port ${port}`));