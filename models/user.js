const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const { Order } = require('./order');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE
    }
},
{
    indexes: [
        { fields: ['email'] }
    ]
});

User.hasMany(Order, { foreignKey: 'customerId' });

/**
 * This function sets up two users for testing the application, one with role user and another with role admin to do testing
 */
async function init() {
    let date = new Date();
    let users = await User.findAll();
    // If no users are present already then we create two users that can be used for testing
    if(users.length === 0) {
        users = [
            {
                name: "admin", 
                email: "admin@test.com", 
                password: "$argon2id$v=19$m=65536,t=3,p=4$NkIu3dHu2eaYOb6FK2f/Uw$Hu+jEZE2Q0dyBlyMEM6vwD+YwB+xHCk4JH8bffSa0VQ", 
                role: "admin",
                createdOn: date
            },
            {
                name: "user", 
                email: "user@test.com", 
                password: "$argon2id$v=19$m=65536,t=3,p=4$h1nndzhMp+4/jIlq160fDQ$eyuRled/q7gcNoDORaz4OwHK00gkcW+Nkyy2BDT1Fd4", 
                role: "user",
                createdOn: date 
            }
        ];
        await User.bulkCreate(users);
    }
}

module.exports = { User, init };