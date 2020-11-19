require('dotenv').config()
require('./models/Users');
require('./models/Location');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// routes ========
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(locationRoutes);

const mongoUri = process.env.MONGOURL;
mongoose.connect(mongoUri, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("the database has succefully been connect too")
});

mongoose.connection.on('error', (err) => {
    console.log("error", err)
})
app.get('/', requireAuth, (req,res) => {
    res.send(req.user.email);
});

app.listen(3000, () => {
    console.log('hello')
})