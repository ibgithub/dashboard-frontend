import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useI18n } from '../i18n';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang, t, setLang } = useI18n();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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
      localStorage.setItem('auth_token', data.token || 'authenticated');
      localStorage.setItem('auth_user', username);

      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Language toggle with flags */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setLang('id')}
          className={`px-2 py-1 rounded-md transition-all ${lang === 'id' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
          title="Bahasa Indonesia"
        >
          <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm">
            <rect width="24" height="8" fill="#FF0000"/>
            <rect y="8" width="24" height="8" fill="#FFFFFF"/>
          </svg>
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-2 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-white shadow' : 'hover:bg-white/50'}`}
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t.login_title}</h1>
          <p className="text-gray-500 mt-1">{t.login_subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t.login_username}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={t.login_placeholder_username}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t.login_password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={t.login_placeholder_password}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
          >
            {loading ? t.login_loading : t.login_button}
          </button>
        </form>
      </div>
    </div>
  );
}
