const express = require('express');
const geoLocationController = require('../controller/geoLocation');

const router = express.Router();

router
  .post('/', geoLocationController.geoLocation)
  .get('/', geoLocationController.getLocation)

exports.router = router;  