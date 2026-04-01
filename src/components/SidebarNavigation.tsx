import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, Home, TrendingUp, Lightbulb, CloudSun, User } from 'lucide-react';

const SidebarNavigation: React.FC = () => {
  const tabs = [
    { to: '/', name: 'Bosh sahifa', icon: Home },
    { to: '/forecast', name: 'Prognoz', icon: TrendingUp },
    { to: '/recommendation', name: 'Tavsiya', icon: Lightbulb },
    { to: '/weather', name: 'Ob-Havo', icon: CloudSun },
    { to: '/profile', name: 'Profil', icon: User },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-100 shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-40">
      <div className="flex flex-col flex-1 pb-4 pt-6">
        
        {/* Brand Logo */}
        <div className="flex items-center px-8 mb-10 gap-3">
          <div className="bg-primary-50 w-10 h-10 rounded-xl flex items-center justify-center border border-primary-100 shadow-sm shrink-0">
            <Leaf className="text-primary-600 w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">
            Agro<span className="text-primary-600">Markaz</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.name}
                to={tab.to}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 shadow-[0_2px_10px_rgba(75,137,55,0.08)]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                      strokeWidth={isActive ? 2.5 : 2} 
                    />
                    {tab.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Support Block visually anchoring bottom of sidebar */}
        <div className="px-6 mt-auto">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 rounded-2xl border border-primary-100/50 text-center">
            <p className="text-sm font-bold text-gray-800 mb-1">Yordam kerakmi?</p>
            <p className="text-xs text-gray-500 mb-3">Bizning jamoa shu yerda</p>
            <button className="w-full py-2 bg-white text-primary-700 text-xs font-semibold rounded-xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
              Bog'lanish
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SidebarNavigation;
