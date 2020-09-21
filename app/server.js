const express = require('express');
require('babel-polyfill');
const cors = require('cors');
const db = require('../db/dev/query')

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/tasks', db.getTasks);
app.post('/api/tasks', express.json({ type: 'application/json' }), db.createTasks);
app.put('/api/tasks/:id/assign/', db.assignTask);
app.put('/api/tasks/:id/done/', db.statusToDone);
app.post('/api/login/:id', db.login);



app.listen(process.env.SERVER_PORT).on('listening', () => {
    console.log(`Listening to ${process.env.SERVER_PORT}`);
});


module.exports = app;