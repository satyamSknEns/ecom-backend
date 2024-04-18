const express = require("express");
const authController = require("../controller/auth");

const router = express.Router();
router
  .post("/signUp", authController.signUp)
  .post("/login", authController.login)
  .post("/verify", authController.verifyCode)
  .post("/resetpassword", authController.resetPassword)
  .put("/changepassword", authController.changePassword);

exports.router = router;
