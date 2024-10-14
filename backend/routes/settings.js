const express = require('express');
const { Settings } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ whatsappNumber: '', whatsappStatus: 'disconnected' });
    }
    res.send(settings);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      await settings.update(req.body);
    }
    res.send(settings);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;