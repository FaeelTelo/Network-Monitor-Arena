const express = require('express');
const { Device } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.send(devices);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).send(device);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).send({ error: 'Dispositivo não encontrado' });
    }
    await device.update(req.body);
    res.send(device);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).send({ error: 'Dispositivo não encontrado' });
    }
    await device.destroy();
    res.send({ message: 'Dispositivo removido com sucesso' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;