// scripts/sync.js
const { sequelize } = require('../config/database');

// Charge tous les modèles
require('../modules/user/user.model');
require('../modules/exercise/exercise.model');
require('../modules/prompt/prompt.model');
require('../modules/token/token.model');
require('../modules/attachment/attachment.model');

async function syncDatabase() {
  try {
    console.log('🔍 Modèles Sequelize trouvés :', Object.keys(sequelize.models));
    await sequelize.sync({ alter: true });
    console.log('✅ Base de données synchronisée avec succès.');
  } catch (err) {
    console.error('❌ Erreur de synchronisation :', err);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();