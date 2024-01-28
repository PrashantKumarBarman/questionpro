const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.post(
    '/login',
    body('email').isEmail(),
    body('password').notEmpty().isLength({ max: 100 }),
    authController.login
);

module.exports = router;