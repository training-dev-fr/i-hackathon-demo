const service = require('./attachment.service');
const { success, error } = require('../../core/utils/response');

const path = require('path');
const fs = require('fs');
const { Attachment } = require('./attachment.model');

async function upload(req, res) {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const attachment = await service.create(req.params.exerciseId, req.file);
    return success(res, attachment);
  } catch (err) {
    return error(res, err.message);
  }
}

async function list(req, res) {
  try {
    const attachments = await service.getAll(req.params.exerciseId);
    return success(res, attachments);
  } catch (err) {
    return error(res, err.message);
  }
}

async function remove(req, res) {
  try {
    const result = await service.remove(req.params.id);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
}


async function download(req, res) {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).send('File not found');

    const fullPath = path.join(__dirname, '../../', attachment.path);

    if (!fs.existsSync(fullPath)) return res.status(404).send('File not found');

    // force le téléchargement avec le nom d'origine
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
    res.setHeader('Content-Type', attachment.type || 'application/octet-stream');

    // stream propre sans renommer
    return res.sendFile(fullPath);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { upload, list, remove, download };
