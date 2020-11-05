const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20    
    }
});

const Genre = mongoose.model('Genre', genreSchema);

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
    const result = validateGenre(req.body);
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
    const {error} = validateGenre(req.body);
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

// Validates a genre's name and returns the result
function validateGenre(reqBody) {
    const schema = Joi.object({
        name: Joi.string().min(2).required()
    });

    const result = schema.validate(reqBody);
    return result;
}

module.exports = router;

/* // Read and list all genres
async function createCourse() {
    const genre = new Genre({
        name: ''
    });
    try {
        await genre.save();
        console.log(genre);
    }
    catch(err) {
        console.log('Error creating genre', err.message);
    }
}

async function getGenres() {
    try {
        const genres = await Genre
        .find({})
        .select('name');
        console.log(genres);
    }
    catch(err) {
        console.log('Error getting genres', err);
    }
}

async function deleteGenre() {
    try {
        const genre = await Genre
            .deleteOne({ name: 'game ' });
    }
    catch (err) {
        console.log('Error deleting genre', err.message);
    }
}

async function updateGenre() {
    try {
        const genre = await Genre
        .update({ name: '2' }, { name: 'game OST' });
    }
    catch(err) {
        console.log('Error updating genre', err.message);
    }
} */