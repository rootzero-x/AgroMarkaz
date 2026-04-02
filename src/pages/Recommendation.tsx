import React, { useState } from 'react';
import {
  MapPin, Layers, Sparkles, Droplet, Brain,
  ChevronDown, AlertTriangle, CheckCircle2, TrendingUp,
  Wind, Sprout, Wallet, Activity, Loader2, ArrowLeft, BarChart3, ChevronRight,
  Wheat, Leaf, FileText, ShieldAlert, RefreshCw, FlaskConical, Waves,
  ShoppingCart, AlertCircle, Package, Bug, Camera, History,
  Newspaper, Truck, Users, ShoppingBag, Bell, Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MarketAnalysisModule from '../components/MarketAnalysis';
import DiseaseManagementModule from '../components/DiseaseManagement';

interface AICropResult {
  ekin_nomi: string;
  moslik_darajasi: "yuqori" | "o'rtacha" | "past";
  tavsif: string;
  xarajat: {
    "umumiy_so'm_1_gektar": number;
    tavsif: string;
  };
  mehnat_xarajati: {
    ish_kunlari_1_gektar: number;
    tavsif: string;
  };
  suv_talabi: {
    m3_gektar_yil: number;
    tavsif: string;
  };
  prognoz_hosil: string;
  hosildorlik_tahlili?: {
    ortacha_hosil_tonna_gektar: number;
    tahlil: string;
  };
  "taxminiy_foyda_so'm_gektar": number;
  eslatmalar: string;
  oldin_hosil_tahlili?: {
    oldin_hosil: string;
    moslik_darajasi: string;
    tahlil: string;
  };
  tavsiya_etilgan_urug_navi?: {
    nav_nomi: string;
    moslik_tahlili: string;
  };
  suv_xavfi_va_choralar?: string;
}

const REGIONS = [
  "Andijon viloyati", "Buxoro viloyati", "Farg'ona viloyati", "Jizzax viloyati",
  "Xorazm viloyati", "Namangan viloyati", "Navoiy viloyati", "Qashqadaryo viloyati",
  "Qoraqalpog'iston Respublikasi", "Samarqand viloyati", "Sirdaryo viloyati",
  "Surxondaryo viloyati", "Toshkent viloyati", "Toshkent shahri"
];

const SOIL_TYPES = ["Qumloq", "Loyli", "Sopol", "Sho'rli"];
const WATER_LEVELS = ["Yuqori", "O'rta", "Past"];

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
};

const renderYieldChart = (forecastStr: string, avgVal: number) => {
  let min = avgVal * 0.8;
  let max = avgVal * 1.2;
  const nums = forecastStr.match(/\d+(\.\d+)?/g);
  if (nums && nums.length >= 2) {
    min = parseFloat(nums[0]);
    max = parseFloat(nums[1]);
  } else if (nums && nums.length === 1) {
    min = parseFloat(nums[0]);
    max = avgVal > min ? avgVal + (avgVal - min) : min * 1.2;
  }

  if (isNaN(min)) min = 0;
  if (isNaN(max)) max = avgVal * 1.2;

  const maxScale = Math.max(max * 1.15, avgVal * 1.15);

  const bars = [
    { label: "Minimal (Xavf darajasi)", val: min, color: "bg-slate-400" },
    { label: "O'rtacha (Barqaror holda)", val: avgVal, color: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] z-10" },
    { label: "Maksimal (Optimal sharoit)", val: max, color: "bg-emerald-500" }
  ];

  return (
    <div className="mt-6 pt-5 border-t border-slate-200/80 w-full overflow-hidden">
      <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5" /> Hosildorlik Grafik Tahlili (gektar/tonna)
      </h5>
      <div className="space-y-3.5 w-full">
        {bars.map((item, i) => {
          const percentage = Math.min(100, (item.val / maxScale) * 100);
          return (
            <div key={i} className="flex items-center gap-3 w-full group">
              <div className="w-[105px] sm:w-[130px] text-[10px] sm:text-[11px] font-bold text-slate-600 truncate shrink-0" title={item.label}>
                {item.label}
              </div>
              <div className="flex-1 h-2.5 sm:h-3 bg-slate-200/70 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                  className={`h-full rounded-r-full ${item.color} group-hover:brightness-110 transition-all`}
                />
              </div>
              <div className="w-12 sm:w-16 text-right font-mono text-[11px] sm:text-[13px] font-bold text-slate-800 shrink-0">
                {item.val} <span className="text-[9px] sm:text-[10px] text-slate-400">t</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AIPlannerModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [hudud, setHudud] = useState('');
  const [yerHajmi, setYerHajmi] = useState<string>('25');
  const [tuproqTuri, setTuproqTuri] = useState('Qumloq');
  const [suvMavjudligi, setSuvMavjudligi] = useState('');
  const [oldingiHosil, setOldingiHosil] = useState('');
  const [urugNavi, setUrugNavi] = useState('');
  const [qoshimchaMalumot, setQoshimchaMalumot] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AICropResult[] | null>(null);
  const [error, setError] = useState('');

  const isFormValid = hudud && yerHajmi && tuproqTuri && suvMavjudligi;

  const handleAnalyze = async () => {
    if (!isFormValid) {
      setError("Tahlil uchun barcha ma'lumotlarni kiriting.");
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const res = await api.post('/aiplan', {
        hudud,
        yer_hajmi: Number(yerHajmi),
        tuproq_turi: tuproqTuri,
        suv_mavjudligi: suvMavjudligi,
        ...(oldingiHosil.trim() && { oldingi_hosil: oldingiHosil.trim() }),
        ...(urugNavi.trim() && { urug_t: urugNavi.trim() }),
        ...(qoshimchaMalumot.trim() && { qoshimcha_malumot: qoshimchaMalumot.trim() }),
      });
      let data = res.data?.recommendations || res.data?.plan || res.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { }
      }
      setResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "AI bilan ulanishda xatolik yuz berdi. Keyinroq urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-[100vw] overflow-x-hidden p-2 sm:p-0"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm w-fit active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" /> Ortga qaytish
      </button>

      <div className="sticky top-0 z-50 bg-primary-600 rounded-3xl p-6 md:p-8 relative overflow-hidden ring-0 border-0 shadow-lg shadow-primary-600/30">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 z-10 relative flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary-200" /> AI Agronom
        </h1>
        <p className="text-primary-100 text-sm md:text-base font-medium z-10 relative max-w-xl">
          Sun'iy intellekt yordamida yeringiz uchun eng daromadli va mos keluvchi ekinlarni kashf eting.
        </p>
        <svg className="absolute -right-4 -bottom-6 md:right-10 md:bottom-[-20%] w-32 h-32 md:w-64 md:h-64 text-white/10 pointer-events-none rounded-full" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50" /></svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[220px] w-full">
          <div className="card-premium p-6 md:p-7">
            <h2 className="text-[19px] font-bold text-gray-900 mb-6 font-display">Ma'lumotlarni kiriting</h2>
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <MapPin className="w-4 h-4 text-primary-600" /> Hudud
                </label>
                <div className="relative">
                  <select
                    value={hudud}
                    onChange={(e) => setHudud(e.target.value)}
                    className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-800 text-[15px] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Tanlang</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Layers className="w-4 h-4 text-primary-600" /> Yer hajmi (gektar)
                </label>
                <input
                  type="number"
                  value={yerHajmi}
                  onChange={(e) => setYerHajmi(e.target.value)}
                  placeholder="Masalan: 25"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-800 text-[15px]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Sparkles className="w-4 h-4 text-primary-600" /> Tuproq turi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SOIL_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setTuproqTuri(type)}
                      className={`py-3 rounded-[12px] text-sm font-semibold transition-all duration-200 ${tuproqTuri === type ? 'bg-primary-50 text-primary-700 border border-primary-600 shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Droplet className="w-4 h-4 text-primary-600" /> Suv mavjudligi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WATER_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setSuvMavjudligi(level)}
                      className={`py-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200 ${suvMavjudligi === level ? 'bg-primary-50 text-primary-700 border border-primary-600 shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Wheat className="w-4 h-4 text-primary-600" /> Oldingi hosil
                  <span className="ml-auto text-[11px] font-normal text-gray-400">Ixtiyoriy</span>
                </label>
                <input
                  type="text"
                  value={oldingiHosil}
                  onChange={(e) => setOldingiHosil(e.target.value)}
                  placeholder="Masalan: g'o'za, bug'doy, pomidor"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-800 text-[14px] placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Leaf className="w-4 h-4 text-primary-600" /> Urug' navi
                  <span className="ml-auto text-[11px] font-normal text-gray-400">Ixtiyoriy</span>
                </label>
                <input
                  type="text"
                  value={urugNavi}
                  onChange={(e) => setUrugNavi(e.target.value)}
                  placeholder="Masalan: F1, mahalliy nav, Uzbek-2"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-800 text-[14px] placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <FileText className="w-4 h-4 text-primary-600" /> Qo'shimcha ma'lumotlar
                  <span className="ml-auto text-[11px] font-normal text-gray-400">Ixtiyoriy</span>
                </label>
                <textarea
                  value={qoshimchaMalumot}
                  onChange={(e) => setQoshimchaMalumot(e.target.value)}
                  placeholder="Qishloq sharoiti, maqsad bozor, yer holati yoki boshqa muhim ma'lumotlar..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-800 text-[14px] resize-none placeholder:text-gray-300 leading-relaxed"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-[13px] font-medium animate-in fade-in zoom-in-95">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <button
                onClick={handleAnalyze}
                disabled={!isFormValid || loading}
                className={`w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${isFormValid && !loading ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                <span>{loading ? "Tahlil qilinmoqda..." : "AI tahlil qilish"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 w-full max-w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {!loading && !results && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/50 border border-dashed border-gray-200 rounded-3xl"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Sprout className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eng mos ekinlarni aniqlang</h3>
                <p className="text-gray-500 max-w-sm mx-auto text-[15px] leading-relaxed">
                  Chap tomondagi ma'lumotlarni to'ldiring va AI yordamida yeringizga eng mos, serdaromad ekinlar ro'yxatini shakllantiring.
                </p>
              </motion.div>
            )}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                  <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">Ma'lumotlar tahlil qilinmoqda...</h3>
                  <p className="text-gray-500">Iqlim, tuproq va bozor konyunkturasi o'rganilmoqda</p>
                </div>
              </motion.div>
            )}
            {!loading && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between card-premium p-5 mb-2 border-b-4 border-primary-500 rounded-3xl">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Tahlil natijalari</h2>
                    <p className="text-[13px] text-gray-500">{results.length} ta mos ekin topildi</p>
                  </div>
                  <div className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-[13px] font-bold flex items-center gap-1.5 border border-primary-100">
                    <CheckCircle2 className="w-4 h-4" /> Muvaffaqiyatli
                  </div>
                </div>
                {results.map((crop, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="card-premium p-6 md:p-8 relative overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-2xl font-bold text-gray-900 font-display capitalize">{crop.ekin_nomi}</h3>
                          <span className={`px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-wide ${crop.moslik_darajasi === 'yuqori' ? 'bg-green-100 text-green-700 border border-green-200' : crop.moslik_darajasi === "o'rtacha" ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>{crop.moslik_darajasi} moslik</span>
                        </div>
                        <p className="text-[15px] text-gray-600 leading-relaxed max-w-2xl">{crop.tavsif}</p>
                      </div>
                      <div className="text-left md:text-right shrink-0 bg-gray-50 md:bg-transparent rounded-xl p-4 md:p-0 border border-gray-100 md:border-transparent">
                        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Taxminiy sof foyda</p>
                        <p className="text-2xl font-bold text-primary-600 font-mono tracking-tight">{formatMoney(crop["taxminiy_foyda_so'm_gektar"])}<span className="text-sm text-gray-400 font-sans ml-1">/ ga</span></p>
                      </div>
                    </div>
                    <hr className="border-gray-100 my-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="flex flex-col p-5 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group/stat">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-white p-2.5 rounded-2xl shadow-sm text-amber-500 border border-gray-100 group-hover/stat:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Prognoz hosil</p>
                        </div>
                        <div>
                          {(() => {
                            const parts = crop.prognoz_hosil.split(',');
                            return (
                              <>
                                <p className="text-[17px] font-black text-gray-900 leading-tight">{parts[0]}</p>
                                {parts[1] && <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-medium">{parts.slice(1).join(',').trim()}</p>}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex flex-col p-5 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group/stat">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-white p-2.5 rounded-2xl shadow-sm text-blue-500 border border-gray-100 group-hover/stat:scale-110 transition-transform">
                            <Droplet className="w-5 h-5" />
                          </div>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Suv talabi</p>
                        </div>
                        <div>
                          <p className="text-[17px] font-black text-gray-900 leading-tight">{crop.suv_talabi.m3_gektar_yil} <span className="text-xs text-gray-400 font-bold ml-1">m³/yil</span></p>
                          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-medium">{crop.suv_talabi.tavsif}</p>
                        </div>
                      </div>
                      <div className="flex flex-col p-5 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group/stat">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-white p-2.5 rounded-2xl shadow-sm text-emerald-500 border border-gray-100 group-hover/stat:scale-110 transition-transform">
                            <Wallet className="w-5 h-5" />
                          </div>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Umumiy xarajat</p>
                        </div>
                        <div>
                          <p className="text-[17px] font-black text-gray-900 leading-tight">{formatMoney(crop.xarajat["umumiy_so'm_1_gektar"])}</p>
                          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-medium">Gektariga sarflanadigan jami mablag'</p>
                        </div>
                      </div>
                    </div>
                    {crop.hosildorlik_tahlili && (
                      <div className="mb-6 bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-slate-200">
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-slate-600 shrink-0 self-start">
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 w-full min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">Hosildorlik Tahlili</h4>
                              <span className="bg-white text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">O'rtacha {crop.hosildorlik_tahlili.ortacha_hosil_tonna_gektar} t/ga</span>
                            </div>
                            <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{crop.hosildorlik_tahlili.tahlil}</p>
                            {renderYieldChart(crop.prognoz_hosil, crop.hosildorlik_tahlili.ortacha_hosil_tonna_gektar)}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50/30 overflow-hidden relative group/block">
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-slate-100/50">
                          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 text-slate-600"><Wallet className="w-4 h-4" /></div>
                          <div className="flex-1"><h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest leading-none">Xarajatlar taqsimoti</h4></div>
                        </div>
                        <div className="p-5"><p className="text-[14px] text-slate-700 leading-relaxed font-medium">{crop.xarajat.tavsif}</p></div>
                      </div>
                      <div className="rounded-3xl border border-amber-100 bg-amber-50/30 overflow-hidden relative group/block">
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-amber-100 bg-amber-50/50">
                          <div className="bg-white p-2 rounded-xl shadow-sm border border-amber-100 text-amber-600"><Activity className="w-4 h-4" /></div>
                          <div className="flex-1"><h4 className="text-[12px] font-bold text-amber-900 uppercase tracking-widest leading-none">Mehnat sarfi</h4></div>
                        </div>
                        <div className="p-5">
                          <div className="inline-flex items-center gap-2 bg-amber-100/50 border border-amber-200 rounded-lg px-2.5 py-1 mb-3"><span className="text-[13px] font-bold text-amber-800">{crop.mehnat_xarajati.ish_kunlari_1_gektar} ish kuni (ga)</span></div>
                          <p className="text-[14px] text-amber-950 leading-relaxed font-medium">{crop.mehnat_xarajati.tavsif}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 mt-8">
                      {crop.oldin_hosil_tahlili && (
                        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/30 overflow-hidden relative group/block">
                          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/50">
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-emerald-100 text-emerald-600"><RefreshCw className="w-4 h-4" /></div>
                            <div className="flex-1"><h4 className="text-[12px] font-bold text-emerald-900 uppercase tracking-widest">Ekin Almashinuv Tahlili</h4></div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">{crop.oldin_hosil_tahlili.oldin_hosil} dan keyin</span>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${crop.oldin_hosil_tahlili.moslik_darajasi.toLowerCase() === 'yuqori' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-white'}`}>{crop.oldin_hosil_tahlili.moslik_darajasi} moslik</span>
                            </div>
                          </div>
                          <div className="p-5"><p className="text-[14px] text-emerald-950 leading-relaxed font-medium">{crop.oldin_hosil_tahlili.tahlil}</p></div>
                        </div>
                      )}
                      {crop.tavsiya_etilgan_urug_navi && (
                        <div className="rounded-3xl border border-primary-100 bg-primary-50/20 overflow-hidden relative group/block">
                          <div className="flex items-center gap-3 px-5 py-4 border-b border-primary-100 bg-primary-50/40">
                            <div className="bg-primary-600 p-2 rounded-xl shadow-md shadow-primary-600/20 text-white"><FlaskConical className="w-4 h-4" /></div>
                            <div className="flex-1"><h4 className="text-[13px] font-bold text-primary-900 uppercase tracking-widest leading-none">Tavsiya etilgan urug' navi</h4></div>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="bg-white border border-primary-100 p-4 rounded-2xl shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.1em]">Nav nomi</span>
                                <Leaf className="w-3 h-3 text-primary-500" />
                              </div>
                              <p className="text-xl font-bold text-primary-700 leading-tight">{crop.tavsiya_etilgan_urug_navi.nav_nomi}</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-2xl border border-primary-50/50"><p className="text-[14px] text-gray-700 leading-relaxed font-medium">{crop.tavsiya_etilgan_urug_navi.moslik_tahlili}</p></div>
                          </div>
                        </div>
                      )}
                      {crop.suv_xavfi_va_choralar && (
                        <div className="rounded-3xl border border-blue-100 bg-blue-50/30 overflow-hidden relative group/block">
                          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-blue-100 bg-blue-50/50">
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-100 text-blue-600"><Waves className="w-4 h-4" /></div>
                            <div className="flex-1"><h4 className="text-[12px] font-bold text-blue-900 uppercase tracking-widest">Suv xavfi va choralar</h4></div>
                            <div className="bg-blue-600 text-white p-1 rounded-full animate-pulse shadow-lg shadow-blue-500/30"><ShieldAlert className="w-3.5 h-3.5" /></div>
                          </div>
                          <div className="p-5"><p className="text-[14px] text-blue-950 leading-relaxed font-medium">{crop.suv_xavfi_va_choralar}</p></div>
                        </div>
                      )}
                    </div>
                    <div className="mt-8 bg-white rounded-3xl p-6 border-l-4 border-primary-600 shadow-sm shadow-primary-600/5 relative overflow-hidden group/notes">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 opacity-50 group-hover/notes:scale-110 transition-transform"></div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-50 p-2.5 rounded-2xl text-primary-600 shrink-0 shadow-sm border border-primary-100"><Wind className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <h4 className="text-[13px] font-black text-primary-900 mb-1.5 uppercase tracking-[0.15em] pt-1 leading-none">Muhim eslatmalar</h4>
                          <p className="text-[15px] text-gray-700 leading-relaxed font-medium">{crop.eslatmalar}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const Recommendation: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <div className="pt-2 md:pt-4 lg:pt-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {!activeModule ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-[#5C8D46] rounded-[2rem] px-8 py-5 md:px-10 md:py-6 text-white shadow-2xl shadow-emerald-900/20 mb-6 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-xl md:text-3xl font-black mb-1.5 tracking-tight leading-tight">
                  Tavsiyalar markazi
                </h1>
                <p className="text-emerald-50/90 text-[12px] md:text-base font-medium opacity-90 max-w-2xl leading-snug">
                  Sizning yeringiz uchun qishloq xo'jaligi ekspertlaridan turli xil ilg'or tavsiyalar va yechimlar markazi.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl opacity-30"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
              {/* Module Card: AI Planner */}
              <button
                onClick={() => setActiveModule('ai_planner')}
                className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-emerald-500 shadow-xl shadow-gray-200/50 hover:shadow-emerald-600/10 transition-all hover:-translate-y-1 relative overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/30 rounded-bl-full -z-10 group-hover:bg-emerald-50/50 transition-colors"></div>
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform shadow-sm">
                  <Brain className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    AI Agronom <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-widest">Yangi</span>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Sun'iy intellekt yordamida yeringizga eng mos va serdaromad ekinlarni aniqlang.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-emerald-600 group-hover:text-emerald-700 transition-colors">
                  Ishga tushirish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Module Card: Market Analysis */}
              <button
                onClick={() => setActiveModule('market_analysis')}
                className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-blue-500 shadow-xl shadow-gray-200/50 hover:shadow-blue-600/10 transition-all hover:-translate-y-1 relative overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-bl-full -z-10 group-hover:bg-blue-50/50 transition-colors"></div>
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform shadow-sm">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                     Bozor Tahlili <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-black px-2 py-1 rounded-full tracking-widest">PRO</span>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Yilik mahsulotlar ishlab chiqarish va bozor talabi muvozanatini kuzating.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-blue-600 group-hover:text-blue-700 transition-colors">
                  Tahlilni ko'rish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Module Card: Disease Management */}
              <button
                onClick={() => setActiveModule('disease_management')}
                className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-rose-500 shadow-xl shadow-gray-200/50 hover:shadow-rose-600/10 transition-all hover:-translate-y-1 relative overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/30 rounded-bl-full -z-10 group-hover:bg-rose-50/50 transition-colors"></div>
                <div className="bg-rose-50 p-3 rounded-2xl text-rose-600 border border-rose-100 group-hover:scale-110 transition-transform shadow-sm">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                     Kasalliklar <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-widest text-center min-w-[70px]">AI Diagnoz</span>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Ekinlaringizdagi kasallik va zararkunandalarni AI yordamida aniqlang.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-rose-600 group-hover:text-rose-700 transition-colors">
                  Diagnozni boshlash <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Module Card: Agro Marketplace */}
              <button
                onClick={() => window.open('https://agrom24.uz', '_blank')}
                className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-violet-500 shadow-xl shadow-gray-200/50 hover:shadow-violet-600/10 transition-all hover:-translate-y-1 relative overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50/30 rounded-bl-full -z-10 group-hover:bg-violet-100/50 transition-colors"></div>
                <div className="bg-violet-50 p-3 rounded-2xl text-violet-600 border border-violet-100 group-hover:scale-110 transition-transform shadow-sm">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                      Agro Marketplace <span className="bg-violet-100 text-violet-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-widest">Bozor</span>
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Mahsulotlarni to'g'ridan-to'g'ri sotish va sotib olish milliy platformasi.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-violet-600 group-hover:text-violet-700 transition-colors">
                  Bozorga kirish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Module Card: Equipment Rental */}
              <div className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-indigo-500 shadow-xl shadow-gray-200/50 opacity-80 cursor-not-allowed relative overflow-hidden">
                <div className="absolute top-0 right-10 w-24 h-24 bg-indigo-50/30 rounded-full blur-2xl -z-10"></div>
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100 shadow-sm">
                  <Truck className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Texnika ijarasi</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider">Tez orada</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Zamonaviy qishloq xo'jaligi texnikalarini ijara qilish tizimi.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400">
                   Yaqinda ishga tushadi
                </div>
              </div>

              {/* Module Card: Farmers Community */}
              <div className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-teal-500 shadow-xl shadow-gray-200/50 opacity-80 cursor-not-allowed relative overflow-hidden">
                <div className="absolute top-0 right-10 w-24 h-24 bg-teal-50/30 rounded-full blur-2xl -z-10"></div>
                <div className="bg-teal-50 p-3 rounded-2xl text-teal-600 border border-teal-100 shadow-sm">
                  <Users className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Fermerlar hamjamiyati</h3>
                    <span className="bg-teal-100 text-teal-700 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider">Tez orada</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Tajriba almashish va mutaxassislar bilan muloqot markazi.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400">
                   Yaqinda ishga tushadi
                </div>
              </div>

              {/* Module Card: Agro News */}
              <div className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-amber-500 shadow-xl shadow-gray-200/50 opacity-80 cursor-not-allowed relative overflow-hidden">
                <div className="absolute top-0 right-10 w-24 h-24 bg-amber-50/30 rounded-full blur-2xl -z-10"></div>
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 border border-amber-100 shadow-sm">
                  <Newspaper className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Agro yangiliklar</h3>
                    <span className="bg-amber-100 text-amber-700 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider">Tez orada</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Qishloq xo'jaligi sohasidagi so'nggi xabarlar va texnologiyalar.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400">
                   Yaqinda ishga tushadi
                </div>
              </div>

              {/* Module Card: Real-time alert system */}
              <div className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-yellow-500 shadow-xl shadow-gray-200/50 opacity-80 cursor-not-allowed relative overflow-hidden">
                <div className="absolute top-0 right-10 w-24 h-24 bg-yellow-50/30 rounded-full blur-2xl -z-10"></div>
                <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600 border border-yellow-100 shadow-sm">
                  <Bell className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Real-time alerts</h3>
                    <span className="bg-yellow-100 text-yellow-700 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider">Tez orada</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Ob-havo va zararkunandalar haqida tezkor xabarnomalar.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400">
                   Yaqinda ishga tushadi
                </div>
              </div>

              {/* Module Card: Qarz / Invest */}
              <div className="group text-left bg-white rounded-[2rem] p-6 md:p-7 flex flex-col items-start gap-4 border-l-4 border-emerald-600 shadow-xl shadow-gray-200/50 opacity-80 cursor-not-allowed relative overflow-hidden">
                <div className="absolute top-0 right-10 w-24 h-24 bg-emerald-50/30 rounded-full blur-2xl -z-10"></div>
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 border border-emerald-100 shadow-sm">
                  <Banknote className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Qarz / Invest</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider">Tez orada</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">Agrosanoat uchun moliyaviy yordam va investitsiyalar.</p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-400">
                   Yaqinda ishga tushadi
                </div>
              </div>

            </div>
          </motion.div>
        ) : activeModule === 'ai_planner' ? (
          <motion.div key="ai_planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <AIPlannerModule onBack={() => setActiveModule(null)} />
          </motion.div>
        ) : activeModule === 'market_analysis' ? (
          <motion.div key="market_analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <MarketAnalysisModule onBack={() => setActiveModule(null)} />
          </motion.div>
        ) : (
          <motion.div key="disease_management" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <DiseaseManagementModule onBack={() => setActiveModule(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recommendation;