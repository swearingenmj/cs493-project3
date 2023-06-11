const jwt = require('jsonwebtoken');

const secretKey = 'secretKey';

exports.generateAuthToken = function (userEmail, admin) {
    const payload = { sub: userEmail, admin: admin };
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}

exports.requireAuthentication = function (req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload.sub;
        req.admin = payload.admin;
        next();
    } catch (err) {
        res.status(401).send({
            error: "Invalid authentication token."
        });
    }
}

exports.adminTestAuthentication = function (req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload.sub;
        req.admin = payload.admin;
        if (req.admin) {
            next();
        } else {
            res.status(403).send({
                error: "Admin access only."
            });
        }
    } catch (err) {
        res.status(401).send({
            error: "Invalid authentication token."
        });
    }
}
