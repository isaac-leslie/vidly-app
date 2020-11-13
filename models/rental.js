// Make a mongoDB schema, make a validator function, require and export
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { movieSchema, Movie } = require('./movie');
const { customerSchema, Customer } = require('./customer');
// const { genreSchema, Genre } = require('./genre');

const rentalSchema = mongoose.Schema({
    customer: { type: customerSchema, required: true },
    movie: { type: movieSchema, required: true },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(reqBody) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    const result = schema.validate(reqBody);
    return result;
}

exports.Rental = Rental;
exports.validate = validateRental;
exports.rentalSchema = rentalSchema;