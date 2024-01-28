const { validationResult } = require('express-validator');
const { Product } = require('../models/product');
const { Op, Sequelize } = require('sequelize');

module.exports = {
    add: async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()) return res.send({ errors: validationErrors.array() });

            let product = await Product.findOne({
                where: { name: req.body.name }
            });
            if(product) return res.status(400).send('Product with same name already exists');

            product = await Product.create({
                name: req.body.name,
                price: req.body.price,
                inStock: req.body.inStock,
                createdOn: new Date(),
                createdBy: req.token.userId
            });
            res.json(product);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }     
    },
    getAll: async (req, res) => {
        try {
            const products = await Product.findAll({});
            res.json(products);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    getInStock: async (req, res) => {
        try {
            const products = await Product.findAll({
                where: {
                    inStock: { [Op.gt]: 0 }
                }
            });
            res.json(products);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    updateById: async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()) return res.send({ errors: validationErrors.array() });

            const id = req.params.id;
            const product = await Product.findOne({ where: { id: id } });
            if(!product) return res.status(400).send('Product doesn not exist');
            if(req.body.name && req.body.name === product.name) return res.status(400).send('Product with same name already exists');
            let updates = {};
            let properties = new Set(['name', 'price', 'inStock']);
            for(let p of properties) {
                if(req.body.hasOwnProperty(p)) updates[p] = req.body[p];
            }
            updates['updatedBy'] = req.token.userId;
            updates['updatedAt'] = new Date();
            await Product.update(updates, {
                where: { id: id }
            });
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    deleteById: async (req, res) => {
        try {
            await Product.destroy({
                where: { id: req.params.id }
            })
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    /**
     * Increases availability for the given product by the given quantity
     * @param {object} req 
     * @param {object} res 
     */
    addStock: async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()) return res.send({ errors: validationErrors.array() });

            const id = req.params.id;
            await Product.update({ 
                inStock: Sequelize.literal(`inStock + ${req.body.quantity}`),
                updatedBy: req.token.userId,
                updatedAt: new Date() 
            }, 
            { where: { id: id } });
            res.sendStatus(200);
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}