const express = require('express');
const router = express.Router();
const { createInstance, getInstances, deleteInstance } = require('../controllers/instanceController');
const authMiddleware = require('../middleware/authMiddleware');

// All these routes are protected
router.use(authMiddleware);

router.route('/')
    .post(createInstance)
    .get(getInstances);
    
router.route('/:id')
    .delete(deleteInstance);
    // GET single and PUT (update) can be added here later

module.exports = router;
