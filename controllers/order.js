
const { validationResult } = require('express-validator');
const { Product } = require('../models/product');
const { Order } = require('../models/order');
const { OrderDetail } = require('../models/orderDetail');
const { Op, Sequelize } = require('sequelize');

module.exports = {
    add: async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()) return res.send({ errors: validationErrors.array() });

            let orderItems = req.body.items;
            let productIds = new Set(orderItems.map((i) => i.productId));
            console.log(Array.from(productIds))
            const products = await Product.findAll({
                where: {
                    id: { 
                        [Op.in]: Array.from(productIds) 
                    }
                }
            });
            // Validating if valid product ids are provided and validating if items are present in enough quantities in the stock
            const productsMap = new Map();
            for(let p of products) {
                productsMap.set(p.id, p);
            }
            let orderDetails = [];
            // Object where key is product id and value is number that needs to be deducted from the stock for that product
            let stockUpdates = {};
            let date = new Date();
            for(let i of orderItems) {
                let product = productsMap.get(i.productId);
                if(!product) return res.status(400).send(`Product with id: ${i.productId}, does not exist`);
                if(product.inStock < i.quantity) return res.status(400).send(`Not enough quantity available for product id: ${product.id}, name: ${product.name}, available: ${product.inStock}`);

                product['inStock'] -= i.quantity;
                let totalPrice = i.quantity * (productsMap.get(i.productId).price);
                // Detail of individual items
                orderDetails.push({ productId: i.productId, quantity: i.quantity, totalPrice: totalPrice, createdAt: date });
                // Deducing items from available stock
                if(stockUpdates.hasOwnProperty(product.id)) {
                    stockUpdates[product.id] += i.quantity;
                }
                else {
                    stockUpdates[product.id] = i.quantity;
                }
            }
            const order = await Order.create({
                customerId: req.token.userId,
                createdAt: date
            });
            for(let od of orderDetails) {
                od['orderId'] = order.id;
            }
            await OrderDetail.bulkCreate(orderDetails);
            let response = order.toJSON();
            response['orderDetails'] = orderDetails;
            for(let p in stockUpdates) {
                await Product.update({ 
                    inStock: Sequelize.literal(`inStock - ${stockUpdates[p]}`),
                    updatedAt: new Date() 
                }, 
                { where: { id: p } });
            }
            
            res.json(response);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    getAll: async (req, res) => {
        try {
            let filters = {};
            // Admin can view all order details, but users can view their own order details only
            if(req.token.role === 'user') filters['customerId'] = req.token.userId;
            const orders = await Order.findAll({
                where: filters,
                include: OrderDetail
            });
            res.json(orders);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}