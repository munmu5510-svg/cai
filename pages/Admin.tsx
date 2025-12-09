import React, { useEffect, useState } from 'react';
import { Card } from '../components/Shared';
import { User } from '../types';
import { storageService } from '../services/storageService';

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await storageService.getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Console</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="text-gray-300 hover:bg-white/5">
                  <td className="p-4 font-medium text-white">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.plan === 'PRO_PLUS' ? 'bg-deep-purple text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(u.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-8 text-center text-gray-500">No users found.</p>}
        </div>
      </Card>
    </div>
  );
};