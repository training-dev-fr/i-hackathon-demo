const OpenAI = require("openai");
require('dotenv').config();
const fs = require('fs');
const { isText, isBinary } = require("istextorbinary");

const client = new OpenAI({
  apiKey: process.env.IA_KEY,
});

exports.generateIAResponse = async (systemMessage, prompt, attachments = []) => {
  try {

    const uploadedFiles = [];
    const contentPayload = [
      { type: "text", text: prompt }
    ];

    for (const file of attachments) {
      const buffer = fs.readFileSync(file.path);

      if (isText(file.originalname, buffer)) {
        // 🔵 Fichier texte → injecté directement dans la requête
        const content = buffer.toString("utf8");

        contentPayload.push({
          type: "text",
          text: `\n${file.originalname}:\n${content}\n`
        });

      } else {
        // 🟠 Fichier binaire → upload requis
        const uploaded = await client.files.create({
          file: fs.createReadStream(file.path),
          purpose: "assistants"
        });

        uploadedFiles.push(uploaded.id);
      }
    }

    // Ajouter tous les fichiers uploadés
    for (const fileId of uploadedFiles) {
      contentPayload.push({
        type: "file",
        file_id: fileId
      });
    }

    // Appel final IA
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: contentPayload }
      ]
    });

    return {content: completion.choices[0].message.content, cost: completion.usage.total_tokens};

  } catch (e) {
    console.error("Erreur IA :", e);
  }
};
