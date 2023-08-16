const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Session = require("../models/session");
const nodeMailer = require("nodemailer");
const io = require("../socket");
const product = require("../models/product");

exports.getAllProducts = async (req, res, next) => {
  try {
    const prodcuts = await Product.find();
    if (prodcut.length === 0) {
      return res.status(404).json({ msg: "No Product found" });
    } else {
      res.status(200).send(prodcuts);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getProductDetails = async (req, res, next) => {
  const prodId = req.params.prodId;
  try {
    const prodcut = await Product.findById(prodId);
    if (!prodcut) {
      return res.status(404).json({ msg: "No Product found!" });
    } else {
      res.status(200).send(product);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.addProductToCart = async (req, res, next) => {
  const { idUser, idProduct, count } = req.body;
  try {
    const product = await Product.findById(idProduct);
    if (product) {
      product.quantity = product.quantity - count;
      product.save;
    }
    const response = await req.user.addToCart(product, count, idUser);
    console.log("AddProductToCart", response);
    res.status(200).json({ msg: "Successfully added product to cart!!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = req.user.cart.items;
    res.status(200).send(cart);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCart = async (req, res, next) => {
  const idProduct = req.query.idProduct;
  const idUser = req.query.idUser;

  try {
    const user = await User.findById(idUser);
    const product = await Product.findById(idProduct);
    const cartProduct = user.cart.items.find(
      (item) => item.idProduct.toString() !== idProduct.toString()
    );
    const newCartItems = user.cart.items.filter(
      (item) => item.idProduct.toString() !== idProduct.toString()
    );
    user.cart.items = newCartItems;
    console.log("CartProduct", cartProduct);
    console.log("NewCartProduct", newCartItems);
    const response = await user.save();
    if (response) {
      console.log(product.quantity, cartProduct.count);
      let newQuantity = product.quantity + cartProduct.count;
      product.quantity = newQuantity;
      const updatedQuantity = await product.save();
    }
    res.status(200).json({ msg: "Cart Delete!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.editCart = async (req, res, next) => {
  const count = req.query.count;
  const idProduct = req.query.idProduct;
  const idUser = req.query.idUser;
  console.log("count editCart", count);

  try {
    const user = await User.findById(idUser);
    const product = await Product.findById(idProduct);
    const cartProduct = user.cart.items.find(
      (item) => item.idProduct.toString() === idProduct.toString()
    );
    let difference;
    if (count >= cartProduct.count) {
      difference = count = cartProduct.count;
      product.quantity = product.quantity - difference;
    } else {
      difference = cartProduct.count - count;
      product.quantity = product.quantity + difference;
    }
    const updateProduct = await product.save();
    cartProduct.count = count;
    const response = user.save();
    res.status(200).json({ msg: "Cart updated!!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
