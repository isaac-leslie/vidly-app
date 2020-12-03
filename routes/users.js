const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// Register a new user
router.post('/', async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    try {
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        user = await user.save();

        const token = user.generateAuthToken();

        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err) {
        console.log(err.message);
    }
});

module.exports = router;