import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  ip: string;
  type: string;
}

const fetchDevices = async (): Promise<Device[]> => {
  const response = await axios.get('http://172.16.0.5/api/devices');
  return response.data;
};

const Devices: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const { data: devices, isLoading, error } = useQuery('devices', fetchDevices);

  const createDevice = useMutation(
    (newDevice: Omit<Device, 'id'>) => axios.post('http://172.16.0.5/api/devices', newDevice),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devices');
        setShowForm(false);
      },
    }
  );

  const updateDevice = useMutation(
    (updatedDevice: Device) => axios.put(`http://172.16.0.5/api/devices/${updatedDevice.id}`, updatedDevice),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devices');
        setEditingDevice(null);
      },
    }
  );

  const deleteDevice = useMutation(
    (id: number) => axios.delete(`http://172.16.0.5/api/devices/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devices');
      },
    }
  );

  const duplicateDevice = useMutation(
    (device: Omit<Device, 'id'>) => axios.post('http://172.16.0.5/api/devices', device),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devices');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const deviceData = {
      name: formData.get('name') as string,
      ip: formData.get('ip') as string,
      type: formData.get('type') as string,
    };

    if (editingDevice) {
      updateDevice.mutate({ ...deviceData, id: editingDevice.id });
    } else {
      createDevice.mutate(deviceData);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os dispositivos</div>;

  const filteredDevices = devices?.filter(
    (device) => device.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dispositivos</h2>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Filtrar por tipo..."
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-2 rounded flex items-center"
        >
          <Plus size={18} className="mr-1" /> Adicionar Dispositivo
        </button>
      </div>
      {(showForm || editingDevice) && (
        <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
          <input
            name="name"
            placeholder="Nome"
            defaultValue={editingDevice?.name}
            className="mb-2 p-2 border rounded w-full"
            required
          />
          <input
            name="ip"
            placeholder="IP"
            defaultValue={editingDevice?.ip}
            className="mb-2 p-2 border rounded w-full"
            required
          />
          <select
            name="type"
            defaultValue={editingDevice?.type}
            className="mb-2 p-2 border rounded w-full"
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="Access Point">Access Point</option>
            <option value="Catracas e Faciais">Catracas e Faciais</option>
            <option value="Câmeras IP">Câmeras IP</option>
            <option value="Impressoras">Impressoras</option>
            <option value="Link">Link</option>
            <option value="NVR">NVR</option>
            <option value="Relógio de Ponto">Relógio de Ponto</option>
            <option value="Servidores">Servidores</option>
            <option value="Switch">Switch</option>
            <option value="Switch PoE">Switch PoE</option>
            <option value="VPN">VPN</option>
          </select>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {editingDevice ? 'Atualizar' : 'Adicionar'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingDevice(null);
            }}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
        </form>
      )}
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">IP</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices?.map((device) => (
            <tr key={device.id} className="border-b">
              <td className="p-2">{device.name}</td>
              <td className="p-2">{device.ip}</td>
              <td className="p-2">{device.type}</td>
              <td className="p-2">
                <button
                  onClick={() => setEditingDevice(device)}
                  className="mr-2 text-blue-500"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteDevice.mutate(device.id)}
                  className="mr-2 text-red-500"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => {
                    const { id, ...deviceWithoutId } = device;
                    duplicateDevice.mutate(deviceWithoutId);
                  }}
                  className="text-green-500"
                >
                  <Copy size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Devices;