import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import SidebarNavigation from '../components/SidebarNavigation';
import LoadingOverlay from '../components/LoadingOverlay';
import ChatWidget from '../components/ChatWidget';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

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
        <main className="flex-1 custom-scrollbar pb-20 md:pb-8 md:p-8 w-full max-w-[1400px] mx-auto min-w-0 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white">
        <BottomNavigation />
      </div>

      {/* Mobile floating chat button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setChatOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-[60] w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}
        aria-label="Chat yordam"
      >
        <MessageSquare className="w-5 h-5 text-white" />
      </motion.button>

      {/* Mobile chat widget */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
