const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    // if user has not modified password in any way do nothing
    if(!user.isModified){
        return next();
    }
    // else salt password
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function(userPass){
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(userPass, user.password, (err, isMatch) => {
            if(err){
                return reject(err);
            }
            if(!isMatch){
                return reject(false);
            }
            resolve(true);
        })
    })
}

mongoose.model('User', userSchema)