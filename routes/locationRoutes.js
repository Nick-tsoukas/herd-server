const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Location = mongoose.model('Location');
const router = express.Router();
// router.use(requireAuth);

router.get('/locations', async (req, res) => {
  const locations = await Location.find({ userId: req.user._id });
  res.send(locations);
});

router.post('/locations', async (req, res) => {
  const  locations  = req.body;
  console.log(locations)

  if (!locations) {
    return res
      .status(422)
      .send({ error: 'You must provide locations' });
  }

  try {
    const location = new Location({locations, userId: req.user._id });
    await location.save();
    res.send(location);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.get('/locationsTest', (req, res) => {
  res.send(req.user._id);
});

module.exports = router;