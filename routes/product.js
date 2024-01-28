const express = require('express');
const { userRoleValidator, adminRoleValidator } = require('../lib/auth').middlewares;
const { body } = require('express-validator');
const productController = require('../controllers/product');

const router = express.Router();

router.post(
    '/',
    body('name').notEmpty().isString(),
    body('price').isFloat({ gt: 0 }),
    body('inStock').optional().isInt({ gt: -1 }),
    adminRoleValidator, 
    productController.add
);

router.get('/instock', userRoleValidator, productController.getInStock);

router.get('/', userRoleValidator, productController.getAll);

router.put(
    '/:id/addStock',
    body('quantity').isInt({ gt: 1 }),
    adminRoleValidator,
    productController.addStock
);

router.put(
    '/:id', 
    body('name').optional().notEmpty().isString(),
    body('price').optional().isFloat({ gt: 0 }),
    body('inStock').optional().isInt({ gt: -1 }),
    adminRoleValidator, 
    productController.updateById
);

router.delete('/:id', adminRoleValidator, productController.deleteById);

module.exports = router;