const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get(`/`, async (req, res) => {
    try {
        const product = await Product.find();

        if(!product) {
            res.status(404).json({message: 'No product found'});
        } else {
            res.status(201).json(product);
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

router.post(`/`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });

    product.save().then((createdProduct) => {
        res.status(201).json(createdProduct);
    })
    .catch((error) => {
        res.status(500).json({
            error: error,
            success: false
        })
    });
;});

module.exports = router;