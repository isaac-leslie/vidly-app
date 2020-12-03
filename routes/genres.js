// const asyncMiddleware = require('../middleware/async');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');



// Read and list all genres
router.get('/', async (req, res) => {
    throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// Create a genre
router.post('/', auth, async (req, res, next) => {
    
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create genre object, set parameters, add to database
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    // Return to client
    res.send(genre);
});

// Read a single specified genre
router.get('/:id', async (req, res) => {
    //const genre = genres.find(g => g.id === parseInt(req.params.id));
    try {
        const genre = await Genre
        .findById(req.params.id);
        res.send(genre);
    }
    catch(err) {
        console.log(err.message);
    }
});

// Update a specified genre
router.put('/:id', auth, async (req, res) => {
    // Validate
    const {error} = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name,
        new: true
    });

    // Search for requested genre
    if (!genre) {
        res.status(404).send('Requested genre does not exist');
        return;
    }

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) res.status(404).send('Requested genre does not exist');
        res.send(genre);
    }
    catch(err) {
        console.log(err.message);
    }
});

module.exports = router;