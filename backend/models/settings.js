const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Settings = sequelize.define('Settings', {
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    whatsappStatus: {
      type: DataTypes.ENUM('connected', 'disconnected'),
      defaultValue: 'disconnected'
    }
  });

  return Settings;
};