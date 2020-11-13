const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie');


// Create a movie
router.post('/', async (req, res) => {
    //debug
    console.log('POST: ', req.body);
    
    // Validate
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        console.log(req.body);
        return;
    }

    //  KEY STEP: FIND THE GENRE FROM OTHER COLLECTION
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    try {
        // Create movie object, set parameters, add to database
        const movie = new Movie({ 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            rentalRate: req.body.rentalRate
        });

        // Return to client
        res.send(movie);
    }
    catch(err) {
        console.log(err.message);
    }
});

// Read and list all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
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

// UPDATE a specified movie
router.put('/:id', async (req, res) => {
    // Validate
    const {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //  KEY STEP: FIND THE GENRE FROM OTHER COLLECTION
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');
    
    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        rentalRate: req.body.rentalRate,
        new: true
    });

    // Search for requested movie
    if (!movie) {
        res.status(404).send('Requested movie does not exist');
        return;
    }

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) res.status(404).send('Requested movie does not exist');
        res.send(movie);
    }
    catch(err) {
        console.log(err.message);
    }
});

module.exports = router;