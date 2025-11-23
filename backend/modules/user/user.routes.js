const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const auth = require('../../core/middleware/auth.middleware');

// Routes protégées par JWT
router.get('/', auth, controller.getAll);
router.get('/:id', auth, controller.getById);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
