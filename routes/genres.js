const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');



// Read and list all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.send(genres);
    }
    catch(err) {
        console.log(err.message);
    }
});

// Create a genre
router.post('/', async (req, res) => {
    // Validate
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    try {
        // Create genre object, set parameters, add to database
        let genre = new Genre({ name: req.body.name });
        genre = await genre.save();

        // Return to client
        res.send(genre);
    }
    catch(err) {
        console.log(err.message);
    }
    
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
router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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