// Halaman: Menu Management (M8.6)
// View only — daftar semua menu

import { useState, useEffect } from 'react';
import { Eye, X, Search } from 'lucide-react';
import { useI18n } from '../i18n';

interface MenuItem {
  id: number;
  code: string;
  parentCode: string | null;
  menuKey: string;
  path: string;
  icon: string | null;
  sortOrder: number;
  children: MenuItem[] | null;
}

export function MenuManagement() {
  const { t } = useI18n();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [filtered, setFiltered] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  function getToken() { return localStorage.getItem('auth_token') || ''; }

  const title = (t as any).lang === 'id' ? 'Manajemen Menu' : 'Menu Management';
  const subtitle = (t as any).lang === 'id' ? 'Daftar menu yang tersedia dalam sistem' : 'List of menus available in the system';
  const searchPlaceholder = (t as any).lang === 'id' ? 'Cari menu...' : 'Search menus...';

  async function fetchMenus() {
    setLoading(true);
    try {
      const res = await fetch('/api/menus', { headers: { 'Authorization': `Bearer ${getToken()}` } });
      if (res.status === 403 || res.status === 401) { setError('Access denied'); return; }
      const json = await res.json();
      if (json.success) {
        setMenus(json.data || []);
        setFiltered(json.data || []);
        setError('');
      } else setError(json.message || 'Error');
    } catch (err: any) { setError(err.message || 'Error'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchMenus(); }, []);

  function handleSearch() {
    if (!keyword.trim()) { setFiltered(menus); return; }
    const kw = keyword.toLowerCase();
    setFiltered(menus.filter(m =>
      m.code.toLowerCase().includes(kw) ||
      m.menuKey.toLowerCase().includes(kw) ||
      m.path.toLowerCase().includes(kw) ||
      (m.icon || '').toLowerCase().includes(kw)
    ));
  }

  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === 'Enter') handleSearch(); }

  function openDetail(menu: MenuItem) { setSelectedMenu(menu); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setSelectedMenu(null); }

  if (error) {
    return (<div className="p-5"><div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-xs">{error}</div></div>);
  }

  return (
    <div className="p-5 flex flex-col min-h-full">
      {/* Title */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Search */}
      <div className="flex items-center mb-4 mt-3">
        <div className="flex items-stretch">
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="px-3 py-1.5 border border-slate-300 border-r-0 rounded-l text-xs focus:outline-none focus:border-slate-400 bg-white w-64 h-8" />
          <button onClick={handleSearch} className="px-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-r border border-slate-600 flex items-center justify-center h-8">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide">Code</th>
              <th className="text-left py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide">Parent</th>
              <th className="text-left py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide">Menu Key</th>
              <th className="text-left py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide">Path</th>
              <th className="text-left py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide">Icon</th>
              <th className="text-center py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide w-16">Order</th>
              <th className="text-center py-2.5 px-4 font-semibold text-slate-500 uppercase tracking-wide w-16">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-6 text-center text-slate-400 text-xs">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-6 text-center text-slate-400 text-xs">No data</td></tr>
            ) : (
              filtered.map((menu) => (
                <tr key={menu.id} className="border-b border-slate-100 hover:bg-blue-50/40">
                  <td className="py-2 px-4 text-slate-800 font-medium">{menu.code}</td>
                  <td className="py-2 px-4 text-slate-500">{menu.parentCode || '-'}</td>
                  <td className="py-2 px-4 text-slate-600">{menu.menuKey}</td>
                  <td className="py-2 px-4 text-slate-600">{menu.path}</td>
                  <td className="py-2 px-4 text-slate-500">{menu.icon || '-'}</td>
                  <td className="py-2 px-4 text-center text-slate-500">{menu.sortOrder}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center justify-center">
                      <button onClick={() => openDetail(menu)} className="p-1.5 rounded-full border border-blue-200 text-blue-500 hover:bg-blue-100 transition" title="Detail">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-3 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 <span className="font-semibold text-slate-500">ANVAIA</span> — Customer Intelligence Platform
      </div>

      {/* Modal detail */}
      {modalOpen && selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Detail Menu</h2>
              <button onClick={closeModal} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div><label className="text-xs text-slate-500">Code</label><p className="text-sm text-slate-900 font-medium mt-0.5">{selectedMenu.code}</p></div>
              <div><label className="text-xs text-slate-500">Parent Code</label><p className="text-sm text-slate-900 mt-0.5">{selectedMenu.parentCode || '-'}</p></div>
              <div><label className="text-xs text-slate-500">Menu Key</label><p className="text-sm text-slate-900 mt-0.5">{selectedMenu.menuKey}</p></div>
              <div><label className="text-xs text-slate-500">Path</label><p className="text-sm text-slate-900 mt-0.5">{selectedMenu.path}</p></div>
              <div><label className="text-xs text-slate-500">Icon</label><p className="text-sm text-slate-900 mt-0.5">{selectedMenu.icon || '-'}</p></div>
              <div><label className="text-xs text-slate-500">Sort Order</label><p className="text-sm text-slate-900 mt-0.5">{selectedMenu.sortOrder}</p></div>
            </div>
            <div className="p-4 border-t border-slate-200">
              <button onClick={closeModal} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition">{(t as any).lang === 'id' ? 'Tutup' : 'Close'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
