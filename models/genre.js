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

const Genre = mongoose.model('genre', genreSchema);

function validateGenre(reqBody) {
    const schema = Joi.object({
        name: Joi.string().min(2).required()
    });

    const result = schema.validate(reqBody);
    return result;
}

exports.validate = validateGenre;
exports.Genre = Genre;