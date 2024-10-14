const { Device, History, Settings } = require('./models');
const { Client } = require('whatsapp-web.js');
const ping = require('ping');

const checkDevices = async () => {
  const devices = await Device.findAll();
  const settings = await Settings.findOne();

  for (const device of devices) {
    const res = await ping.promise.probe(device.ip);
    const newStatus = res.alive ? 'online' : 'offline';

    if (newStatus !== device.status) {
      await device.update({ status: newStatus });

      if (newStatus === 'offline') {
        const history = await History.create({
          device: device.name,
          offlineTime: new Date(),
        });

        if (settings.whatsappStatus === 'connected' && client) {
          try {
            await client.sendMessage(settings.whatsappNumber, 
              `Dispositivo ${device.name} (${device.ip}) está offline.`);
            await history.update({ 
              notificationTime: new Date(),
              notificationStatus: 'success'
            });
          } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            await history.update({ 
              notificationTime: new Date(),
              notificationStatus: 'error'
            });
          }
        }
      } else {
        const lastOfflineRecord = await History.findOne({
          where: { device: device.name, onlineTime: null },
          order: [['offlineTime', 'DESC']]
        });

        if (lastOfflineRecord) {
          await lastOfflineRecord.update({ onlineTime: new Date() });
        }
      }
    }
  }
};

const startMonitoring = () => {
  setInterval(checkDevices, 60000); // Verifica a cada 1 minuto
};

module.exports = { startMonitoring };