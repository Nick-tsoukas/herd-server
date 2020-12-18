const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number,
    },
    mocked: Boolean,
    timestamp: Number
});


const LocationSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    locations: [PointSchema]

});

mongoose.model('Location', LocationSchema);