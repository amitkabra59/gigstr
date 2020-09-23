const express = require('express');
require('babel-polyfill');
const cors = require('cors');
const dotenv = require('dotenv');

//Import routes
const adminRoutes = require('./routes/adminRoutes')
const gigstrRoutes = require('./routes/gigstrRoutes')

dotenv.config();

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false })); // why used this?
app.use(express.json());

app.use('/', adminRoutes);
app.use('/', gigstrRoutes);

app.listen(process.env.SERVER_PORT).on('listening', () => {
    console.log(`Listening to ${process.env.SERVER_PORT}`);
});

module.exports = app;