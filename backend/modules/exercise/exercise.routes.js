const express = require('express');
const router = express.Router();
const controller = require('./exercise.controller');

router.get('/demo', controller.getDemo);
router.get('/:id', controller.getOne);


module.exports = router;
