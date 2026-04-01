import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: prevent background scrolling while loading
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const overlay = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-950/90 backdrop-blur-md overflow-hidden m-0 p-0"
      >
        <div className="flex flex-col items-center">
          {/* Sleek SVG animated spinner matching the premium theme */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="relative w-16 h-16"
          >
            <svg className="absolute w-full h-full text-primary-800" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
            </svg>
            <svg className="absolute w-full h-full text-primary-400" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                strokeDasharray="283" strokeDashoffset="212" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-white font-bold text-xl tracking-wide drop-shadow-md"
          >
            AgroMarkaz
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4 }}
            className="mt-1 text-sm text-primary-200 font-medium tracking-wider"
          >
            TIZIMGA ULANMOQDA...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(overlay, document.body);
};

export default LoadingOverlay;
