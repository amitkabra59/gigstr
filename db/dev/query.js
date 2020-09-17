const pool = require('./pool');

pool.on('connect', () => {
    console.log('connected to the db');
});

const getTasks = (request, response) => {
    pool.query('SELECT * FROM users.tasks;', (error, results) => {
        if (error) {
            console.log(error.message)
            throw error
        }
        response.status(200).json(results.rows)
    })
};

const createTasks = (request, response) => {
    const { id, description, status, gigstr_id } = request.body

    pool.query('INSERT INTO users.tasks (id, description, status, gigstr_id) VALUES ($1, $2, $3,$4);', [id, description, status, gigstr_id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Task added`)
    })
}

module.exports = { getTasks, createTasks }