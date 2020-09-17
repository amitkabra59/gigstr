const express = require('express');
require('babel-polyfill');
const cors = require('cors');
const db = require('../db/dev/query')

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());

// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/tasks', db.getTasks);
app.post('/tasks', express.json({ type: 'application/json' }), db.createTasks)


app.listen(process.env.SERVER_PORT).on('listening', () => {
    console.log(`Listening to ${process.env.SERVER_PORT}`);
});


module.exports = app;