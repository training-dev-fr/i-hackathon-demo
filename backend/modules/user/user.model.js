const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/database');
const {Student} = require('./../student/student.model');
const { Prompt } = require('../prompt/prompt.model');


const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: true },
  password: { type: DataTypes.STRING(511), allowNull: false },
  role: { type: DataTypes.ENUM('student', 'admin'), defaultValue: 'student' }
},{tableName: "users"});

// Hash du mot de passe avant création
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

  User.hasMany(Student, {
    foreignKey: "groupId",
    as: "students",
    onDelete: "CASCADE"
  });
    User.hasMany(Prompt, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = { User };
