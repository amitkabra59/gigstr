
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
        return res.status(400).send('Token not provided');
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = {
            role: decoded._id,
        };
        next();
    } catch (error) {
        return res.status(401).send('Invalid token');
    }
};

module.exports = verifyToken;
