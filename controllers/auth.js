const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const { User } = require('../models/user');

module.exports = {
    login: async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if(!validationErrors.isEmpty()) return res.send({ errors: validationErrors.array() });

            const user = await User.findOne({
                where: { email: req.body.email }
            });
            if(!user) return res.status(400).send("No user found");
            if(!(await argon2.verify(user['password'], req.body.password))) return res.status(400).send("Username and password do not match");

            res.json({
                "token": jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SIGNATURE, { expiresIn: '1d' })
            });
        }
        catch(err) {
            console.log(err);
            res.sendStatus(500);
        }     
    }
}