import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Device {
  id: number;
  name: string;
  ip: string;
  type: string;
  status: 'online' | 'offline';
}

const fetchDevices = async (): Promise<Device[]> => {
  const response = await axios.get('http://172.16.0.5/api/devices');
  return response.data;
};

const Dashboard: React.FC = () => {
  const { data: devices, isLoading, error } = useQuery('devices', fetchDevices);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os dispositivos</div>;

  const deviceTypes = [
    'Access Point',
    'Catracas e Faciais',
    'Câmeras IP',
    'Impressoras',
    'Link',
    'NVR',
    'Relógio de Ponto',
    'Servidores',
    'Switch',
    'Switch PoE',
    'VPN',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deviceTypes.map((type) => (
          <div key={type} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{type}</h3>
            <ul className="space-y-2">
              {devices
                ?.filter((device) => device.type === type)
                .map((device) => (
                  <li
                    key={device.id}
                    className={`p-2 rounded ${
                      device.status === 'online' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    <span className="font-medium">{device.name}</span> - {device.ip}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;