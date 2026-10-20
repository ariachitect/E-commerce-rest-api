const express = require('express');
const productController = require('./controllers/productController');

const productRouter = require('./routes/productRoutes');

const app = express();
// general middleware part
app.use(express.json());
// routing
app.use('/api/v1/products', productRouter);
//exporting
module.exports = app;
