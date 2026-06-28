import { useUsers } from '../../features/users/useUsers';
import UserForm from '../../features/users/UserForm';
import UserList from '../../features/users/UserList';

export default function Users() {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Users</h1>

      <UserForm onSubmit={addUser} />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">User List</h2>

      <UserList users={users} loading={loading} onUpdate={updateUser} onDelete={deleteUser} />
    </div>
  );
}
