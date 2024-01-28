const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

const OrderDetail = sequelize.define('orderDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    totalPrice: {
        type: DataTypes.DOUBLE
    },
    createdAt: {
        type: DataTypes.DATE
    }
});

module.exports = { OrderDetail };