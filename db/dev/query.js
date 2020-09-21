const pool = require('./pool');
const jwt = require('jsonwebtoken');

pool.on('connect', () => {
    console.log('connected to the db');
});

const getTasks = (request, response) => {
    pool.query('SELECT * FROM users.tasks ORDER BY id;', (error, results) => {
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
};

const assignTask = (request, response) => {
    const id = request.params.id;
    pool.query(
        'UPDATE users.tasks SET status = $2 where id = $1;',
        [id, taskStatus = 'assigned'],
        (error, results) => {
            console.log(results)
            if (error) {
                throw error
            }
            response.status(200).send(`Task modified with ID: ${id} `);
        }
    );
};

const statusToDone = (request, response) => {
    const id = request.params.id;
    pool.query(
        'UPDATE users.tasks SET status = $2 where id = $1',
        [id, taskStatus = 'done'],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Task modified with ID: ${id} `)
        }
    );
}

const login = (request, response) => {
    const id = request.params.id;
    pool.query('SELECT * FROM users.users where id = $1;', [id], (error, results) => {
        if (error) {
            console.error(error);
            return response.status(500).send('Internal server error.');
        }
        if (results.rowCount === 1) {
            console.log(results)
            const token = jwt.sign({ _id: results.rows[0].role }, process.env.TOKEN_SECRET);
            response.header({ 'auth-token': token });
            return response.status(200).send(`User logged in with id: ${id}`);
        }
        else {
            return response.status(400).send('Bad request, the user does not exist!');
        }
    });
}


module.exports = { getTasks, createTasks, assignTask, statusToDone, login }