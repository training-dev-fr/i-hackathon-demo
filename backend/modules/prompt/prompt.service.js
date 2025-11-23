const { Prompt } = require('./prompt.model');
const path = require('path');
const fs = require('fs');
const { encoding_for_model } = require('tiktoken');
const mammoth = require("mammoth");
const pdfjs = require("pdfjs-dist/build/pdf.js");
const enc = encoding_for_model("gpt-4o-mini"); // Compatible GPT-4.1 / mini / 4o

/**
 * Estime le nombre de tokens d'un fichier selon son type.
 * @param {string} filePath - chemin absolu ou relatif du fichier
 * @returns {Promise<{name:string,type:string,tokens:number,method:string}>}
 */
async function estimateFileTokens(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath);
  const mimeGuess = guessMimeType(ext);

  try {
    if (isPlainText(ext, name)) {
      // Lecture directe
      const content = fs.readFileSync(filePath, "utf-8");
      const tokens = enc.encode(content).length;
      return { name, type: "text", tokens, method: "exact" };
    }

    if (ext === ".pdf") {
      const pdf = await pdfjs.getDocument(new Uint8Array(fs.readFileSync(filePath))).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(it => it.str).join(" ") + "\n";
      }
      const tokens = enc.encode(text || "").length;
      return { name, type: "pdf", tokens, method: "exact" };
    }

    if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      const tokens = enc.encode(data.value || "").length;
      return { name, type: "docx", tokens, method: "exact" };
    }

    if (mimeGuess.startsWith("image/")) {
      // Image → estimation (~250 tokens/image)
      return { name, type: "image", tokens: 250, method: "approx" };
    }

    // fallback pour tout autre fichier binaire (archive, exécutable, etc.)
    const size = fs.statSync(filePath).size;
    const approx = Math.ceil(size / 6); // ~150 tokens par Ko
    return { name, type: "binary", tokens: approx, method: "approx" };

  } catch (err) {
    console.error(`Erreur analyse fichier ${name}:`, err.message);
    return { name, type: "unknown", tokens: 0, method: "error" };
  }
}

/** Types considérés comme textuels */
function isPlainText(ext, name) {
  const textExts = [
    ".txt", ".md", ".json", ".js", ".jsx", ".ts", ".tsx",
    ".html", ".htm", ".css", ".scss", ".yml", ".yaml",
    ".env", ".ini", ".xml", ".sql", ".Dockerfile", ".cdi",
    ".sh", ".bat", ".py", ".java", ".c", ".cpp", ".h"
  ];
  return textExts.includes(ext) || name === "Dockerfile";
}

/** Simple mapping extension → mime */
function guessMimeType(ext) {
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] || "application/octet-stream";
}

async function calculateCost(text, files) {
  const tokenText = enc.encode(text).length;
  const estimate = { text: tokenText, files: [], total: tokenText + 250 };
  if (files) {
    for (let file of files) {
      const tokenFile = await estimateFileTokens(file.path);
      estimate.files.push(tokenFile);
      estimate.total += tokenFile.tokens
    }
  }

  return estimate;
}

async function submitPrompt({ user_id, exercise_id, prompt_text, files, iaPrompt, cost, validate,ip }) {
  const attachments = [];

  if (files && files.length > 0) {
    for (const file of files) {
      attachments.push({
        originalName: file.originalname,
        storedAs: file.filename,
        path: `/uploads/${file.filename}`
      });
    }
  }

  const prompt = await Prompt.create({
    user_id,
    exercise_id,
    prompt_text,
    attachments,
    iaPrompt,
    cost,
    validate,
    ip
  });

  return prompt;
}

async function getHistory(ip, exercise_id) {
  return Prompt.findAll({
    where: { ip, exercise_id },
    order: [['created_at', 'ASC']]
  });
}

module.exports = { submitPrompt, getHistory, calculateCost };
