const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Session = require("../models/session");
const nodeMailer = require("nodemailer");
const io = require("../socket");
const product = require("../models/product");

const { google } = require("googleapis");
const { trace } = require("../routers/auth");
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(
  process.env.CLIENTID,
  process.env.CLIENTSECRET
);

OAuth2_client.setCredentials({ refresh_token: process.env.REFRESHTOKEN });

exports.getAllProducts = async (req, res, next) => {
  try {
    const prodcuts = await Product.find();
    if (prodcuts.length === 0) {
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

exports.postEmail = async (req, res, next) => {
  const { to, fullname, phone, address, idUser } = req.body;

  try {
    const products = req.user.cart.items.map((item) => {
      return {
        quantity: item.count,
        product: { ...item._doc },
      };
    });
    // Calculate total bill for this order
    let totalBill = 0;
    for (let i = 0; i < products.lengthl; i++) {
      totalBill += products[i].prodcut.total;
    }

    const order = new Order({
      user: {
        name: req.user.fullname,
        phone: phone,
        address: address,
        userId: req.user._id,
      },
      orderDate: new Date(),
      orderStatus: "Waiting for pay",
      orderDelivery: "processing",
      totalBill: totalBill,
      products: products,
    });

    const saveOrder = await order.save();
    const accessToken = OAuth2_client.getAccessToken();
    if (saveOrder) {
      // Send Email
      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.USER,
          clientId: process.env.CLIENTID,
          clientSecret: process.env.CLIENTSECRET,
          refreshToken: process.env.REFRESHTOKEN,
          accessToken: accessToken,
        },
      });

      let mailDetails = {
        from: `B.O.U.T.I.Q.U.E ${process.env.USER}`,
        to: to,
        subject: "YOUR ORDER FROM BOUTIQUE",
        html: `
        <h1>Xin Chào ${saveOrder.user.name}</h1><br/>
        <p>Số Điện Thoại: ${saveOrder.user.phone}</p>
        <p>Địa Chỉ: ${saveOrder.user.address}</p>
        <table>
          <thead>
            <tr>
              <th style="border: 1px solid black">
                Tên Sản Phẩm 
              </th>
              <th style="border: 1px solid black">
                Hình Ảnh 
              </th>              
              <th style="border: 1px solid black">
                Giá 
              </th>
              <th style="border: 1px solid black">
                Số Lượng
              </th>
              <th style="border: 1px solid black">
                Thành Tiền
              </th>
            </tr>
          </thead>
          <tbody>
            ${saveOrder.products.map((prod) => {
              return `
                <tr>
                  <td style="border:"1px solid black">
                    ${prod.product.nameProduct}
                  </td>
                  <td style="border:"1px solid black">
                    <img src="${
                      prod.product.imgProduct
                    }" width="80" height="80"/>
                  </td>
                  <td style="border:"1px solid black">
                    ${prod.product.priceProduct}
                  </td>
                  <td style="border:"1px solid black">
                    ${prod.quantity}
                  </td>
                  <td style="border:"1px solid black">
                    ${prod.quantity * prod.product.priceProduct}
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
        <p>Ngày Đặt Hàng: ${saveOrder.orderDate.toLocaleDateString("en-GB")}</p>
        <h2>
          Thành Tiền: ${new Intl.NumberFormat("vn-VN", {
            style: "currency",
            currency: "VND",
          }).format(saveOrder.totalBill)}
        </h2>
        `,
      };
      res.status(200).json({ msg: "New Order Created!" });
      transporter.sendMail(mailDetails, (err, info) => {
        if (err) {
          return console.log("Email", err);
        } else {
          console.log("Email sent");
          req.user.clearCart();
          res.status(200).json({ msg: "New Order Created!" });
        }
      });
    } else {
      res.status(400).json({ msg: "No Order" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  const { idUser } = req.query;
  console.log(idUser);

  try {
    const userOrders = await Order.find({ "user.userId": idUser });
    res.status(200).send(userOrders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getDetailedHistory = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    res.status(200).send(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getPagination = async (req, res, next) => {
  console.log(req.query);
};

exports.getResponse = async (req, res, next) => {
  res.status(200).json({ msg: "Server liev!!" });
};

exports.createNewChatRoom = async (req, res, next) => {
  try {
    const session = new Session({
      user: {
        name: req.user.fullname,
        userId: req.user._id,
      },
      createdDate: new Date(),
      messages: [],
    });

    const savedSession = await session.save();
    console.log(savedSession);
    res
      .status(200)
      .json({ msg: "New Chat Room Created", session: savedSession });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.addMessage = async (req, res, next) => {
  const { roomId, messages } = req.body;
  console.log(roomId);

  try {
    const chatRoom = await Session.findById(roomId);
    const addedMessage = await chatRoom.addMessage(messages);
    io.getIo().on("Send_Message", (date) => {
      console.log(date);
    });
    res.status(200).send(chatRoom);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getChatRoomId = async (req, res, next) => {
  const roomId = req.query.roomId;

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
