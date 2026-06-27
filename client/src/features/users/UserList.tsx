import type { User } from './users.api';

interface UserListProps {
  users: User[];
  loading: boolean;
}

export default function UserList({ users, loading }: UserListProps) {
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
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
