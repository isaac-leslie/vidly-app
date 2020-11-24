
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {User} = require('../models/user');
const router = express.Router();


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(result.error.message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');

    

    try {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password');

        // this defines the payload of the web token
        const token = user.generateAuthToken();
        res.send(token);
    }
    catch (err) {
        console.log(err.message);
    }
});

function validate(reqBody) {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(6).max(255)
    });
    
    const result = schema.validate(reqBody);
    return result;
}

module.exports = router;