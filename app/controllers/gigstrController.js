const pool = require('../../db/dev/pool');
const { tasksListQuery, assignTaskQuery, updateTaskQuery, alreadyAssignedTask } = require('../../db/dev/query');

const
    { status }
        = require('../helpers/status');

pool.on('connect', () => {
    console.log('connected to the db');
});

const taskList = async (request, response) => {
    try {
        const result = await pool.query(tasksListQuery);
        return response.status(status.success).json(result.rows)
    }
    catch (error) {
        console.log(error);
    }

};

const assignTask = (request, response) => {
    const id = request.params.id;
    const role = request.user.role;
    const userId = request.user.id;
    if (role === 'gigstr') {
        pool.query(alreadyAssignedTask, [userId], (error, results) => {
            if (!error) {
                let count = 0;
                if (results.rowCount > 0) {
                    for (let i = 0; i < results.rowCount; i++) {
                        if (results.rows[i]['status'] === 'assigned') {
                            count = count + 1;
                            response.status(status.success).send(`Please complete the assigned task first`);
                            break;
                        }
                    }
                    if (count === 0) {
                        pool.query(
                            assignTaskQuery,
                            [id, taskStatus = 'assigned', userId],
                            (error, results) => {
                                if (error) {
                                    throw error
                                }
                                response.status(status.success).send(`Task with ID: ${id} is assigned `);
                            }
                        );
                    }
                }
                else {
                    pool.query(
                        assignTaskQuery,
                        [id, taskStatus = 'assigned', userId],
                        (error, results) => {
                            if (error) {
                                throw error
                            }
                            response.status(status.success).send(`Task with ID: ${id} is assigned `);
                        }
                    );
                }
            }
            else
                response.status(status.error).send(error);
        });
    }
    else
        response.status(status.unauthorized).send("Unauthorised");
}

const markCompleted = (request, response) => {
    const id = request.params.id;
    const role = request.user.role;
    if (role === 'gigstr') {
        pool.query(
            updateTaskQuery,
            [id, taskStatus = 'done'],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(status.success).send(`Task modified with ID: ${id} `)
            }
        );
    }
    else
        response.status(status.unauthorized).send("Unauthorized");
}

module.exports = { taskList, assignTask, markCompleted }