import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Target,
  Bell,
  TrendingUp,
  ShoppingBag,
  Repeat,
  MapPin,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
// Logo placeholder (originally a Figma asset)
const logoImage = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="#155DFC"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">A</text></svg>');

const menuItems = [
  { path: '/', label: 'AnvAIa', icon: LayoutDashboard },
  { path: '/hyperpersonalized', label: 'Hyperpersonalized', icon: Sparkles },
  { path: '/auto-reminder', label: 'Auto Reminder', icon: Bell },
  { path: '/upselling', label: 'Upselling', icon: TrendingUp },
  { path: '/cross-selling', label: 'Cross-Selling', icon: Repeat },
  { path: '/auto-debit', label: 'Auto-Debit', icon: ShoppingBag },
  { path: '/geo-merchant', label: 'Geo Merchant', icon: MapPin },
];

export function DashboardLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {isCollapsed ? (
              <div className="w-full">
                <img 
                  src={logoImage} 
                  alt="AnvAIa Logo" 
                  className="w-10 h-10 object-contain flex-shrink-0 mx-auto"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img 
                  src={logoImage} 
                  alt="AnvAIa Logo" 
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">ANVAIA</h1>
                  <p className="text-xs text-slate-500">Analytics Dashboard</p>
                </div>
              </div>
            )}
            {/* Collapse Button */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>
          {/* Collapse button when collapsed - at bottom of logo */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors mt-3 mx-auto"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-[#155DFC]/10 text-[#155DFC] font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}