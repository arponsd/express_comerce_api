const mongoose = require('mongoose');
const OrderItems = require('orderItems');
const User = require('User');

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orderitem',
        required: true
    }],
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
        required: false,
        default: 'pending'
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

orderSchema.virtual('id').get(function() {
    return this._id.toHexString()
});

orderSchema.set('toJSON', {
    virtuals: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = {Order, OrderSchema};