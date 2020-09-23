const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyAuth');
const Admin = require('../controllers/adminController');
const loginController = require('../controllers/loginController');

router.post('/api/login/:id', express.json({ type: 'application/json' }), loginController);
router.post('/api/admin/task', verifyToken, express.json({ type: 'application/json' }), Admin.createTask);
router.delete('/api/admin/task/:id', verifyToken, Admin.deleteTask);

module.exports = router;