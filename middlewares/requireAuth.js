const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const secretKey = process.env.KEY

// How do I include this middleware into my routes to get the user id 
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization =  Bearer someTokenjfjfjfjfjfjfjfjfj 
    if(!authorization){
       return res.status(401).send({ error: 'You must be logged in to do that'});
    }
    // This line removes the word Bearer and the space after it. This is how we get just the token line 12. Very important
    const token = authorization.replace("Bearer ", '');;
    
    jwt.verify(token, secretKey, async (err, payload) => {

        // if(err){
        //      res.status(401).send({ error: "You must be logged in to do that"});
        // }
        // this is how we get the user id... from the auth middleware
        // The front end must pass the token so we can get the user before we save location data to the database
        //  The Location route must use the middleware in order to get the payload that we need ... almost there
        try {
            const { userId } = payload;
            const user = await User.findById(userId);
            req.user = user;
            next();

        } 
        catch (err) {
            res.status(401).send({ error: "You must be logged in to do that"});
        }
       
    })
};