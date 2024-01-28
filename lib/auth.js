const jwt = require('jsonwebtoken');

const middlewares = {
    JWTTokenParser: function(req, res, next) {
        try {
            let header = req.headers['authorization'];
            if(!header) return res.status(400).send('Authorization header is missing');
            header = header.split(' ');
            if(header[0] !== 'Bearer') return res.status(400).send('Token must be of type bearer');
            let token = header[1];
            if(!token) return res.status(400).send('Token is missing');
            let payload = jwt.verify(token, process.env.JWT_SIGNATURE);
            req.token = payload;
            next();
        }
        catch(err) {
            console.log(err);
            if(err.name == 'TokenExpiredError') return res.status(401).send('Token Expired');
            if(err.name == 'JsonWebTokenError') return res.status(401).send('Invalid token');
            res.sendStatus(500);
        }
    },
    userRoleValidator: function(req, res, next) {
        let roles = ['user', 'admin'];
        if(req.token && req.token.userId && roles.includes(req.token.role)) return next();
        return res.status(401).send('Permission denied');
    },
    adminRoleValidator: function(req, res, next) {
        if(req.token && req.token.userId && req.token.role === 'admin') return next();
        return res.status(401).send('Permission denied');
    }
};

module.exports = { middlewares };