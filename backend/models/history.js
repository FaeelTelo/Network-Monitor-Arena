const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const History = sequelize.define('History', {
    device: {
      type: DataTypes.STRING,
      allowNull: false
    },
    offlineTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    onlineTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notificationTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notificationStatus: {
      type: DataTypes.ENUM('success', 'error'),
      allowNull: true
    }
  });

  return History;
};