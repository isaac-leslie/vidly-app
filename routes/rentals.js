const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

// Create a rental
router.post('/', async (req, res) => {
    // Validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    console.log('Joi success')

    //  Link to movie from other collection
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');
    console.log('Movie found: ', movie);

    //  Link to customer from other collection
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');
    console.log('Customer found: ', customer);

    // Create rental object, set parameters
    let rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            genre: movie.genre,
            numberInStock: movie.numberInStock
        }
    });

    try {
        // a pseudo transaction. create new document of rental, decrement stock of movie
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
        .run();

        // Return to client
        res.send(rental);
    }
    catch(err) {
        res.status(500).send('Something failed');
    }
    
});

// Read and list all rentals
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find();
        res.send(rentals);
    }
    catch(err) {
        console.log(err.message);
    }
});

// Read a single specified movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie
        .findById(req.params.id);
        res.send(movie);
    }
    catch(err) {
        console.log(err.message);
    }
});

module.exports = router;