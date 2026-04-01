import React from 'react';
import { Leaf } from 'lucide-react';
import { FallingLeaves } from '../components/FallingLeaves';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="h-[100dvh] w-screen flex flex-col lg:flex-row bg-gradient-to-br from-primary-800 to-primary-900 overflow-hidden fixed inset-0">

      {/* Full Screen Cinematic Leaves (Behind Everything) */}
      <div className="absolute inset-0 z-0">
        <FallingLeaves />
      </div>

      {/* Decorative Left Side (Desktop Only) - Typography */}
      <div className="hidden lg:flex lg:flex-1 relative items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center text-center px-12 pb-10"
        >
          <div className="bg-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-md shadow-2xl">
            <Leaf className="text-white w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4 leading-tight drop-shadow-md">
            <span className="text-primary-300">AgroMarkaz</span>
          </h1>
          <p className="text-primary-100/90 text-lg max-w-md leading-relaxed drop-shadow-sm font-medium">
            Zamonaviy qishloq xo'jaligi platformasi. Barcha yechimlar bitta joyda jamlangan premium xizmat!
          </p>
        </motion.div>
      </div>

      {/* Auth Form Right Side (Transparent background, floating form) */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative z-10 bg-transparent">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 w-full h-full relative perspective-[1200px]">
          <AnimatePresence mode="wait">
            {outlet && React.cloneElement(outlet as React.ReactElement, { key: location.pathname })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
