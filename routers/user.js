const express = require('express');
const router = express.Router();
const {User, userSchema} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');
router.get('/', async (req, res) => {
    try {
        const user = await User.find().select('-passwordHash');

        if(user.length === 0) {
            res.status(404).json({ message: 'User not found'});
        } else {
            res.status(200).json({ data: user, message: 'User successfully found', success: true})
        }
    }
    catch(err) {
        res.status(500).json({ message: err.message , success: false});
    }
});

router.post('/register', async(req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash, 10),
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin
    });

    user.save().then((createdUser) => {
        res.status(201).json(createdUser);
    })
    .catch((error) => {
        res.status(500).json({message: error.message, success: false})
    })
});


router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if(!user) {
            res.status(404).json({ message: 'User not found'});
        } else {
            res.status(200).json({data: user, message: 'User successfully found'});
        }
    }
    catch (err) {
        res.status(500).json({message: err.message, success: false});
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    if(!user) {
        res.status(400).json({message: 'User not found'});
    } else {
        if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                {expiresIn: '1d'}
            )
            res.status(200).send({user: user.email, token: token});
        } else {
            res.status(400).send('password is wrong');
        }
    }
});

router.get('/get/count', async(req, res) => {
    try{
        const userCount = await User.countDocuments();
    
        if(!userCount) {
            res.status(404).json({message: 'user not found', success: true});
        } else {
            res.status(200).json({count: userCount ,message: 'user count successful'})
        }
    }
    catch(err){
        res.status(500).json({message: err.message, success: false});
    }
});







module.exports = router ;