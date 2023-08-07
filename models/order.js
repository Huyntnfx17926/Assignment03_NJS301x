const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  orderDate: {
    type: Date,
    require: true,
  },
  orderStatus: {
    type: String,
    require: true,
  },
  orderDelivery: {
    type: String,
    require: true,
  },
  totalBill: {
    type: Number,
    require: true,
  },
  products: [
    {
      product: { type: Object, require: true },
      quantity: { type: Number, require: true },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
