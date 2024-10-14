const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Settings } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

let client;

router.post('/connect', auth, async (req, res) => {
  try {
    if (client) {
      return res.status(400).send({ error: 'WhatsApp já está conectado' });
    }

    client = new Client();

    client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      res.send({ qr });
    });

    client.on('ready', async () => {
      await Settings.update({ whatsappStatus: 'connected' }, { where: {} });
      console.log('WhatsApp client is ready!');
    });

    client.initialize();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/disconnect', auth, async (req, res) => {
  try {
    if (!client) {
      return res.status(400).send({ error: 'WhatsApp não está conectado' });
    }

    await client.destroy();
    client = null;
    await Settings.update({ whatsappStatus: 'disconnected' }, { where: {} });
    res.send({ message: 'WhatsApp desconectado com sucesso' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;