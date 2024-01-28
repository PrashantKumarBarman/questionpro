const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const { User } = require('./user');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.DOUBLE
    },
    inStock: {
        type: Sequelize.INTEGER
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    },
    createdBy: {
        type: Sequelize.INTEGER
    },
    updatedBy: {
        type: Sequelize.INTEGER
    }
},
{
    indexes: [
        { fields: ['name'] }
    ]
});

Product.belongsTo(User, { foreignKey: 'createdBy', onDelete: 'SET NULL' });
Product.belongsTo(User, { foreignKey: 'updatedBy', onDelete: 'SET NULL' });

module.exports = { Product };