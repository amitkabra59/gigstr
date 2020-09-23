// 

const pool = require('../../db/dev/pool');
const { createTaskQuery } = require('../../db/dev/query');

const
    statusCode
        = require('../helpers/status');

pool.on('connect', () => {
    console.log('connected to the db');
});


module.exports = async (request, response) => {
    try {
        const userRole = request.user.role;
        if (userRole === 'admin') {
            const [{ id, description, status, assignee_id }] = request.body

            const result = await pool.query(createTaskQuery, [id, description, status, assignee_id]);
            response.status(statusCode.status.created).send(`Task added with id ${id}`);
        }
        else {
            response.status(statusCode.status.unauthorized).send(`Unauthorized`);
        }

    }
    catch (error) {
        console.log(error);
    }
}
