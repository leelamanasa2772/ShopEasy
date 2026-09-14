const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userEmail: {
        type: String,
        required: true
    },

    products: [
        {
            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    orderDate: {
        type: Date,
        default: Date.now
    }

});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;