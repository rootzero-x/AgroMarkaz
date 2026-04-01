import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import SidebarNavigation from '../components/SidebarNavigation';
import LoadingOverlay from '../components/LoadingOverlay';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen w-screen bg-surface font-sans flex overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 h-full relative overflow-hidden">
        {/* Main Content Area scrolls internally */}
        <main className="flex-1 custom-scrollbar pb-20 md:pb-8 md:p-8 w-full max-w-[1400px] mx-auto min-w-0 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default DashboardLayout;
