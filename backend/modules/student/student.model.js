const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

// student.model.js
  const Student = sequelize.define("Student", {
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },

    school: {
      type: DataTypes.ENUM("EFFICOM", "ESGI"),
      allowNull: false
    },

    year: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },

    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{tableName: "students"});



module.exports = { Student };
