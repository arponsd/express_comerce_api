const mongoose = require('mongoose');
const Product = require('prouct');
const orderItemsSchema = mongoose.Schema({
    id: String,
    product: Product,
    quantity: Number
});

const OrderItem = mongoose.model('OrderItem', orderItemsSchema);


module.exports = OrderItem;