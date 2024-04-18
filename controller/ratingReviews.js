const model = require("../model/ratingReviews");
const Rating = model.Rating;

exports.ratingReviews = async (req, res) => {
  try {
    const { productId, email, reviewText, rating } = req.body;
    const existingReview = await Rating.findOne({ email, productId });
    const ratings = new Rating(req.body);
    if (!existingReview) {
      ratings.save((err, doc) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(201).json(doc);
        }
      });
    } else {
      const updateRatings = await Rating.findOneAndUpdate(
        { email, productId },
        { reviewText, rating },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json(updateRatings);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
