require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const server = express();
const path = require("path");
const productRouter = require("./routes/product");
const authRouter = require("./routes/auth");
const ratingReviewsRouter = require("./routes/ratingReviews");
const geoLocationRouter = require("./routes/geoLocation");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const publicKey = fs.readFileSync(
  path.resolve(__dirname, "./public.key"),
  "utf-8"
);

console.log("env", process.env.DB_PASSWORD);

//db connection
main().catch((err) => console.log(err));
console.log("process.env.MONGO_URL", process.env.MONGO_URL);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database Connected Successfully");
}

//bodyParser
const auth = (req, res, next) => {
  try {
    const token = req.get("Authorization").split("Bearer ")[1];
    // console.log("token", token);
    var decoded = jwt.verify(token, publicKey);
    // console.log("decoded", decoded);
    if (decoded.email) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.sendStatus(401);
  }
};

server.use(cors());
server.use(express.json());
server.use(express.urlencoded());
server.use(morgan("default"));
server.use(express.static(process.env.PUBLIC_DIR));
server.use("/location", auth, geoLocationRouter.router);
server.use("/auth", authRouter.router);
server.use("/products", auth, productRouter.router);
server.use("/products/ratings", auth, ratingReviewsRouter.router);

server.listen(process.env.PORT, () => {
  console.log(`Server Started Successfully on port ${process.env.PORT}`);
});
