const mongoose = require("mongoose");
const { Schema } = mongoose;

const geoLocation = new Schema({
  userId: { type: String, required: true, unique: true },
  locations: { type: [[String]]}
});

exports.Location = mongoose.model("geolocation", geoLocation);
