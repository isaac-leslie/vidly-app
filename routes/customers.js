const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');
module.exports = router;

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

router.post('/', async (req, res) => {
    const result = validateCustomer(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();// stores result of the save
    res.send(customer);
});

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.send(customer);
    }
    catch (err) {
        console.log(err.message);
    }
});

router.put('/:id', async (req, res) => {
    const result = validateCustomer(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const customer = await Customer
    .findByIdAndUpdate(req.params.id, req.body);

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) res.status(404).send('Requested customer does not exist');

    res.send(customer);
});

