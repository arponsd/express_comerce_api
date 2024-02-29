const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderItem = require('../models/orderItems');

router.get('/', async (req, res) => {
    try {
        const orderList = await Order.find();
    
        if(!orderList) {
            res.status(404).json({message: 'No order found'});
        } else {
            res.status(200).json({message: 'Order List found', data: orderList});
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

router.post('/', async (req, res) => {

    const orderItemsId = Promise.all(req.body.orderItems.map(async (orderItems) => {
        let newOrderItems = new OrderItem({
            quantity: orderItems.quantity,
            product: orderItems.product
        });

        newOrderItems = await newOrderItems.save();
        return newOrderItems._id;
    }));

    const orderItemsResolved = await orderItemsId;
    
    const productPrice = await Promise.all(orderItemsResolved.map( async(orderItemId) => {
        const orderItem =await OrderItem.findById(orderItemId).populate('product');
        const prices = orderItem.product.price * orderItem.quantity;
        return prices;
    }));

    const totalPrice = productPrice.reduce((a, b) => a+b, 0);

    let order = new Order({
        orderItems: orderItemsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });

    order = await order.save().then((order) => {
        res.status(201).json({data: order, message: 'Order create successfully'})
    })
    .catch((err) => {
        res.status(500).json({message: err.message, success: false})
    })
});

router.get('/count', async (req, res) => {
    try{
        let orderList = await Order.countDocuments();
        if(!orderList) {
            res.status(404).json({message: 'Order not found'});
        } 
        res.status(200).json({message:'Order List found', data: orderList});
    } catch(err){
        res.status(500).json({message: err.message, success: false});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const orderById = await Order.findById(req.params.id);

        if(!orderById) {
            res.status(404).send('Order not found');
        }
        res.status(200).json({message:' Border Found', data: orderById});
    } catch(err) {
        res.status(500).send('Internal server error');
    }
})

router.delete('/all', async (req, res) => {
    try {
        // Delete all orders
        await Order.deleteMany({});
        res.status(200).send("All orders deleted successfully.");
    } catch (error) {
        console.error("Error deleting orders:", error);
        res.status(500).send("Internal server error");
    }
});




module.exports = router;