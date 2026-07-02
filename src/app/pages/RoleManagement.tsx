// Halaman: Role Management (M8.5)
// CRUD role dengan slide panel dari kanan

import { useState, useEffect } from 'react';
import { Shield, Eye, Pencil, Trash2, Plus, X } from 'lucide-react';
import { useI18n } from '../i18n';

interface Role {
  id: number;
  roleName: string;
  description: string;
}

type DrawerMode = 'detail' | 'add' | 'edit' | null;

export function RoleManagement() {
  const { t } = useI18n();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form state (for add/edit)
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  function getToken() {
    return localStorage.getItem('auth_token') || '';
  }

  // Fetch daftar role
  async function fetchRoles() {
    try {
      const res = await fetch('/api/roles', {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (res.status === 403) { setError((t as any).role_access_denied); return; }
      if (res.status === 401) { setError((t as any).role_session_expired); return; }
      const json = await res.json();
      if (json.success) setRoles(json.data);
      else setError(json.message || 'Error');
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRoles(); }, []);

  // Open drawer
  function openDetail(role: Role) {
    setSelectedRole(role);
    setDrawerMode('detail');
    setDrawerOpen(true);
  }

  function openEdit(role: Role) {
    setSelectedRole(role);
    setFormName(role.roleName);
    setFormDescription(role.description);
    setDrawerMode('edit');
    setDrawerOpen(true);
  }

  function openAdd() {
    setSelectedRole(null);
    setFormName('');
    setFormDescription('');
    setDrawerMode('add');
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => { setDrawerMode(null); setSelectedRole(null); }, 300);
  }

  // Save (add or edit)
  async function handleSave() {
    const url = drawerMode === 'add' ? '/api/roles' : `/api/roles/${selectedRole?.id}`;
    const method = drawerMode === 'add' ? 'POST' : 'PUT';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ roleName: formName, description: formDescription }),
      });
      const json = await res.json();
      if (json.success) {
        closeDrawer();
        fetchRoles();
      }
    } catch (err) {
      // silent
    }
  }

  // Delete
  async function handleDelete(role: Role) {
    if (!confirm((t as any).role_delete_confirm)) return;
    try {
      await fetch(`/api/roles/${role.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      fetchRoles();
    } catch (err) {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-slate-500">{(t as any).role_loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{(t as any).role_title}</h1>
          <p className="text-sm text-slate-500 mt-1">{(t as any).role_subtitle}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {(t as any).role_add}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-slate-600">{(t as any).role_name}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">{(t as any).role_description}</th>
              <th className="text-center py-3 px-4 font-medium text-slate-600 w-32">{(t as any).role_actions}</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-slate-900">{role.roleName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{role.description}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openDetail(role)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title={(t as any).role_detail}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(role)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                      title={(t as any).role_edit}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title={(t as any).role_delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDrawer}></div>
      )}

      {/* Slide panel (drawer from right) */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              {drawerMode === 'detail' && (t as any).role_detail}
              {drawerMode === 'add' && (t as any).role_add}
              {drawerMode === 'edit' && (t as any).role_edit}
            </h2>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 p-5 overflow-y-auto">
            {drawerMode === 'detail' && selectedRole && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-500">{(t as any).role_name}</label>
                  <p className="text-slate-900 font-medium mt-1">{selectedRole.roleName}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">{(t as any).role_description}</label>
                  <p className="text-slate-900 mt-1">{selectedRole.description}</p>
                </div>
              </div>
            )}

            {(drawerMode === 'add' || drawerMode === 'edit') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{(t as any).role_name}</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{(t as any).role_description}</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Drawer footer */}
          {(drawerMode === 'add' || drawerMode === 'edit') && (
            <div className="p-5 border-t border-slate-200 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                {(t as any).role_save}
              </button>
              <button
                onClick={closeDrawer}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
              >
                {(t as any).role_cancel}
              </button>
            </div>
          )}

          {drawerMode === 'detail' && (
            <div className="p-5 border-t border-slate-200">
              <button
                onClick={closeDrawer}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
              >
                {(t as any).role_close}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
