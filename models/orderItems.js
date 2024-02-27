const mongoose = require('mongoose');
const Product = require('prouct');
const orderItemsSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

const OrderItem = mongoose.model('OrderItem', orderItemsSchema);


module.exports = OrderItem;