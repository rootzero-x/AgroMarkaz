import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, Lightbulb, CloudSun, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNavigation: React.FC = () => {
  const tabs = [
    { to: '/', name: 'Bosh sahifa', icon: Home },
    { to: '/forecast', name: 'Prognoz', icon: TrendingUp },
    { to: '/recommendation', name: 'Tavsiya', icon: Lightbulb },
    { to: '/weather', name: 'Ob-Havo', icon: CloudSun },
    { to: '/profile', name: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgb(0,0,0,0.03)] pb-safe z-40">
      <div className="max-w-md mx-auto flex items-center justify-between px-6 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 transition-colors duration-300 ${
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute -top-3 w-1.5 h-1.5 bg-primary-600 rounded-full"
                    />
                  )}
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{tab.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
