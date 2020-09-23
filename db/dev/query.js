const pool = require('./pool');

pool.on('connect', () => {
    console.log('connected to the db');
});

const userInfoQuery = 'SELECT * FROM users.users WHERE id = $1;';
const tasksListQuery = 'SELECT * FROM users.tasks ORDER BY id;';
const completedTasksQuery = 'SELECT * FROM users.tasks WHERE status = $1 ORDER BY id;';
const createTaskQuery = 'INSERT INTO users.tasks (id, description, status, assignee_id) VALUES ($1, $2, $3,$4);';
const assignTaskQuery = 'UPDATE users.tasks SET status = $2, assignee_id = $3 WHERE id = $1;';
const updateTaskQuery = 'UPDATE users.tasks SET status = $2 WHERE id = $1;';
const alreadyAssignedTask = 'SELECT * FROM users.tasks WHERE assignee_id = $1;';
const deleteTaskQuery = 'DELETE FROM users.tasks WHERE id = $1;';

// const getCompletedTasks = (request, response) => {
//     const status = "done";
//     pool.query('SELECT * FROM users.tasks where status = $1 ORDER BY id;', [status], (error, results) => {
//         if (error) {
//             console.log(error.message)
//             throw error
//         }
//         response.status(status.success).json(results.rows)
//     })
// };

// const getNewTasks = (request, response) => {
//     const status = "new";
//     pool.query('SELECT * FROM users.tasks where status = $1 ORDER BY id;', [status], (error, results) => {
//         if (error) {
//             console.log(error.message)
//             throw error
//         }
//         response.status(status.success).json(results.rows)
//     })
// };

module.exports = {
    userInfoQuery,
    tasksListQuery,
    completedTasksQuery,
    createTaskQuery,
    assignTaskQuery,
    updateTaskQuery,
    alreadyAssignedTask,
    deleteTaskQuery
};