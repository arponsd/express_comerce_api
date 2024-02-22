const mongoose = require('mongoose');
const OrderItems = require('orderItems');
const User = require('User');

const orderSchema = mongoose.Schema({
    id: String,
    orderItems: [OrderItems],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    totalPrice: {
        type: String,
        required: true
    },
    user: {
        type: User,
        required: true
    },
    dateOrdered: {
        type: Date,
        required: true
    }

})