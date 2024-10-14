import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Phone, QrCode } from 'lucide-react';

interface Settings {
  whatsappNumber: string;
  whatsappStatus: 'connected' | 'disconnected';
}

const fetchSettings = async (): Promise<Settings> => {const response = await axios.get('http://172.16.0.5/api/settings');
  return response.data;
};

const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const [showQRCode, setShowQRCode] = useState(false);

  const { data: settings, isLoading, error } = useQuery('settings', fetchSettings);

  const updateSettings = useMutation(
    (newSettings: Partial<Settings>) => axios.put('http://172.16.0.5/api/settings', newSettings),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('settings');
      },
    }
  );

  const connectWhatsapp = useMutation(
    () => axios.post('http://172.16.0.5/api/whatsapp/connect'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('settings');
        setShowQRCode(true);
      },
    }
  );

  const disconnectWhatsapp = useMutation(
    () => axios.post('http://172.16.0.5/api/whatsapp/disconnect'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('settings');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const whatsappNumber = formData.get('whatsappNumber') as string;
    updateSettings.mutate({ whatsappNumber });
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar as configurações</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Configurações</h2>
      <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label htmlFor="whatsappNumber" className="block mb-2">
            Número do WhatsApp Business
          </label>
          <input
            id="whatsappNumber"
            name="whatsappNumber"
            type="text"
            defaultValue={settings?.whatsappNumber}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Salvar
        </button>
      </form>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Status do WhatsApp</h3>
        <p className="mb-4">
          <Phone size={18} className="inline-block mr-2" />
          Status:{' '}
          <span
            className={`font-bold ${
              settings?.whatsappStatus === 'connected' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {settings?.whatsappStatus === 'connected' ? 'Conectado' : 'Desconectado'}
          </span>
        </p>
        {settings?.whatsappStatus === 'connected' ? (
          <button
            onClick={() => disconnectWhatsapp.mutate()}
            className="bg-red-500 text-white p-2 rounded"
          >
            Desconectar WhatsApp
          </button>
        ) : (
          <button
            onClick={() => connectWhatsapp.mutate()}
            className="bg-green-500 text-white p-2 rounded"
          >
            Conectar WhatsApp
          </button>
        )}
      </div>
      {showQRCode && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">QR Code para Conexão</h3>
          <p className="mb-4">
            Escaneie o QR Code abaixo com seu WhatsApp Business para conectar:
          </p>
          <div className="flex justify-center">
            <QrCode size={200} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;