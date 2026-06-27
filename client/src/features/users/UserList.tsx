import { useState } from 'react';
import type { User } from './users.api';

interface UserListProps {
  users: User[];
  loading: boolean;
  onUpdate: (params: { id: number; data: { name: string; email: string } }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
}

export default function UserList({ users, loading, onUpdate, onDelete }: UserListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setEmail('');
  };

  const handleSave = async (id: number) => {
    await onUpdate({ id, data: { name, email } });
    setEditingId(null);
    setName('');
    setEmail('');
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-4">Loading users...</p>;
  }

  if (users.length === 0) {
    return <p className="text-center text-gray-500 py-4">No users found.</p>;
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          {editingId === user.id ? (
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(user.id)}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => handleEdit(user)}
                className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(user.id)}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
