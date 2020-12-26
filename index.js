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
// const http = require('http').createServer(app)
// const io = require('socket.io')(http);
app.use(bodyParser.json());
app.use(authRoutes);
app.use(locationRoutes);

const expressServer = app.listen(9000, () => {
    console.log("you are now connected to the server");
});

const io = require("socket.io")(expressServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  io.on('connection', (socket) => {
    console.log('you are now connected to the Web Socket from server');

    socket.on('location', (data) => {
      console.log('getting location data from client ', data);
      
      io.emit('location', {socket: socket.id, data})
    });

    socket.on('message', (data) => {
      console.log(data);
      io.emit('message', {data: 'this is a message from the server'})
    });
    
  });



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
});
app.get('/', requireAuth, (req,res) => {
    res.send(req.user.email);
});