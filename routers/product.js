const express = require('express');
const router = express.Router();
const {Product, productSchema} = require('../models/product');
const Category = require('../models/category');

router.get(`/`, async (req, res) => {
    try {
        let filter = {};
        if(req.query.categories) {
            filter = {categories :req.query.categories.split(',')};
        }
        const product = await Product.find(filter).populate('category');
        console.log(filter);

        if(!product) {
            res.status(404).json({message: 'No product found'});
        } else {
            res.status(201).json(product);
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

router.post(`/`, async(req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
        res.status(400).send('Invalid category');
    } else {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
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
    }
;});

router.get('/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            res.status(404).json({message: 'Product not found'});
        } else {
            res.status(200).json({data: product, message: 'Product found', success: true});
        }
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            },
            {new: true}
        )
    
        if(!product) {
            res.status(404).send("Product not found");
        } else {
            res.status(200).json(product);
        }
    } 
    catch(err) {
        res.status(500).json({message: err.message, success: false});
    }
});

router.delete('/:id', async(req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    .then((product) => {
        if(!product) {
            res.status(404).send("Product not found");
        } else {
            res.status(200).json(product);
        }
    })
    .catch((err) => {
        res.status(500).json({message: err.message, success: false});
    })
});

router.get('/get/count', async(req, res) => {
    try{
        const productCount = await Product.countDocuments();
    
        if(!productCount) {
            res.status(404).json({message: 'Product not found', success: true});
        } else {
            res.status(200).json({count: productCount ,message: 'Product count successful'})
        }
    }
    catch(err){
        res.status(500).json({message: err.message, success: false});
    }
});

router.get('/get/featured',async (req, res) => {
    try{
        const product = await Product.find({isFeatured: true}).populate('category');
        if(!product) {
            res.status(404).json({message: 'Product not found', success: false});
        } else {
            res.status(200).json(
                {
                    data: product,
                    message: 'Freatured Product found',
                    success: true
                })
        }
    }
    catch(err) {
        res.status(500).json({message: err.message, success: false});
    }
})

router.get('/get/featured/:count',async (req, res) => {
    try{
        const count  = req.params.count ?? 0;
        const product = await Product.find({isFeatured: true}).populate('category').limit(+count);
        if(!product) {
            res.status(404).json({message: 'Product not found', success: false});
        } else {
            res.status(200).json(
                {
                    data: product,
                    message: 'Freatured Product found',
                    success: true
                })
        }
    }
    catch(err) {
        res.status(500).json({message: err.message, success: false});
    }
})


module.exports = router;