import React from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Leaf, LogOut } from 'lucide-react';

type OverlayVariant = 'login' | 'register' | 'logout';

interface AuthTransitionOverlayProps {
  variant?: OverlayVariant;
}

const config: Record<OverlayVariant, { icon: React.FC<any>; iconColor: string; label: string }> = {
  login: {
    icon: Leaf,
    iconColor: '#4ade80',
    label: 'Dashboard yuklanmoqda...',
  },
  register: {
    icon: Leaf,
    iconColor: '#4ade80',
    label: 'Hisobingiz yaratilmoqda...',
  },
  logout: {
    icon: LogOut,
    iconColor: '#fca5a5',
    label: 'Tizimdan chiqilmoqda...',
  },
};

const AuthTransitionOverlay: React.FC<AuthTransitionOverlayProps> = ({ variant = 'login' }) => {
  const { icon: Icon, iconColor, label } = config[variant];
  const isLogout = variant === 'logout';
  const spinGradFrom = isLogout ? '#fca5a5' : '#4ade80';
  const spinGradTo = isLogout ? '#ef4444' : '#86efac';
  const glowColor = isLogout ? 'rgba(239,68,68,0.18)' : 'rgba(74,222,128,0.18)';
  const orb1Color = isLogout ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.2)';
  const orb2Color = isLogout ? 'rgba(185,28,28,0.18)' : 'rgba(21,128,61,0.25)';
  const orb3Color = isLogout ? 'rgba(220,38,38,0.12)' : 'rgba(16,185,129,0.16)';
  const subtitleColor = isLogout ? 'rgba(252,165,165,0.75)' : 'rgba(167,243,208,0.75)';
  const bgGradient = isLogout
    ? 'linear-gradient(135deg, #1c0a0a 0%, #3b0f0f 35%, #4c1212 65%, #2d0a0a 100%)'
    : 'linear-gradient(135deg, #052e16 0%, #064e3b 35%, #065f46 65%, #0f4c2a 100%)';

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: bgGradient }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute pointer-events-none" style={{ top: '-20%', left: '-15%', width: '60vw', height: '60vw', borderRadius: '50%', background: `radial-gradient(circle, ${orb1Color} 0%, transparent 70%)`, filter: 'blur(70px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-15%', right: '-10%', width: '65vw', height: '65vw', borderRadius: '50%', background: `radial-gradient(circle, ${orb2Color} 0%, transparent 70%)`, filter: 'blur(90px)' }} />
      <div className="absolute pointer-events-none" style={{ top: '35%', left: '55%', width: '40vw', height: '40vw', borderRadius: '50%', background: `radial-gradient(circle, ${orb3Color} 0%, transparent 70%)`, filter: 'blur(55px)' }} />

      {/* Subtle mesh grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center select-none">
        {/* Spinner with pulsing glow ring */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.08, 0.35] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ position: 'absolute', width: 88, height: 88, borderRadius: '50%', boxShadow: `0 0 0 14px ${glowColor}` }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            style={{ width: 72, height: 72, position: 'relative' }}
          >
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            </svg>
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id={`authSpinGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={spinGradFrom} />
                  <stop offset="100%" stopColor={spinGradTo} stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" fill="none" stroke={`url(#authSpinGrad-${variant})`} strokeWidth="7" strokeDasharray="276" strokeDashoffset="207" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          style={{ marginTop: 28, width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon style={{ width: 24, height: 24, color: iconColor }} />
        </motion.div>

        {/* Brand name */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: 14, color: '#ffffff', fontWeight: 700, fontSize: 22, letterSpacing: '0.03em', textShadow: `0 2px 24px ${iconColor}70` }}
        >
          AgroMarkaz
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{ marginTop: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: subtitleColor }}
        >
          {label}
        </motion.p>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 18 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.22, ease: 'easeInOut' }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: iconColor }}
            />
          ))}
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default AuthTransitionOverlay;
