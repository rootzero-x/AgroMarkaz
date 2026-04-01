import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LocationPrompt from '../components/LocationPrompt';
import {
  MapPin, Wind, Droplets, Cloud,
  RefreshCw, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';

/* ── Weather icon map ─────────────────────────────── */
const weatherMeta: Record<string, { emoji: string; color: string; bg: string }> = {
  sunny:          { emoji: '☀️',  color: '#f59e0b', bg: 'from-amber-50 to-orange-50' },
  mostly_sunny:   { emoji: '🌤️',  color: '#f59e0b', bg: 'from-amber-50 to-yellow-50' },
  partly_sunny:   { emoji: '⛅',  color: '#64748b', bg: 'from-blue-50 to-sky-50' },
  mostly_cloudy:  { emoji: '🌥️',  color: '#64748b', bg: 'from-slate-50 to-gray-50' },
  cloudy:         { emoji: '☁️',  color: '#6b7280', bg: 'from-gray-50 to-slate-50' },
  overcast:       { emoji: '🌫️',  color: '#6b7280', bg: 'from-gray-100 to-slate-100' },
  rain:           { emoji: '🌧️',  color: '#3b82f6', bg: 'from-blue-50 to-indigo-50' },
  drizzle:        { emoji: '🌦️',  color: '#3b82f6', bg: 'from-blue-50 to-sky-50' },
  snow:           { emoji: '❄️',  color: '#7dd3fc', bg: 'from-sky-50 to-blue-50' },
  thunderstorm:   { emoji: '⛈️',  color: '#7c3aed', bg: 'from-violet-50 to-purple-50' },
  partly_clear:   { emoji: '🌙',  color: '#8b5cf6', bg: 'from-indigo-50 to-violet-50' },
  clear:          { emoji: '🌑',  color: '#475569', bg: 'from-slate-50 to-gray-50' },
};

const getMeta = (weather: string) =>
  weatherMeta[weather] ?? { emoji: '🌡️', color: '#15803d', bg: 'from-green-50 to-emerald-50' };

const formatHour = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.getHours().toString().padStart(2, '0') + ':00';
};

/* ── Types ─────────────────────────────────────────── */
interface HourlyItem {
  date: string;
  weather: string;
  summary: string;
  temperature: number;
  wind: { speed: number; dir: string };
  cloud_cover: { total: number };
  precipitation: { total: number; type: string };
}

interface WeatherData {
  lat: string;
  lon: string;
  timezone: string;
  current: {
    summary: string;
    icon: string;
    temperature: number;
    wind: { speed: number; dir: string; angle: number };
    precipitation: { total: number; type: string };
    cloud_cover: number;
  };
  hourly: { data: HourlyItem[] };
}

/* ── Main Component ─────────────────────────────────── */
const Weather: React.FC = () => {
  const { userLocation, setUserLocation } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [hourlyStart, setHourlyStart] = useState(0);

  const HOURLY_VISIBLE = 6;

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/weather?lat=${lat}&lon=${lon}`);
      setWeather(res.data.weather ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ob-havo ma\'lumotlarini yuklab bo\'lmadi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchWeather(userLocation.lat, userLocation.lon);
    }
  }, [userLocation, fetchWeather]);

  const handleLocationGranted = (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    setShowLocationPrompt(false);
  };

  /* ── Always-rendered LocationPrompt portal ────────── */
  const locationPromptEl = (
    <AnimatePresence>
      {showLocationPrompt && (
        <LocationPrompt
          onGranted={handleLocationGranted}
          onSkip={() => setShowLocationPrompt(false)}
        />
      )}
    </AnimatePresence>
  );

  /* ── No location state ──────────────────────────── */
  if (!userLocation) {
    return (
      <>
        {locationPromptEl}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-5 text-4xl shadow-sm">
            🌍
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Joylashuvingiz kerak</h2>
          <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
            Ob-havo ma'lumotlarini ko'rish uchun joylashuvingizga ruxsat bering.
          </p>
          <button
            onClick={() => setShowLocationPrompt(true)}
            className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all active:scale-95 shadow-md shadow-primary-200"
            style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}
          >
            Joylashuvni ulash
          </button>
        </motion.div>
      </>
    );
  }

  /* ── Loading state ─────────────────────────────── */
  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-3xl animate-pulse">⛅</div>
        <p className="text-gray-500 font-medium text-sm">Ob-havo yuklanmoqda...</p>
      </motion.div>
    );
  }

  /* ── Error state ───────────────────────────────── */
  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">Xatolik yuz berdi</h2>
        <p className="text-sm text-gray-500 mb-5">{error}</p>
        <button
          onClick={() => userLocation && fetchWeather(userLocation.lat, userLocation.lon)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Qayta urinib ko'ring
        </button>
      </motion.div>
    );
  }

  if (!weather) return null;

  const cur = weather.current;
  const meta = getMeta(cur.summary?.toLowerCase().replace(/ /g, '_') || '');
  const hourlyData = weather.hourly?.data ?? [];
  const visibleHours = hourlyData.slice(hourlyStart, hourlyStart + HOURLY_VISIBLE);

  const statCards = [
    { icon: Wind, label: 'Shamol', value: `${cur.wind.speed} m/s`, sub: cur.wind.dir, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Cloud, label: 'Bulut', value: `${cur.cloud_cover}%`, sub: 'Qoplama', color: 'text-slate-500', bg: 'bg-slate-50' },
    { icon: Droplets, label: 'Yog\'in', value: `${cur.precipitation.total} mm`, sub: cur.precipitation.type === 'none' ? 'Yo\'q' : cur.precipitation.type, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-6 lg:pt-0 lg:-mt-4 lg:px-8 space-y-5 md:space-y-6 max-w-4xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ob-Havo</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span className="text-xs text-gray-400 font-medium">{weather.timezone}</span>
          </div>
        </div>
        <button
          onClick={() => userLocation && fetchWeather(userLocation.lat, userLocation.lon)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-100 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Yangilash
        </button>
      </div>

      {/* Hero current weather card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-[-40%] right-[-10%] w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute bottom-[-30%] left-[-5%] w-56 h-56 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #a7f3d0, transparent)' }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-green-200 text-sm font-medium mb-1">Hozir</p>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-7xl md:text-8xl font-bold text-white leading-none tracking-tight">
                {Math.round(cur.temperature)}°
              </span>
              <span className="text-3xl mb-2">{meta.emoji}</span>
            </div>
            <p className="text-white/90 text-lg font-semibold">{cur.summary}</p>
            <p className="text-green-200/80 text-sm mt-1">
              Shamol: {cur.wind.speed} m/s {cur.wind.dir} · Bulut: {cur.cloud_cover}%
            </p>
          </div>

          {/* Mini stat pills */}
          <div className="flex sm:flex-col gap-2 flex-wrap sm:flex-nowrap">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/15">
                  <Icon className="w-4 h-4 text-green-300 shrink-0" />
                  <div>
                    <p className="text-white text-sm font-bold leading-none">{s.value}</p>
                    <p className="text-green-200/70 text-[10px] mt-0.5">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Hourly forecast */}
      {hourlyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-base font-bold text-gray-800">Soatlik prognoz</h2>
            <div className="flex gap-1">
              <button
                disabled={hourlyStart === 0}
                onClick={() => setHourlyStart(Math.max(0, hourlyStart - HOURLY_VISIBLE))}
                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <button
                disabled={hourlyStart + HOURLY_VISIBLE >= hourlyData.length}
                onClick={() => setHourlyStart(Math.min(hourlyData.length - HOURLY_VISIBLE, hourlyStart + HOURLY_VISIBLE))}
                className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 divide-x divide-gray-50 border-t border-gray-50">
            <AnimatePresence mode="wait">
              {visibleHours.map((h, i) => {
                const hMeta = getMeta(h.weather);
                return (
                  <motion.div
                    key={h.date}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-col items-center py-4 px-1 hover:bg-gray-50/80 transition-colors cursor-default"
                  >
                    <span className="text-[10px] text-gray-400 font-semibold mb-2">{formatHour(h.date)}</span>
                    <span className="text-xl mb-2">{hMeta.emoji}</span>
                    <span className="text-sm font-bold text-gray-800">{Math.round(h.temperature)}°</span>
                    <div className="flex items-center gap-0.5 mt-1.5">
                      <Wind className="w-2.5 h-2.5 text-gray-300" />
                      <span className="text-[9px] text-gray-400">{h.wind.speed}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Detailed hourly table */}
      {hourlyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-base font-bold text-gray-800">Batafsil prognoz</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-gray-50">
                  <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Vaqt</th>
                  <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Holat</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Harorat</th>
                  <th className="text-right px-3 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Shamol</th>
                  <th className="text-right px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Bulut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hourlyData.map((h) => {
                  const hMeta = getMeta(h.weather);
                  return (
                    <tr key={h.date} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 text-gray-600 font-medium text-sm whitespace-nowrap">{formatHour(h.date)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{hMeta.emoji}</span>
                          <span className="text-gray-600 text-xs font-medium hidden sm:block">{h.summary}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="font-bold text-gray-800">{Math.round(h.temperature)}°C</span>
                      </td>
                      <td className="px-3 py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                        {h.wind.speed} m/s {h.wind.dir}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-slate-400"
                              style={{ width: `${h.cloud_cover.total}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-7 text-right">{h.cloud_cover.total}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Data source note */}
      <p className="text-center text-[11px] text-gray-300 pb-4">
        Ma'lumot manbai: Meteosource API · {weather.timezone}
      </p>

      <AnimatePresence>
        {showLocationPrompt && (
          <LocationPrompt
            onGranted={handleLocationGranted}
            onSkip={() => setShowLocationPrompt(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Weather;
