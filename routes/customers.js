const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Customer, validate } = require('../models/customer');


router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

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
    const result = validate(req.body);
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

module.exports = router;