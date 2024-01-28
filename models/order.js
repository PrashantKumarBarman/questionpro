const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const { OrderDetail } = require('./orderDetail');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerId: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE
    }
});

Order.hasMany(OrderDetail);

module.exports = { Order };