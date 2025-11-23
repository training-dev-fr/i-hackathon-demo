const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const controller = require('./prompt.controller');

// Dossier d’upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads-demo/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/submit', upload.any(), controller.submit);
router.get('/history', controller.getHistory);
router.post('/cost', upload.any(), controller.getCost);

module.exports = router;
