const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;