const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({ ...user.toJSON(), password: undefined });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }
    if (user.name === 'admin' && req.body.name !== 'admin') {
      return res.status(400).send({ error: 'Não é permitido alterar o nome do usuário admin' });
    }
    await user.update(req.body);
    res.send({ ...user.toJSON(), password: undefined });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' });
    }
    if (user.name === 'admin') {
      return res.status(400).send({ error: 'Não é permitido excluir o usuário admin' });
    }
    await user.destroy();
    res.send({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;