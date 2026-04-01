import React, { useState } from 'react';
import { 
  MapPin, Layers, Sparkles, Droplet, Brain, 
  ChevronDown, AlertTriangle, CheckCircle2, TrendingUp,
  Wind, Sprout, Wallet, Activity, Loader2, ArrowLeft, BarChart3, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

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

const AIPlannerModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [hudud, setHudud] = useState('');
  const [yerHajmi, setYerHajmi] = useState<string>('25');
  const [tuproqTuri, setTuproqTuri] = useState('Qumloq');
  const [suvMavjudligi, setSuvMavjudligi] = useState('');

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
        suv_mavjudligi: suvMavjudligi
      });
      let data = res.data?.recommendations || res.data?.plan || res.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch(e) {}
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
      className="space-y-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Ortga qaytish
      </button>

      {/* Module Header */}
      <div className="bg-primary-600 rounded-3xl p-6 md:p-8 relative overflow-hidden ring-0 border-0 shadow-lg shadow-primary-600/30">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 z-10 relative flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary-200" /> AI Agronom
        </h1>
        <p className="text-primary-100 text-sm md:text-base font-medium z-10 relative max-w-xl">
          Sun'iy intellekt yordamida yeringiz uchun eng daromadli va mos keluvchi ekinlarni kashf eting.
        </p>
        <svg className="absolute -right-4 -bottom-6 md:right-10 md:bottom-[-20%] w-32 h-32 md:w-64 md:h-64 text-white/10 pointer-events-none rounded-full" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50"/></svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Panel (Left) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="card-premium p-6 md:p-7">
            <h2 className="text-[19px] font-bold text-gray-900 mb-6 font-display">Ma'lumotlarni kiriting</h2>
            
            <div className="space-y-5">
              
              {/* Hudud */}
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

              {/* Yer Hajmi */}
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

              {/* Tuproq turi */}
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Sparkles className="w-4 h-4 text-primary-600" /> Tuproq turi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SOIL_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setTuproqTuri(type)}
                      className={`py-3 rounded-[12px] text-sm font-semibold transition-all duration-200
                        ${tuproqTuri === type 
                          ? 'bg-primary-50 text-primary-700 border border-primary-600 shadow-sm' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suv mavjudligi */}
              <div>
                <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700 mb-2.5">
                  <Droplet className="w-4 h-4 text-primary-600" /> Suv mavjudligi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WATER_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setSuvMavjudligi(level)}
                      className={`py-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200
                        ${suvMavjudligi === level 
                          ? 'bg-primary-50 text-primary-700 border border-primary-600 shadow-sm' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
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
                className={`w-full py-4 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  isFormValid && !loading
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/30' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Brain className="w-5 h-5" />
                )}
                <span>{loading ? "Tahlil qilinmoqda..." : "AI tahlil qilish"}</span>
              </button>

            </div>
          </div>
        </div>

        {/* Results Panel (Right) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* Initial State */}
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

            {/* Loading State */}
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

            {/* Results State */}
            {!loading && results && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between card-premium p-5 mb-2">
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
                    
                    {/* Crop Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-2xl font-bold text-gray-900 font-display capitalize">{crop.ekin_nomi}</h3>
                          <span className={`px-2.5 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-wide
                            ${crop.moslik_darajasi === 'yuqori' ? 'bg-green-100 text-green-700 border border-green-200' : 
                              crop.moslik_darajasi === "o'rtacha" ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                              'bg-red-100 text-red-700 border border-red-200'}`}>
                            {crop.moslik_darajasi} moslik
                          </span>
                        </div>
                        <p className="text-[15px] text-gray-600 leading-relaxed max-w-2xl">{crop.tavsif}</p>
                      </div>
                      <div className="text-left md:text-right shrink-0 bg-gray-50 md:bg-transparent rounded-xl p-4 md:p-0 border border-gray-100 md:border-transparent">
                        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Taxminiy sof foyda</p>
                        <p className="text-2xl font-bold text-primary-600 font-mono tracking-tight">{formatMoney(crop["taxminiy_foyda_so'm_gektar"])}<span className="text-sm text-gray-400 font-sans ml-1">/ ga</span></p>
                      </div>
                    </div>

                    <hr className="border-gray-100 my-6" />

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {/* Yield */}
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-amber-500 shrink-0 border border-gray-100">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Prognoz hosil</p>
                          <p className="text-[15px] font-bold text-gray-800">{crop.prognoz_hosil}</p>
                        </div>
                      </div>
                      
                      {/* Water */}
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500 shrink-0 border border-gray-100">
                          <Droplet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Suv talabi</p>
                          <p className="text-[15px] font-bold text-gray-800">{crop.suv_talabi.m3_gektar_yil} <span className="text-xs text-gray-500 font-medium">m³/yil</span></p>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-rose-500 shrink-0 border border-gray-100">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Umumiy xarajat</p>
                          <p className="text-[15px] font-bold text-gray-800">{formatMoney(crop.xarajat["umumiy_so'm_1_gektar"])}</p>
                        </div>
                      </div>
                    </div>

                    {/* Hosildorlik Tahlili (Yangi qo'shilgan) */}
                    {crop.hosildorlik_tahlili && (
                      <div className="mb-6 bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row gap-4">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-slate-600 shrink-0 self-start">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">Hosildorlik Tahlili</h4>
                            <span className="bg-white text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                              O'rtacha {crop.hosildorlik_tahlili.ortacha_hosil_tonna_gektar} t/ga
                            </span>
                          </div>
                          <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                            {crop.hosildorlik_tahlili.tahlil}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Detailed Accordions / Info sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="flex items-center gap-2 text-[13px] font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                            <Wallet className="w-4 h-4 text-gray-400" /> Xarajatlar taqsimoti
                          </h4>
                          <p className="text-[14px] text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 h-full">{crop.xarajat.tavsif}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div>
                          <h4 className="flex items-center gap-2 text-[13px] font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                            <Activity className="w-4 h-4 text-gray-400" /> Mehnat sarfi
                          </h4>
                          <p className="text-[14px] text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <span className="font-semibold text-gray-800 mr-2">{crop.mehnat_xarajati.ish_kunlari_1_gektar} ish kuni.</span>
                            {crop.mehnat_xarajati.tavsif}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes (Eslatmalar) */}
                    <div className="mt-6 bg-primary-50 rounded-2xl p-4 border border-primary-100 flex items-start gap-3">
                      <Wind className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[13px] font-bold text-primary-900 mb-1 uppercase tracking-wide">Muhim eslatmalar</h4>
                        <p className="text-[14px] text-primary-800 leading-relaxed">{crop.eslatmalar}</p>
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

  if (activeModule === 'ai_planner') {
    return <AIPlannerModule onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tavsiyalar markazi</h1>
          <p className="text-gray-500 max-w-xl">
            Sizning yeringiz uchun qishloq xo'jaligi ekspertlaridan turli xil ilg'or tavsiyalar va yechimlar.
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Module Card: AI Planner */}
        <button 
          onClick={() => setActiveModule('ai_planner')}
          className="group text-left card-premium p-6 md:p-8 flex flex-col items-start gap-4 hover:border-primary-200 transition-all hover:shadow-primary-600/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-bl-full -z-10 group-hover:bg-primary-50 transition-colors"></div>
          <div className="bg-primary-50 p-3 rounded-2xl text-primary-600 border border-primary-100 group-hover:scale-110 transition-transform">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              AI Agronom <span className="bg-primary-100 text-primary-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Yangi</span>
            </h3>
            <p className="text-[14px] text-gray-500 leading-relaxed h-12">
              Sun'iy intellekt yordamida yeringizga eng mos va serdaromad ekinlarni aniqlang.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary-600 group-hover:text-primary-700">
            Ishga tushirish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Placeholder Module 2 */}
        <div className="opacity-60 cursor-not-allowed group text-left card-premium p-6 md:p-8 flex flex-col items-start gap-4 border-dashed relative overflow-hidden">
          <div className="bg-gray-100 p-3 rounded-2xl text-gray-400 border border-gray-200">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Hosildorlik Tahlili</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed h-12">
              O'tgan yillardagi hosil ma'lumotlaringiz asosida kelajak prognozlari.
            </p>
          </div>
           <div className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-400">
            Tez orada
          </div>
        </div>

      </div>

    </div>
  );
};

export default Recommendation;
