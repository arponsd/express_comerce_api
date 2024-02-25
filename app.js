const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productsRouter = require('./routers/product');
const categoryRouter = require('./routers/category');
const userRouter = require('./routers/user');
require('dotenv/config');
const api = process.env.API_URL;
const authJwt = require('./helpers/jwt');


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);
//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/user`, userRouter);
app.get('/', (req, res) => {
    res.send('Hello, world!');
})



mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    app.listen(port, () => {
        console.log(`listening on ${port}`);
    });
    console.log("Mongo database connection done");
})
.catch((err) => {
    console.log('Error connecting', err);
})
