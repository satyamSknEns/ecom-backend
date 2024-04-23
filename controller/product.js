const model = require("../model/product");
const Product = model.Product;
const ratingsModel = require("../model/ratingReviews");
const Rating = ratingsModel.Rating;

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    product.save((err, doc) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(doc);
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// exports.getAllProducts = async (req, res) => {
//   try {
//     const query = Product.find();
//     const ratings = await Rating.find();
//     const productIdMap = new Map(); // Map to store ratings for each productId
//     const productCountMap = new Map(); // Map to store count of ratings for each productId

//     // Iterate through ratings and populate productIdMap and productCountMap
//     ratings.forEach((rating) => {
//       if (!productIdMap.has(rating.productId)) {
//         productIdMap.set(rating.productId, rating.rating);
//         productCountMap.set(rating.productId, 1);
//       } else {
//         productIdMap.set(rating.productId, productIdMap.get(rating.productId) + rating.rating);
//         productCountMap.set(rating.productId, productCountMap.get(rating.productId) + 1);
//       }
//     });
//     console.log('productIdMap',productIdMap);
//     console.log('productCountMap',productCountMap);

//     const products = await query.exec();
//     const productAverageRatings = [];

//     // Iterate through products and calculate average rating for each product
//     products.forEach((product) => {
//       const productId = product.productId;
//       const totalRating = productIdMap.get(productId) || 0;
//       const ratingCount = productCountMap.get(productId) || 0;
//       const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

//       productAverageRatings.push({
//         productId: productId,
//         averageRating: averageRating
//       });
//     });

//     res.json({
//       success: true,
//       productAverageRatings: productAverageRatings,
//       count: products.length,
//       data: products
//     });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

exports.getAllProducts = async (req, res) => {
  try {
    const allProductsQuery = Product.find();
    const ratings = await Rating.find();

    const ratingSummary = ratings.reduce((acc, rating) => {
      if (!acc[rating.productId]) {
        acc[rating.productId] = { totalRating: 0, ratingCount: 0 };
      }
      acc[rating.productId].totalRating += rating.rating;
      acc[rating.productId].ratingCount++;
      return acc;
    }, {});

    const products = await allProductsQuery.exec();

    for (const product of products) {
      const productId = product.productId;
      const { totalRating, ratingCount } = ratingSummary[productId] || {
        totalRating: 0,
        ratingCount: 0,
      };
      const averageRating =
        ratingCount > 0
          ? parseFloat((totalRating / ratingCount).toFixed(1))
          : 0;
      if (averageRating !== 0) {
        product.rating = averageRating;
        await product.save();
      }
    }
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getProduct = async (req, res) => {
  const id = req.query.productId;
  try {
    const product = await Product.findOne({ productId: id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCollection = async (req, res) => {
  const collectionName = req.query.category;
  try {
    const collection = await Product.find({ category: collectionName });
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.replaceProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Product.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Product.findOneAndDelete({ _id: id });
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
