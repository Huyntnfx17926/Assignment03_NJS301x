const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postSignUp = async (req, res, next) => {
  const { fullname, email, password, phone } = req.query;

  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      fullname: fullname,
      email: email,
      phone: phone,
      password: hashedPass,
      role: "client",
      cart: { items: [] },
    });

    const result = await user.save();
    console.log("Post SignUp", result);
    res.status(201).json({ msg: "New user created!", userId: _id });
  } catch (err) {
    console.log("Post Signup err", err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return console.log("Lỗi login sai: User");
    } else {
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(404).json({ msg: "Wrong password" });
      } else {
        const accessTonken = jwt.sign(
          user.toJSON(),
          `${process.env.ACCESSTONKEN}`
        );
        res.status(200).json({ user: user, accessTonken: accessTonken });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
