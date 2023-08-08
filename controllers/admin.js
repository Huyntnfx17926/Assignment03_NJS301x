const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const product = require("../models/product");
const cloudinary = require("cloudinary").v2;

// Thư viện Lưu Trữ Ảnh
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.postAdminSignUp = async (req, res, next) => {
  const { fullname, email, password, phone, role } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!User) {
      const hashedPass = await bcrypt.hash(password, 12);
      const newUser = new User({
        fullname: fullname,
        email: email,
        password: hashedPass,
        phone: phone,
        role: role,
      });
      const response = await newUser.save();
      if (!response) {
        res.statusMessage = "Cannt create Admin user";
        return res.status(400).end();
      } else {
        res.statusMessage = "New Admin user created";
        res.status(200).end();
      }
    } else {
      res.statusMessage = "This email is already been used";
      res.status(400).end();
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.postAdminSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ msg: "No user found!" });
    } else {
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        res.statusMessage = "Wrong Password!";
        return res.status(404).end();
      } else {
        const accessTonken = jwt.sign(
          user.toJSON(),
          `${process.env.ACCESSTONKEN}`
        );
        res.statusMessage = "Successfully signed in";
        res.status(200).json({ accessTonken: accessTonken, user: user });
      }
    }
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminGetProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(error);
  }
};

exports.adminSearchProduct = async (req, res, next) => {
  const query = req.body.query;
  try {
    const products = await Product.find();
    const results = products.filter((product) =>
      product.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
    res.status(200).send(results);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

// Set role Client
exports.fetchClients = async (req, res, next) => {
  try {
    const user = await User.find();
    const clients = user.filter((user) => user.role === "client");
    res.status(200).send(clients);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.fetchOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    let earning = 0;
    for (let i = 0; i < orders.length; i++) {
      earning += orders[i].totalBill;
    }
    res.statusCode(200).json({ earning: earning, orders: orders });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

// New Product
exports.addNewProduct = async (req, res, next) => {
  const { productName, category, price, shortDesc, longDesc, quantity } =
    req.body;
  const images = res.files;
  console.log(images);
};
