import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { MapPin, Loader2, AlertTriangle, X } from 'lucide-react';

interface LocationPromptProps {
  onGranted: (lat: number, lon: number) => void;
  onSkip: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onGranted, onSkip }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Brauzeringiz joylashuvni qo\'llab-quvvatlamaydi.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onGranted(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setStatus('error');
        if (err.code === 1) setErrorMsg('Joylashuv ruxsati rad etildi. Brauzer sozlamalaridan ruxsat bering.');
        else setErrorMsg('Joylashuvni aniqlab bo\'lmadi. Qayta urinib ko\'ring.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Top gradient strip */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #15803d, #4ade80, #15803d)' }} />

        <div className="p-6 sm:p-7">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <motion.div
              animate={status === 'loading' ? { scale: [1, 1.08, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center"
            >
              {status === 'loading' ? (
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              ) : status === 'error' ? (
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              ) : (
                <MapPin className="w-8 h-8 text-primary-600" />
              )}
            </motion.div>
          </div>

          <h2 className="text-[18px] font-bold text-gray-900 text-center mb-2">
            {status === 'error' ? 'Joylashuv aniqlanmadi' : 'Joylashuvingizni ulashing'}
          </h2>
          <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
            {status === 'error'
              ? errorMsg
              : 'Ob-havo ma\'lumotlarini ko\'rsatish uchun joylashuvingizga ruxsat bering.'}
          </p>

          <div className="space-y-3">
            {status !== 'loading' && (
              <button
                onClick={requestLocation}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-[15px] transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}
              >
                {status === 'error' ? 'Qayta urinib ko\'ring' : 'Joylashuvga ruxsat berish'}
              </button>
            )}
            {status === 'loading' && (
              <div className="w-full py-3.5 rounded-xl bg-primary-50 flex items-center justify-center gap-2 text-primary-700 font-semibold text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Joylashuv aniqlanmoqda...
              </div>
            )}
            <button
              onClick={onSkip}
              className="w-full py-3 rounded-xl text-gray-500 text-[14px] font-medium hover:bg-gray-50 transition-all"
            >
              Keyinroq
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default LocationPrompt;
