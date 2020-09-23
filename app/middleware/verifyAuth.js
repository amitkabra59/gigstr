
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
    let token = req.header('auth-token');
    if (!token) {
        errorMessage.error = 'Token not provided';
        return res.status(status.unauthorized).send(errorMessage);
    }
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length).trimLeft();
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

const signAccessToken = async (payload) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.TOKEN_SECRET;
        const options = {
            expiresIn: 60,
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err);
                reject('Internal Server error');
            }
            resolve(token);

        });
    });
}

const signRefreshToken = async (payload) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.REFRESH_SECRET;
        const options = {
            expiresIn: '1y',
        };
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err);
                reject('Internal Server error');
            }
            resolve(token);
        });
    });
}

const verifyRefreshToken = async (request, response, next) => {
    try {
        let refreshToken = request.header('refresh-token');
        if (!refreshToken) {
            response.status(status.bad).send('Bad request');
        }
        if (refreshToken.startsWith('Bearer ')) {
            // Remove Bearer from string
            refreshToken = refreshToken.slice(7, refreshToken.length).trimLeft();
        }
        try {
            const secret = process.env.REFRESH_SECRET;
            const decoded = jwt.verify(refreshToken, secret);
            const { id, name, role } = decoded;

            const accessToken = await signAccessToken({ id, name, role });
            const refreshTokenGenerated = await signRefreshToken({ id, name, role });
            response.header({ 'auth-token': 'Bearer ' + accessToken, 'refresh-token': 'Bearer ' + refreshTokenGenerated });
            response.status(status.success).send('Token refreshed');
            next();
        } catch (error) {
            errorMessage.error = 'Invalid token';
            return res.status(status.unauthorized).send(errorMessage);
        }
    }
    catch (error) {
        next(error);
    }
}

module.exports = { verifyToken, signAccessToken, signRefreshToken, verifyRefreshToken };
