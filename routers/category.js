const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', async (req, res) => {
    try{
        const categoryList = await Category.find();

        if(!categoryList) {
            res.status(404).json({message: 'Category Not Found'});
        } else {
            res.status(201).json(categoryList);
        }
    }
    catch(err) {
        res.status(500).json({message: err.message, success: false});
    }
});

router.post('/', (req, res) => {
    let category = Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category.save().then((createdCategory) => {
        res.status(201).json(createdCategory);
    })
    .catch((error) => {
        res.status(500).json({ error: error, success: false})
    });
});

router.delete('/:id', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id)
    .then((category) => {
        if(!category) {
            res.status(404).json({message: 'No Category found'});
        } else {
            res.status(200).json({
                data: category,
                message: 'Category Delete Successfully',
                success: true
            });
        }
    })
    .catch((err) => {
        res.status(400).json({message: err.message, success: false});
    });
})

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({message: 'Category not found'});
        } else {
            res.status(200).json(category);
        }
    }
    catch(err) {
        res.status(500).json({message: err.message, success: false});
    }
});

router.put('/:id',async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            },
            {new: true}
        )
    
        if(!category) {
            res.status(404).send('The category cannot be created');
        } else {
            res.status(200).json(category);
        }
    }
    catch(err) {
        res.status(500).json({message: err.message, success: false});
    }
})


module.exports = router;