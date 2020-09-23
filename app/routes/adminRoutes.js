const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyAuth');
const adminController = require('../controllers/adminController');
const loginController = require('../controllers/loginController');

router.post('/api/login/:id', verifyToken, express.json({ type: 'application/json' }), loginController);
router.post('/api/admin/task', verifyToken, express.json({ type: 'application/json' }), adminController);

module.exports = router;