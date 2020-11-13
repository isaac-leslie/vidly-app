// Make a mongoDB schema, make a validator function, require and export
const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: genreSchema, required: true },
    numberInStock: Number,
    rentalRate: { type: Number, 
        validate: {
            validator: function (v) { return v && v > 0 },
            message: 'Rental rate must be greater than 0'
        }
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(reqBody) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(30).required(),
        genreId: Joi.ObjectId.required(),
        numberInStock: Joi.number().min(0),
        rentalRate: Joi.number().min(0)
    });
    const result = schema.validate(reqBody);
    return result;
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.movieSchema = movieSchema;