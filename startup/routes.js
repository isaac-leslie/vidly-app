const express = require('express');
const error = require('../middleware/error');
const auth =        require('../routes/auth');
const genres =      require('../routes/genres')
const customers =   require('../routes/customers');
const movies =      require('../routes/movies');
const rentals =     require('../routes/rentals');
const users =       require('../routes/users');

module.exports = function(app) {
app.use(express.json()); // enable json parsing
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);
}