const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  // paymentMethod: {
  //   type: String,
  //   enum: ["upi", "cashondelivery"],
  //   required: true,
  // },
  // paymentStatus: {
  //   type: String,
  //   enum: ["Pending", "Completed", "Failed"],
  //   default: "Pending",
  // },
  // status: {
  //   type: String,
  //   enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  //   default: "Pending",
  // },
  address: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
