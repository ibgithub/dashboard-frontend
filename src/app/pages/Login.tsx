import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useI18n } from '../i18n';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const navigate = useNavigate();
  const { lang, t, setLang } = useI18n();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Login gagal (${res.status})`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login gagal');
      }
      const token = data.data?.token || '';
      if (!token) throw new Error('Token tidak ditemukan');
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', username);

      // Step 2: Fetch menu permissions
      const menuRes = await fetch('/api/users/me/menus', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        const menus = menuData.data || [];
        localStorage.setItem('auth_menus', JSON.stringify(menus));
      }

      // Redirect ke dashboard with slide animation
      setSlideOut(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden">
    <div className={`min-h-screen flex transition-transform duration-500 ease-in-out ${slideOut ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl font-bold">A</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">ANVAIA</h1>
          <p className="text-lg text-slate-300 mb-2">Customer Intelligence Platform</p>
          <p className="text-sm text-slate-400 max-w-sm">
            {lang === 'id'
              ? 'Analitik nasabah cerdas untuk pengambilan keputusan yang lebih baik'
              : 'Smart customer analytics for better decision making'}
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Language toggle */}
          <div className="flex justify-end mb-8 gap-2">
            <button
              onClick={() => setLang('id')}
              className={`px-2 py-1 rounded-md transition-all ${lang === 'id' ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-white/50'}`}
              title="Bahasa Indonesia"
            >
              <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm">
                <rect width="24" height="8" fill="#FF0000"/>
                <rect y="8" width="24" height="8" fill="#FFFFFF"/>
              </svg>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-white/50'}`}
              title="English"
            >
              <svg width="24" height="16" viewBox="0 0 60 30" className="rounded-sm">
                <clipPath id="t"><rect width="60" height="30"/></clipPath>
                <g clipPath="url(#t)">
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                  <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#t)"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                  <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                </g>
              </svg>
            </button>
          </div>

          {/* Mobile logo (shown on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">ANVAIA</h1>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{t.login_title}</h2>
              <p className="text-slate-500 mt-1">{t.login_subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t.login_username}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white"
                    placeholder={t.login_placeholder_username}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t.login_password}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 focus:bg-white"
                    placeholder={t.login_placeholder_password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition shadow-sm"
              >
                {loading ? t.login_loading : t.login_button}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2026 ANVAIA — Customer Intelligence Platform
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
