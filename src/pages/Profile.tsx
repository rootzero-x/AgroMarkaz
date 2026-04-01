import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Ruler, Calendar, History, ChevronRight, LogOut, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import AuthTransitionOverlay from '../components/AuthTransitionOverlay';

const Profile: React.FC = () => {
  const { user, logout, userLocation, setUserLocation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logoutOverlay, setLogoutOverlay] = useState(false);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Reverse geocoding — Nominatim (OpenStreetMap, bepul)
  useEffect(() => {
    if (!userLocation) return;
    setLocationLoading(true);
    setLocationError('');
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${userLocation.lat}&lon=${userLocation.lon}&format=json&accept-language=uz`,
      { headers: { 'User-Agent': 'AgroMarkaz/1.0' } }
    )
      .then((r) => r.json())
      .then((data) => {
        const a = data.address || {};
        const parts = [
          a.village || a.town || a.city || a.county || '',
          a.state || a.region || '',
          a.country || '',
        ].filter(Boolean);
        setLocationAddress(parts.join(', ') || data.display_name || '');
      })
      .catch(() => setLocationError('Manzil aniqlanmadi'))
      .finally(() => setLocationLoading(false));
  }, [userLocation]);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        setLocationError('Ruxsat rad etildi');
        setLocationLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error('Logout API xatosi:', err);
    } finally {
      setLoading(false);
      setLogoutOverlay(true);
      setTimeout(() => logout(), 1400);
    }
  };

  return (
    <>
      <AnimatePresence>
        {logoutOverlay && <AuthTransitionOverlay variant="logout" />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 lg:pt-0 lg:-mt-4 lg:px-8 space-y-5 md:space-y-6 lg:space-y-8 max-w-6xl mx-auto flex flex-col min-h-full">

        {/* Profile Header Card */}
        <div className="bg-primary-600 rounded-3xl md:rounded-[24px] p-4 md:p-5 lg:py-3.5 lg:px-6 text-white relative shadow-md shadow-primary-600/10 flex flex-row items-center gap-4 md:gap-5 overflow-hidden shrink-0">
          <div className="w-14 h-14 md:w-16 md:h-16 lg:w-[52px] lg:h-[52px] bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner relative z-10 border-[3px] border-primary-500/30">
            <span className="text-primary-600 font-bold text-xl md:text-2xl lg:text-xl">
              {user?.full_name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>

          <div className="flex-1 relative z-10 text-left min-w-0">
            <h1 className="text-lg md:text-2xl lg:text-xl font-bold mb-0.5 truncate">{user?.full_name || 'Ali Valiyev'}</h1>
            <p className="text-primary-100 text-[13px] md:text-base lg:text-sm font-medium tracking-wide truncate">{user?.phone_number || '+998 90 123 45 67'}</p>
          </div>

          {/* Improved Integrated Logout Button */}
          <div className="relative z-10 shrink-0 ml-auto">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center justify-center shrink-0 w-10 h-10 md:w-auto md:px-4 md:h-10 lg:h-9 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-xl md:rounded-[12px] border border-red-400/30 transition-all cursor-pointer shadow-sm active:scale-95 group"
              title="Tizimdan chiqish"
            >
              <LogOut className="w-[18px] h-[18px] md:w-4 md:h-4 lg:w-[15px] lg:h-[15px] md:mr-1.5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden md:inline font-semibold text-sm lg:text-[13px]">{loading ? "Chiqish..." : "Chiqish"}</span>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-[-50%] right-[-10%] md:right-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 flex-1">

          {/* Farm Details */}
          <div className="card-premium p-6 md:p-8 flex flex-col">
            <h2 className="text-[17px] md:text-xl font-semibold text-gray-800 mb-5 md:mb-6 border-b border-gray-100 pb-3 md:pb-4 flex items-center gap-2">
              Ferma ma'lumotlari
            </h2>
            <div className="space-y-5 md:space-y-6 flex-1">
              <div className="flex gap-4 md:gap-5 items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 font-medium mb-0.5">Manzil</p>
                  {userLocation ? (
                    <>
                      {locationLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                          <span className="text-sm text-gray-400">Aniqlanmoqda...</span>
                        </div>
                      ) : (
                        <p className="text-gray-800 font-bold text-sm md:text-base leading-snug">
                          {locationError || locationAddress || 'Manzil aniqlanmadi'}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                        {userLocation.lat.toFixed(4)}°N, {userLocation.lon.toFixed(4)}°E
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400 text-sm mb-2">Manzil ulanmagan</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={requestLocation}
                        disabled={locationLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}
                      >
                        {locationLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Navigation className="w-3.5 h-3.5" />
                        )}
                        Manzildan foydalanishga ruxsat berish
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4 md:gap-5 items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
                  <Ruler className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium mb-0.5">Yer maydoni</p>
                  <p className="text-gray-800 font-bold text-sm md:text-base">10 gektar</p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-5 items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 border border-primary-100">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium mb-0.5">A'zolik sanasi</p>
                  <p className="text-gray-800 font-bold text-sm md:text-base">15 Yanvar 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations History */}
          <div className="card-premium p-6 md:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-5 md:mb-6 border-b border-gray-100 pb-3 md:pb-4">
              <h2 className="text-[17px] md:text-xl font-semibold text-gray-800">Tavsiyalar tarixi</h2>
              <History className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>

            <div className="space-y-4 flex-1">
              {[
                { crop: "Bug'doy", date: "28 Mart 2026", status: "Muvaffaqiyatli", statusColor: "text-primary-600", emoji: "🌾" },
                { crop: "Kartoshka", date: "15 Mart 2026", status: "Muvaffaqiyatli", statusColor: "text-primary-600", emoji: "🥔" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 md:p-4 -mx-3 md:-mx-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-gray-100 flex-wrap sm:flex-nowrap gap-2">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-lg md:text-xl shrink-0">
                      {item.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm md:text-base mb-0.5 truncate">{item.crop}</p>
                      <p className="text-xs md:text-sm text-gray-400 font-medium truncate">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <span className={`text-[11px] md:text-xs font-semibold px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full bg-primary-50 ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </motion.div>
    </>
  );
};

export default Profile;
