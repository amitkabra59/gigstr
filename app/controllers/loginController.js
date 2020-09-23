// const { request, response } = require('../../app/server');
const jwt = require('jsonwebtoken')
const pool = require('../../db/dev/pool');
const { userInfoQuery } = require('../../db/dev/query');

const
    { status }
        = require('../helpers/status');

pool.on('connect', () => {
    console.log('connected to the db');
});

module.exports = (request, response) => {
    const id = request.params.id;
    pool.query(userInfoQuery, [id], (error, results) => {
        if (error) {
            console.error(error);
            return response.status(status.error).send('Internal server error.');
        }
        if (results.rowCount === 1) {
            const { name, role } = results.rows[0];
            const token = jwt.sign({ id, name, role }, process.env.TOKEN_SECRET);
            response.header({ 'auth-token': token });
            return response.status(status.success).send(`User logged in with id: ${id}`);
        }
        else {
            return response.status(status.bad).send('Bad request, the user does not exist!');
        }
    });
}
