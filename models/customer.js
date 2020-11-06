const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 20},
    phone: { type: String, minlength: 10, maxlength: 11 },
    isGold: Boolean
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(reqBody) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(20).required(),
        phone: Joi.string().min(10).max(11),
        isGold: Joi.boolean()
    });
    const result = schema.validate(reqBody);
    return result;
}

exports.Customer = Customer;
exports.validate = validateCustomer;