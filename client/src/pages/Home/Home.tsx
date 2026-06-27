import { useUsers } from '../../features/users/useUsers';
import UserForm from '../../features/users/UserForm';
import UserList from '../../features/users/UserList';

export default function Home() {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          User Management
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <UserForm onSubmit={addUser} />

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Users List
        </h2>

        <UserList users={users} loading={loading} onUpdate={updateUser} onDelete={deleteUser} />
      </div>
    </div>
  );
}
