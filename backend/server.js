const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http')
const { sequelize } = require('./config/database');
const {initSocket} = require('./modules/socket/index');

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173','https://ihackathon.info/'], // ton front en dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

const authRoutes = require('./modules/auth/auth.routes');
const exerciseRoutes = require('./modules/exercise/exercise.routes');
const promptRoutes = require('./modules/prompt/prompt.routes');
const tokenRoutes = require('./modules/token/token.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const userRoutes = require('./modules/user/user.routes');
const attachmentRoutes = require('./modules/attachment/attachment.routes');
const studentRoutes = require('./modules/student/student.route');

app.use('/api/exercises', exerciseRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/student', studentRoutes);

const path = require('path');
app.use('/uploads', (req, res, next) => {
  res.setHeader('Content-Disposition', 'attachment');
  next();
}, express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
initSocket(server);


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');
  } catch (err) {
    console.log(JSON.stringify(err));
    console.error('❌ Database connection error:', err.message);
  }
  console.log(`🚀 Server running on port ${PORT}`);
});