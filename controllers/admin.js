const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const product = require("../models/product");
const Session = require("../models/session");
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
  console.log("Load img: ", images);
  try {
    let imgPaths = [];
    // Push image lên cloud
    for (let image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imgPaths.push(result.secure_url);
    }
    console.log("Push IMG:", imgPaths);
    const product = new Product({
      name: productName,
      category: category,
      img1: imgPaths[0],
      img2: imgPaths[1],
      img3: imgPaths[2],
      img4: imgPaths[3],
      long_desc: longDesc,
      short_desc: shortDesc,
      price: price,
      quantity: quantity,
    });
    const response = await product.save();
    res.status(200).json({ msg: "New Product added!" });
    console.log("New Product ", response);
    console.log("New Product status ", res);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.fetchEditProduct = async (req, res, next) => {
  const id = req.params.prodId;

  try {
    const product = await Product.findById(id);
    res.status(200).send(product);
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { name, category, price, shortDesc, longDesc, quantity } = req.body;
  const id = req.params.prodId;
  console.log("Id Edit ", id);

  try {
    const product = await Product.findById(id);
    if (name) {
      product.name = name;
    }
    if (category) {
      product.category = category;
    }
    if (price) {
      product.price = price;
    }
    if (shortDesc) {
      product.short_desc = shortDesc;
    }
    if (longDesc) {
      product.long_desc = longDesc;
    }
    if (quantity) {
      product.quantity = quantity;
    }

    const response = await product.save();
    res.status(200).json({ msg: "Successfully update product", prod: product });
    console.log("Edit ~!~ ", response);
    console.log("Edit status ", res);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.params.prodId;

  try {
    // Set Id rồi Delete!!
    const product = await Product.findById(id);
    const response = await product.remove();
    res.status(200).json({ msg: "Product deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.postImages = async (req, res, next) => {
  console.log(req.body);
};

exports.getAllChatRooms = async (req, res, next) => {
  try {
    const chatRooms = await Session.find();
    res.status(200).send(chatRooms);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};

exports.getChatRoomId = async (req, res, next) => {
  const roomId = req.query.roomId;
  console.log("Chat Room ID: ", roomId);
  try {
    const chatRoom = await Session.findById(roomId);
    res.status(200).send(chatRoom);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};
