
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {
    errorMessage, status,
} = require('../helpers/status');

dotenv.config();

/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

const verifyToken = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        errorMessage.error = 'Token not provided';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = {
            role: decoded.role,
            id: decoded.id,
            name: decoded.name
        };
        next();
    } catch (error) {
        errorMessage.error = 'Invalid token';
        return res.status(status.unauthorized).send(errorMessage);
    }
};

module.exports = verifyToken;
