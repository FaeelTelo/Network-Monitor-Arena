const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Device = require('./device')(sequelize);
const User = require('./user')(sequelize);
const History = require('./history')(sequelize);
const Settings = require('./settings')(sequelize);

module.exports = {
  sequelize,
  Device,
  User,
  History,
  Settings
};