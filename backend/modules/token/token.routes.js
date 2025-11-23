const express = require('express');
const router = express.Router();
const controller = require('./token.controller');
const auth = require('../../core/middleware/auth.middleware');
const adminOnly = require('../../core/middleware/admin.middleware');

// routes utilisateur
router.get('/remaining', controller.getRemaining);

// routes admin
router.post('/admin/tokens/reset', auth, adminOnly, controller.resetForGroup);

module.exports = router;
