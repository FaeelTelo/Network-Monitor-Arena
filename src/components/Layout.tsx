import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Monitor, Users, History, Settings, LogOut } from 'lucide-react';

const Layout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-indigo-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Monitor de Rede</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="flex items-center p-2 hover:bg-indigo-600 rounded">
                <Home className="mr-2" size={18} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/devices" className="flex items-center p-2 hover:bg-indigo-600 rounded">
                <Monitor className="mr-2" size={18} />
                Dispositivos
              </Link>
            </li>
            <li>
              <Link to="/users" className="flex items-center p-2 hover:bg-indigo-600 rounded">
                <Users className="mr-2" size={18} />
                Usuários
              </Link>
            </li>
            <li>
              <Link to="/history" className="flex items-center p-2 hover:bg-indigo-600 rounded">
                <History className="mr-2" size={18} />
                Histórico
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center p-2 hover:bg-indigo-600 rounded">
                <Settings className="mr-2" size={18} />
                Configurações
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center p-2 hover:bg-indigo-600 rounded mt-auto"
        >
          <LogOut className="mr-2" size={18} />
          Sair
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;