const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');
const auth = require('../../core/middleware/auth.middleware');
const adminOnly = require('../../core/middleware/admin.middleware');

// Toutes ces routes sont réservées à l'admin
router.get('/stats', auth, adminOnly, controller.getStats);
router.get('/groups', auth, adminOnly, controller.getGroups);
router.get('/groups/:exerciceId', auth, adminOnly, controller.getGroupProgress);
router.get('/groups/:exerciceId/:groupId', auth, adminOnly, controller.getOneGroupProgress);
module.exports = router;
