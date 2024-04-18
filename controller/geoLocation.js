const model = require("../model/geoLocation");
const Location = model.Location;

exports.geoLocation = async (req, res) => {
  try {
    const { userId, longitude, latitude } = req.body;
    const existingUser = await Location.findOne({ userId });

    const newLocation = [longitude, latitude];

    if (!existingUser) {
      const newDoc = new Location({
        userId,
        locations: newLocation,
      });
      await newDoc.save();
      res.status(201).json(newDoc);
    } else {
      existingUser.locations.push(newLocation);
      await existingUser.save();
      res.status(200).json(existingUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const locations = Location.findOne(req.params.userId);
    res.status(201).json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
