const { request } = require('chai');
// 

const pool = require('../../db/dev/pool');
const { createTaskQuery, deleteTaskQuery } = require('../../db/dev/query');

const
    statusCode
        = require('../helpers/status');

pool.on('connect', () => {
    console.log('connected to the db');
});


const createTask = async (request, response) => {
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

const deleteTask = async (request, response) => {
    try {
        const { role } = request.user;
        if (role === 'admin') {
            const { id } = request.params;
            const result = await pool.query(deleteTaskQuery, [id]);
            response.status(statusCode.status.created).send(`Task deleted with id ${id}`);
        }
        else {
            response.status(statusCode.status.unauthorized).send(`Unauthorized`);
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { createTask, deleteTask };