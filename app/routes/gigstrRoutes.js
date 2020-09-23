const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyAuth');
const gigstrController = require('../controllers/gigstrController');

// Routes for Gigstr
router.get('/api/tasks', verifyToken, gigstrController.taskList);
router.put('/api/task/:id/assign', verifyToken, gigstrController.assignTask);
router.put('/api/task/:id/done', verifyToken, gigstrController.markCompleted);

module.exports = router;