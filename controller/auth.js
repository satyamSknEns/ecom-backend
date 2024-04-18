const jwt = require("jsonwebtoken");
// const model = require("../model/user");
// const User = model.User;
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../private.key"),
  "utf-8"
);

// exports.signUp = (req, res) => {
//   const user = new User(req.body);
//   const token = jwt.sign({ email: req.body.email }, privateKey, {
//     algorithm: "RS256",
//   });

//   user.token = token;
//   user.save((err, doc) => {
//     console.log({ err, doc });
//     if (err) {
//       res.status(400).json(err);
//     } else {
//       res.status(200).json({ token });
//     }
//   });
// };
exports.signUp = (req, res) => {
  try {
    const user = new User(req.body);
    const { password, confirmPassword } = req.body;
    const token = jwt.sign({ email: req.body.email }, privateKey, {
      algorithm: "RS256",
    });
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password: At least 8 characters, 1 uppercase, 1 number required.",
      });
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password do not match" });
      } else {
        user.token = token;
        user.save((err, doc) => {
          console.log({ err, doc });
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json({ token });
          }
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    const doc = await User.findOne({ email: req.body.email });
    // console.log("doc", doc);

    if (!doc || doc === null) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const user = {
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
      };
      if (req.body.password === doc.password) {
        const token = jwt.sign({ email: req.body.email }, privateKey, {
          algorithm: "RS256",
        });
        doc.token = token;
        doc.save(() => {
          res.json({ success: true, token, user });
        });
      } else {
        res.status(401).json({ success: false, message: "Wrong password" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found with this email" });
    } else {
      if (code === user.Otp) {
        res
          .status(200)
          .json({ message: "Congratulations! Your account is now verified" });
      } else {
        res.status(401).json({ message: "Incorrect code. Please try again" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { data, email } = req.body;
    const { password, confirmPassword } = data;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Email not registered. Check or sign up" });
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password: At least 8 characters, 1 uppercase, 1 number required.",
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password do not match" });
      } else {
        const resetPassword = await User.findOneAndUpdate(
          { email },
          { $set: { password, confirmPassword } },
          { new: true, upsert: true }
        );
        res.status(200).json({
          data: resetPassword,
          messase: "Your password has been updated successfully!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { data, email } = req.body;
    const { oldPassword, password, confirmPassword } = data;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Email not registered. Check or sign up" });
    } else {
      if (oldPassword) {
        if (oldPassword !== user.password) {
          return res.status(404).json({
            success: false,
            message: "Incorrect old password.Please check & try again.",
          });
        } else {
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

          if (!passwordRegex.test(password)) {
            return res.status(400).json({
              message:
                "Password: At least 8 characters, 1 uppercase, 1 number required.",
            });
          }
          if (password !== confirmPassword) {
            return res
              .status(400)
              .json({ success: false, message: "Password do not match" });
          } else {
            const resetPassword = await User.findOneAndUpdate(
              { email },
              { $set: { password, confirmPassword } },
              { new: true, upsert: true }
            );
            res.status(200).json({
              success: true,
              data: resetPassword,
              messase: "Your password has been updated successfully!",
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};
