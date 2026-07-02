// Halaman: Role Management (M8.5)
// Inquiry daftar role dari API

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface Role {
  id: number;
  roleName: string;
  description: string;
}

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Fetch daftar role dari API
  useEffect(() => {
    async function fetchRoles() {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/roles', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setRoles(json.data);
        } else {
          setError(json.message || 'Gagal memuat data role');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal menghubungi server');
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  // Fetch detail role
  async function handleViewDetail(roleId: number) {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/roles/${roleId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setSelectedRole(json.data);
      }
    } catch (err) {
      // silent fail
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-slate-500">Memuat data role...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Role Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Daftar role yang tersedia dalam sistem
        </p>
      </div>

      {/* Role list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Role Name</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Description</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-500">{role.id}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-slate-900">{role.roleName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{role.description}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetail(role.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel (muncul ketika klik Detail) */}
      {selectedRole && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Detail Role</h2>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Tutup
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4">
              <span className="text-sm text-slate-500 w-24">ID</span>
              <span className="text-sm text-slate-900">{selectedRole.id}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm text-slate-500 w-24">Role Name</span>
              <span className="text-sm font-medium text-slate-900">{selectedRole.roleName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-sm text-slate-500 w-24">Description</span>
              <span className="text-sm text-slate-900">{selectedRole.description}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
