const express = require('express');
const router = express.Router();
const multer = require('multer');              // ✅ import de multer
const path = require('path');
const controller = require('./attachment.controller');
const auth = require('../../core/middleware/auth.middleware');

// ✅ configuration du stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  },
});

const upload = multer({ storage });             // ✅ création du middleware

// ✅ routes utilisant multer
router.post('/:exerciseId', auth, upload.single('file'), controller.upload);
router.get('/:exerciseId', auth, controller.list);
router.delete('/:id', auth, controller.remove);

router.get('/download/:id',  controller.download);

module.exports = router;
