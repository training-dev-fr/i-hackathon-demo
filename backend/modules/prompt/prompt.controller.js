const promptService = require('./prompt.service');
const { success, error } = require('../../core/utils/response');
const AdmZip = require('adm-zip');
const fs = require('fs');
const { generateIAResponse } = require('./ia.service');
const { Exercise } = require('../exercise/exercise.model');
const { getRemaining } = require('../token/token.service');

async function submit(req, res) {
  try {
    const { exerciseId, prompt } = req.body;
    const remaining = await getRemaining(req.ip, exerciseId);
    if (remaining.remaining < await promptService.calculateCost(req.body.prompt, req.files)) {
      return res.status(400).json({ message: "Manque de token" })
    }
    for (const file of req.files) {
      const filename = file.originalname.toLowerCase();

      // 🔒 1. Vérifie les fichiers envoyés directement
      if (filename.includes(".env")) {
        fs.unlinkSync(file.path); // supprime le fichier temporaire
        return res.status(200).json({
          error: true,
          hack: true
        });
      }

      // 🔒 2. Vérifie le contenu si c’est une archive ZIP
      if (filename.endsWith(".zip")) {
        const zip = new AdmZip(file.path);
        const entries = zip.getEntries();

        const hasEnvInside = entries.some((entry) =>
          entry.entryName.toLowerCase().includes(".env")
        );

        if (hasEnvInside) {
          fs.unlinkSync(file.path);
          return res.status(200).json({
            error: true,
            hack: true
          });
        }
      }
    }


    if (!exerciseId || !prompt) return error(res, 'Missing parameters', 400);

    const exercise = await Exercise.findOne({
      where: {
        id: exerciseId
      }
    });

    const history = await promptService.getHistory(req.ip,exerciseId);
    let estimate = await promptService.calculateCost(req.body.prompt, req.files)
    if (history.cost + estimate.total > 13000 || estimate.total > exercise.max_tokens) {
      return error(res, "No more token available", 403);
    }

    if (!exercise) {
      return error(res, "Exercise not found or not active", 404);
    }

    const systemMessage = exercise.system
    const iaContent = await generateIAResponse(systemMessage, prompt, req.files);

    let promptData = {
      exercise_id: exerciseId,
      prompt_text: prompt,
      files: req.files,
      iaPrompt: iaContent.content,
      cost: iaContent.cost,
      ip: req.ip
    }
    const result = await promptService.submitPrompt({...promptData,ip: req.ip});

    return success(res, result, 201);
  } catch (err) {
    return error(res, err.message);
  }
}

async function validate(req, res) {
  try {
    const { exerciseId, prompt } = req.body;

    if (!exerciseId || !prompt) return error(res, 'Missing parameters', 400);

    const exercise = await Exercise.findOne({
      where: {
        id: exerciseId,
        is_active: true
      }
    });

    if (!exercise) {
      return error(res, "Exercise not found or not active", 404);
    }



    let promptData = {
      user_id: req.user.id,
      exercise_id: exerciseId,
      prompt_text: prompt,
      files: req.files,
      iaPrompt: null,
      cost: 0,
      validate: true
    }
    const result = await promptService.submitPrompt(promptData);

    return success(res, result, 201);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getHistory(req, res) {
  try {
    const { exerciseId } = req.query;
    const history = await promptService.getHistory(req.user.id, exerciseId);

    return success(res, history);
  } catch (err) {
    return error(res, err.message);
  }
}

async function getCost(req, res) {
  return success(res, await promptService.calculateCost(req.body.prompt, req.files))
}

module.exports = { submit, getHistory, getCost, validate };
