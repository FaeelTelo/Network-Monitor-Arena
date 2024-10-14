import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet } from 'lucide-react';

interface HistoryEntry {
  id: number;
  device: string;
  offlineTime: string;
  onlineTime: string;
  notificationTime: string;
  notificationStatus: 'success' | 'error';
}

const fetchHistory = async (): Promise<HistoryEntry[]> => {
  const response = await axios.get('http://172.16.0.5/api/history');
  return response.data;
};

const History: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { data: history, isLoading, error } = useQuery('history', fetchHistory);

  const filteredHistory = history?.filter(
    (entry) =>
      entry.device.toLowerCase().includes(filter.toLowerCase()) &&
      (typeFilter === '' || entry.device.includes(typeFilter))
  );

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Histórico de Dispositivos', 10, 10);
    filteredHistory?.forEach((entry, index) => {
      const y = 20 + index * 10;
      doc.text(`${entry.device} - Offline: ${entry.offlineTime}, Online: ${entry.onlineTime}`, 10, y);
    });
    doc.save('historico.pdf');
  };

  const exportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(filteredHistory || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Histórico');
    XLSX.writeFile(wb, 'historico.xlsx');
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar o histórico</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Histórico</h2>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Todos os tipos</option>
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
        <div>
          <button onClick={exportToPDF} className="bg-red-500 text-white p-2 rounded mr-2">
            <Download size={18} className="inline-block mr-1" /> PDF
          </button>
          <button onClick={exportToXLSX} className="bg-green-500 text-white p-2 rounded">
            <FileSpreadsheet size={18} className="inline-block mr-1" /> XLSX
          </button>
        </div>
      </div>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Dispositivo</th>
            <th className="p-2 text-left">Offline</th>
            <th className="p-2 text-left">Online</th>
            <th className="p-2 text-left">Notificação</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory?.map((entry) => (
            <tr key={entry.id} className="border-b">
              <td className="p-2">{entry.device}</td>
              <td className="p-2">{entry.offlineTime}</td>
              <td className="p-2">{entry.onlineTime}</td>
              <td className="p-2">{entry.notificationTime}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded ${
                    entry.notificationStatus === 'success' ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  {entry.notificationStatus === 'success' ? 'Enviado' : 'Erro'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;