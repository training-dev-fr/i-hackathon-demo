const express = require('express');
const router = express.Router();
const controller = require('./student.controller');


router.post("/", controller.create);
router.get("/draw", controller.generateAndSaveGroups);
router.get('/reinit', controller.reinit);
router.put("/:id",controller.saveGroupName);

module.exports = router;