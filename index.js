// Build the backend services for the Vidly application (an imaginary service for renting videos).
// Functionality includes an endpoint for all genres, and all CRUD operations
// Create database using mongoose
// Validate user input using Joi

const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose =    require('mongoose');
const express =     require('express');
const auth =        require('./routes/auth');
const genres =      require('./routes/genres')
const customers =   require('./routes/customers');
const movies =      require('./routes/movies');
const rentals =     require('./routes/rentals');
const users =       require('./routes/users');
const app =         express();

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey not found')
    process.exit(1);
}

// Connect to database
mongoose.connect('mongodb://localhost/vidly-app')
.then(() => console.log('Connected to MongoDB...'))
.catch((err)=> console.log('Could not connect to MongoDB...', err.message));

// Enable parsing of JSON
app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Take environmental variable for port or a default
// Have the web server listen on that port
const port = process.env.port || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));