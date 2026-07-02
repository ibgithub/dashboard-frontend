import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  UserCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useI18n } from '../i18n';

// Logo placeholder
const logoImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#155DFC"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">A</text></svg>');

interface SubMenuItem {
  key: string;
  path: string;
}

interface MenuItem {
  key: string;
  code: string;
  icon: any;
  path: string;
  children: SubMenuItem[];
}

// Menu structure definition (keys reference i18n resource)
const menuStructure: MenuItem[] = [
  {
    key: 'menu_m1',
    code: 'M1',
    icon: LayoutDashboard,
    path: '/executive',
    children: [
      { key: 'menu_m1_1', path: '/executive/portfolio' },
      { key: 'menu_m1_2', path: '/executive/churn-distribution' },
      { key: 'menu_m1_3', path: '/executive/segmentation-summary' },
      { key: 'menu_m1_4', path: '/executive/top-products' },
      { key: 'menu_m1_5', path: '/executive/priority-alerts' },
    ],
  },
  {
    key: 'menu_m2',
    code: 'M2',
    icon: Users,
    path: '/segmentation',
    children: [
      { key: 'menu_m2_1', path: '/segmentation/cluster-map' },
      { key: 'menu_m2_2', path: '/segmentation/persona' },
      { key: 'menu_m2_3', path: '/segmentation/characteristics' },
      { key: 'menu_m2_4', path: '/segmentation/member-list' },
      { key: 'menu_m2_5', path: '/segmentation/migration-trend' },
    ],
  },
  {
    key: 'menu_m3',
    code: 'M3',
    icon: TrendingDown,
    path: '/churn',
    children: [
      { key: 'menu_m3_1', path: '/churn/watchlist' },
      { key: 'menu_m3_2', path: '/churn/score-distribution' },
      { key: 'menu_m3_3', path: '/churn/worsening-score' },
      { key: 'menu_m3_4', path: '/churn/driver-detail' },
      { key: 'menu_m3_5', path: '/churn/action-history' },
    ],
  },
  {
    key: 'menu_m4',
    code: 'M4',
    icon: DollarSign,
    path: '/profitability',
    children: [
      { key: 'menu_m4_1', path: '/profitability/ranking' },
      { key: 'menu_m4_2', path: '/profitability/priority-matrix' },
      { key: 'menu_m4_3', path: '/profitability/persona-group' },
      { key: 'menu_m4_4', path: '/profitability/breakdown' },
      { key: 'menu_m4_5', path: '/profitability/trend' },
      { key: 'menu_m4_6', path: '/profitability/clv' },
    ],
  },
  {
    key: 'menu_m5',
    code: 'M5',
    icon: ShoppingBag,
    path: '/recommendation',
    children: [
      { key: 'menu_m5_1', path: '/recommendation/list' },
      { key: 'menu_m5_2', path: '/recommendation/status' },
      { key: 'menu_m5_3', path: '/recommendation/cold-start' },
      { key: 'menu_m5_4', path: '/recommendation/performance' },
      { key: 'menu_m5_5', path: '/recommendation/product-config' },
    ],
  },
  {
    key: 'menu_m6',
    code: 'M6',
    icon: UserCircle,
    path: '/customer-profile',
    children: [
      { key: 'menu_m6_1', path: '/customer-profile/overview' },
      { key: 'menu_m6_2', path: '/customer-profile/cluster-persona' },
      { key: 'menu_m6_3', path: '/customer-profile/churn-score' },
      { key: 'menu_m6_4', path: '/customer-profile/profitability-clv' },
      { key: 'menu_m6_5', path: '/customer-profile/retention-priority' },
      { key: 'menu_m6_6', path: '/customer-profile/active-recommendations' },
      { key: 'menu_m6_7', path: '/customer-profile/credit-score' },
      { key: 'menu_m6_8', path: '/customer-profile/rm-interaction' },
    ],
  },
  {
    key: 'menu_m7',
    code: 'M7',
    icon: BarChart3,
    path: '/reports',
    children: [
      { key: 'menu_m7_1', path: '/reports/segmentation' },
      { key: 'menu_m7_2', path: '/reports/churn-retention' },
      { key: 'menu_m7_3', path: '/reports/profitability' },
      { key: 'menu_m7_4', path: '/reports/recommendation-effectiveness' },
      { key: 'menu_m7_5', path: '/reports/export' },
    ],
  },
  {
    key: 'menu_m8',
    code: 'M8',
    icon: Settings,
    path: '/settings',
    children: [
      { key: 'menu_m8_1', path: '/settings/model-parameters' },
      { key: 'menu_m8_2', path: '/settings/batch-processing' },
      { key: 'menu_m8_3', path: '/settings/product-config' },
      { key: 'menu_m8_4', path: '/settings/user-management' },
      { key: 'menu_m8_5', path: '/settings/role-management' },
      { key: 'menu_m8_6', path: '/settings/menu-management' },
      { key: 'menu_m8_7', path: '/settings/change-password' },
      { key: 'menu_m8_8', path: '/settings/integration-monitoring' },
      { key: 'menu_m8_9', path: '/settings/audit-log' },
    ],
  },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, t, setLang } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('menu_m1');

  function toggleMenu(key: string) {
    // Accordion: hanya satu menu terbuka, klik lagi untuk tutup
    setExpandedMenu((prev) => (prev === key ? null : key));
  }

  function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar — scrollable, no fixed footer */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {isCollapsed ? (
              <div className="w-full">
                <img src={logoImage} alt="Logo" className="w-10 h-10 mx-auto" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img src={logoImage} alt="Logo" className="w-10 h-10" />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{t.appName}</h1>
                  <p className="text-xs text-slate-500">{t.appTagline}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isCollapsed ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Language switcher — above menu */}
        <div className="px-3 pt-3 pb-1 flex items-center gap-2">
          <button
            onClick={() => setLang('id')}
            className={`px-2 py-1 rounded-md transition-all ${lang === 'id' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
            title="Bahasa Indonesia"
          >
            <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm">
              <rect width="24" height="8" fill="#FF0000"/>
              <rect y="8" width="24" height="8" fill="#FFFFFF"/>
            </svg>
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
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

        {/* Navigation */}
        <nav className="p-3">
          <div className="space-y-1">
            {menuStructure.map((menu) => {
              const Icon = menu.icon;
              const isExpanded = expandedMenu === menu.key;
              const isActive = isExpanded;
              const label = (t as any)[menu.key] || menu.key;

              return (
                <div key={menu.key}>
                  {/* Parent menu */}
                  <button
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                        setExpandedMenu(menu.key);
                      } else {
                        toggleMenu(menu.key);
                      }
                    }}
                    className={`
                      w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all text-sm
                      ${isActive
                        ? 'bg-[#8B1A1A]/10 text-[#8B1A1A] font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                    title={isCollapsed ? label : ''}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{label}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      isExpanded
                        ? <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        : <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </button>

                  {/* Sub menus with accordion animation */}
                  {!isCollapsed && (
                    <div
                      className="ml-6 border-l-2 border-slate-200 pl-3 overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: isExpanded ? `${menu.children.length * 44}px` : '0px',
                        opacity: isExpanded ? 1 : 0,
                        marginTop: isExpanded ? '4px' : '0px',
                      }}
                    >
                      <div className="space-y-0.5">
                        {menu.children.map((child) => {
                          const childLabel = (t as any)[child.key] || child.key;
                          const isChildActive = location.pathname === child.path;

                        return (
                          <Link
                            key={child.key}
                            to={child.path}
                            className={`
                              block px-3 py-2 rounded-md text-sm transition-all
                              ${isChildActive
                                ? 'bg-[#8B1A1A]/10 text-[#8B1A1A] font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                              }
                            `}
                          >
                            {childLabel}
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Logout — below last menu */}
        <div className="px-3 pb-4 pt-1">
          {!isCollapsed ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.logout}</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2.5 rounded-lg text-red-600 hover:bg-red-50"
              title={t.logout}
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
