const pool = require('../../db/dev/pool');
const { userInfoQuery } = require('../../db/dev/query');
const { signAccessToken, signRefreshToken, verifyToken } = require('../middleware/verifyAuth');

const
    { status }
        = require('../helpers/status');

pool.on('connect', () => {
    console.log('connected to the db');
});

module.exports = (request, response) => {
    const id = request.params.id;
    pool.query(userInfoQuery, [id], async (error, results) => {
        if (error) {
            console.error(error);
            return response.status(status.error).send('Internal server error.');
        }
        if (results.rowCount === 1) {
            const { name, role } = results.rows[0];
            const token = await signAccessToken({ id, name, role });
            const refreshToken = await signRefreshToken({ id, name, role });
            response.header({ 'auth-token': 'Bearer ' + token, 'refresh-token': 'Bearer ' + refreshToken });
            return response.status(status.success).send(`User logged in with id: ${id}`);
        }
        else {
            return response.status(status.bad).send('Bad request, the user does not exist!');
        }
    });
}
