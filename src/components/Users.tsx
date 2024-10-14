import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  type: 'Administrador' | 'User';
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get('http://172.16.0.5/api/users');
  return response.data;
};

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users, isLoading, error } = useQuery('users', fetchUsers);

  const createUser = useMutation(
    (newUser: Omit<User, 'id'>) => axios.post('http://172.16.0.5/api/users', newUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setShowForm(false);
      },
    }
  );

  const updateUser = useMutation(
    (updatedUser: User) => axios.put(`http://172.16.0.5/api/users/${updatedUser.id}`, updatedUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setEditingUser(null);
      },
    }
  );

  const deleteUser = useMutation(
    (id: number) => axios.delete(`http://172.16.0.5/api/users/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'Administrador' | 'User',
      password: formData.get('password') as string,
    };

    if (editingUser) {
      updateUser.mutate({ ...userData, id: editingUser.id });
    } else {
      createUser.mutate(userData);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os usuários</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuários</h2>
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-blue-500 text-white p-2 rounded flex items-center"
      >
        <Plus size={18} className="mr-1" /> Adicionar Usuário
      </button>
      {(showForm || editingUser) && (
        <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow">
          <input
            name="name"
            placeholder="Nome"
            defaultValue={editingUser?.name}
            className="mb-2 p-2 border rounded w-full"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="mb-2 p-2 border rounded w-full"
            required={!editingUser}
          />
          <select
            name="type"
            defaultValue={editingUser?.type}
            className="mb-2 p-2 border rounded w-full"
            required
          >
            <option value="Administrador">Administrador</option>
            <option value="User">Usuário</option>
          </select>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {editingUser ? 'Atualizar' : 'Adicionar'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingUser(null);
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
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.type}</td>
              <td className="p-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="mr-2 text-blue-500"
                  disabled={user.name === 'admin'}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteUser.mutate(user.id)}
                  className="text-red-500"
                  disabled={user.name === 'admin'}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;