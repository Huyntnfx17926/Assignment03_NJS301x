const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        idProduct: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        imgProduct: { type: String, require: true },
        nameProduct: { type: String, require: true },
        priceProduct: { type: String, require: true },
        count: { type: Number, require: true },
        total: { type: Number },
      },
    ],
  },
});

// Tạo Cart mới
userSchema.methods.addToCart = function (product, count) {
  const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
    return cartProduct.idProduct.toString() === product._id.toString();
  });

  let newCount = count;

  const updatedCartItems = [...this.cart.items];

  // Nếu đã có thì +1 và Cộng thêm Tiền
  if (cartProductIndex >= 0) {
    newCount = this.cart.items[cartProductIndex].count + count;
    updatedCartItems[cartProductIndex].count = newCount;
    updatedCartItems[cartProductIndex].total = newCount * product.price;
  } else {
    // Tạo mới
    updatedCartItems.push({
      idProduct: product._id,
      imgProduct: product.img1,
      nameProduct: product.name,
      priceProduct: product.price,
      count: newCount,
      total: +product.price * newCount,
    });
  }

  const updatedCart = { items: updatedCartItems };

  this.cart = updatedCart;
  // Save
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.idProduct.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
