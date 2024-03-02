const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderItem = require('../models/orderItems');
const { populate } = require('dotenv');

router.get('/', async (req, res) => {
    try {
        const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    
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
        const orderById = await Order.findById(req.params.id).populate('user', 'name').populate({
            path:'orderItems', populate: {
                path: 'product', populate:'category'}});

        if(!orderById) {
            res.status(404).send('Order not found');
        }
        res.status(200).json({message:' Order Found', data: orderById});
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

router.put('/:id', async(req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true}
        );

    if(!order) {
        res.status(404).send('status not changed');
    }
    res.status(201).json({data: order, message:'order status change successfully'})
});

router.delete('/:id', async (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async(order) => {
        if(order) {
            await order.orderItems.map(async(orderItem) => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            res.status(200).json({success: true, message:'The order is deleted'})
        } else {
            res.status(404).json({success: false, message:'order not deleted'})
        }
    })
    .catch((err) => {
        res.status(500).json({success: false, error: err.message});
    })
});

router.get('/get/usersorders/:userid', async(req, res) => {
    const order = await Order.find({user: req.params.userid}).populate({
        path: 'orderItems', populate: { path: 'product', populate: 'category'}
    }).sort({ 'dateOrdered': -1});

    if(!order) {
        res.status(404).send('order not found');
    } 
    res.status(200).json({data: order, message: 'Order found'});
})




module.exports = router;