const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secretKey = process.env.KEY
// sign up route

router.get('/', (req,res) => {
    res.send("This is just the home route that does nothing");
});

router.post('/signUp', async (req, res) => {
    
    const { email, password } = req.body;

    try {
        const user = new User({email, password});
        await user.save();
        const token = jwt.sign({userId: user._id}, secretKey);
        res.send({token: token})
    } catch(err) {
        res.send(err.message)
    }

});

// sign in route 

router.post('/signIn', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(422).send({error: 'Must provide email and password'});
    }

    const user = await User.findOne({email: email});

    if(!user){
        res.status(404).send({error: 'User not found ... please try again'});
    }

    try{
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, secretKey);
        res.send({token: token});
    } catch(err) {
        res.send({error: 'Sorry the details provided are not correct'})
    }

});
module.exports = router;