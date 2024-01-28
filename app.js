require('dotenv').config();
console.log('env', process.env);
const express = require('express');
const { init } = require('./models/user');
const { JWTTokenParser } = require('./lib/auth').middlewares;
const sequelize = require('./lib/sequelize');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/product', JWTTokenParser, productRouter);
app.use('/order', JWTTokenParser, orderRouter);

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`App is listening on ${port}`);

// Creating tables in database if not present already and also performing starup tasks
sequelize.sync().then(() => {
    init().then().catch((err) => console.log(err));
});

module.exports = app;