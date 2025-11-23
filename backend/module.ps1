param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName
)

# Dossier du module
$modulePath = "modules\$ModuleName"

# Création du dossier principal s'il n'existe pas
if (-not (Test-Path $modulePath)) {
    New-Item -ItemType Directory -Force -Path $modulePath | Out-Null
    Write-Host "✅ Dossier créé : $modulePath"
} else {
    Write-Host "⚠️ Le module '$ModuleName' existe déjà."
}

# Liste des fichiers à créer
$files = @(
    "$ModuleName.controller.js",
    "$ModuleName.model.js",
    "$ModuleName.routes.js",
    "$ModuleName.service.js"
)

# Création des fichiers vides avec en-têtes par défaut
foreach ($file in $files) {
    $filePath = Join-Path $modulePath $file

    if (-not (Test-Path $filePath)) {
        switch -Wildcard ($file) {
            "*.controller.js" {
                @"
const { success, error } = require('../../core/utils/response');
const ${ModuleName}Service = require('./${ModuleName}.service');

// Exemple de fonction
async function getAll(req, res) {
  try {
    const data = await ${ModuleName}Service.getAll();
    return success(res, data);
  } catch (err) {
    return error(res, err.message);
  }
}

module.exports = { getAll };
"@ | Out-File $filePath -Encoding UTF8
            }
            "*.model.js" {
                @"
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ${ModuleName^} = sequelize.define('${ModuleName^}', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  // TODO: ajouter les champs du modèle
});

module.exports = { ${ModuleName^} };
"@ | Out-File $filePath -Encoding UTF8
            }
            "*.routes.js" {
                @"
const express = require('express');
const router = express.Router();
const controller = require('./${ModuleName}.controller');
const auth = require('../../core/middleware/auth.middleware');

router.get('/', auth, controller.getAll);

module.exports = router;
"@ | Out-File $filePath -Encoding UTF8
            }
            "*.service.js" {
                @"
async function getAll() {
  return []; // TODO: implémenter la logique du module
}

module.exports = { getAll };
"@ | Out-File $filePath -Encoding UTF8
            }
        }
        Write-Host "✅ Fichier créé : $filePath"
    } else {
        Write-Host "⚠️ Le fichier existe déjà : $filePath"
    }
}

Write-Host "🚀 Module '$ModuleName' généré avec succès."