// Build the backend services for the Vidly application (an imaginary service for renting videos).
// Functionality includes an endpoint for all genres, and all CRUD operations
// Create database using mongoose
// Validate user input using Joi

const express = require('express');
const app = express();
const genres = require('./routes/genres')
const customers = require('./routes/customers');
const mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/vidly-app')
.then(() => console.log('Connected to MongoDB...'))
.catch((err)=> console.log('Could not connect to MongoDB...', err.message));

// Enable parsing of JSON
app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers)

// Take environmental variable for port or a default
// Have the web server listen on that port
const port = process.env.port || 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

