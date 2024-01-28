const express = require('express');
const { userRoleValidator } = require('../lib/auth').middlewares;
const { body } = require('express-validator');
const orderController = require('../controllers/order');

const router = express.Router();

router.post(
    '/',
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isInt({ gt: 0 }),
    body('items.*.quantity').isInt({ gt: 0 }),
    userRoleValidator, 
    orderController.add
);

router.get('/', userRoleValidator, orderController.getAll);

module.exports = router;