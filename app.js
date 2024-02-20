const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

require('dotenv/config');
const api = process.env.API_URL;


app.get('/', (req, res) => {
    res.send('Hello, world!');
})

app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'Hair Dresser',
        image:'some_url'
    }
    res.send(product);
;});

app.post(`${api}/products`, (req, res) => {
    const product = req.body;
    res.send(product);
;})

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database Connection is Ready')
})
.catch((err) => {
    console.log(err);
})

app.listen(port, () => {
    console.log(`listening on ${port}`);
})