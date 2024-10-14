const express = require('express');
const { History } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const history = await History.findAll({
      order: [['offlineTime', 'DESC']],
      limit: 1000 // Limita a 1000 registros para evitar sobrecarga
    });
    res.send(history);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;