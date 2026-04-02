import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  motion, AnimatePresence 
} from 'framer-motion';
import { 
  ShoppingCart, ArrowLeft, Package, ArrowRightLeft, 
  ArrowUpRight, ArrowDownRight, AlertCircle, AlertTriangle,
  Wheat, Leaf, Layers, Sprout, X, 
  ArrowRight,
  TrendingUp, Globe, Calendar, Zap, CheckCircle2,
  ShieldAlert, Activity, Target
} from 'lucide-react';

interface MarketProduct {
  id: number;
  name: string;
  type: string;
  icon: React.ReactNode;
  production: number;
  demand: number;
  unit: string;
  status: string;
  color: string;
  description: string;
  trend: "up" | "stable" | "down";
  seasonality: string;
  targetMarkets?: string[];
  risks: string[];
}

const MARKET_DATA: MarketProduct[] = [
  {
    id: 1,
    name: "Bug'doy",
    type: "Donli ekin",
    icon: <Wheat className="w-5 h-5" />,
    production: 1200000,
    demand: 950000,
    unit: "tonna",
    status: "Eksport",
    color: "emerald",
    trend: "up",
    seasonality: "Iyun - Iyul",
    targetMarkets: ["Rossiya", "Qozog'iston", "Turkiya"],
    risks: ["Suv tanqisligi", "Zararkunandalar", "Narx o'zgaruvchanligi"],
    description: "Bug'doy yetishtirish bo'yicha barqaror o'sish kuzatilmoqda. Jami hosil ichki ehtiyojni to'liq qoplaydi va eksport imkoniyatini yaratadi."
  },
  {
    id: 2,
    name: "Paxta (G'o'za)",
    type: "Texnik ekin",
    icon: <Layers className="w-5 h-5" />,
    production: 3200000,
    demand: 3200000,
    unit: "tonna",
    status: "Balans",
    color: "primary",
    trend: "stable",
    seasonality: "Sentabr - Noyabr",
    targetMarkets: ["Xitoy", "Turkiya", "Vyetnam"],
    risks: ["Logistika kechikishi", "Sifat nazorati"],
    description: "Paxta sanoati to'liq klaster tizimiga o'tgan bo'lib, ishlab chiqarish va mahalliy zavodlar talabi muvozanatda saqlanmoqda."
  },
  {
    id: 3,
    name: "Pomidor",
    type: "Sabzavot",
    icon: <Leaf className="w-5 h-5" />,
    production: 180000,
    demand: 220000,
    unit: "tonna",
    status: "Import",
    color: "rose",
    trend: "down",
    seasonality: "May - Oktabr",
    targetMarkets: ["Rossiya", "Qozog'iston"],
    risks: ["Mavsumiy kasalliklar", "Issiqxonalarda energiya sarfi"],
    description: "Mavsumiy issiqxonalar va ochiq maydonlardagi hosil bozor talabidan ortda qolmoqda. Talabni qoplash uchun qo'shimcha import zarur."
  },
  {
    id: 4,
    name: "Kartoshka",
    type: "Ildizmeva",
    icon: <Package className="w-5 h-5" />,
    production: 250000,
    demand: 210000,
    unit: "tonna",
    status: "Eksport",
    color: "emerald",
    trend: "up",
    seasonality: "Avgust - Oktabr",
    targetMarkets: ["Rossiya", "Qozog'iston", "Qirg'iziston"],
    risks: ["Saqlash infratuzilmasi", "Urug' sifati"],
    description: "Kartoshka yetishtirishda intensiv texnologiyalar qo'llanilishi natijasida hosildorlik oshdi. Ichki bozordan ortiqcha qism eksport qilinmoqda."
  },
  {
    id: 5,
    name: "Piyoz",
    type: "Sabzavot",
    icon: <Sprout className="w-5 h-5" />,
    production: 45000,
    demand: 70000,
    unit: "tonna",
    status: "Import",
    color: "rose",
    trend: "down",
    seasonality: "Iyun - Avgust",
    targetMarkets: ["Rossiya", "Janubiy Koreya"],
    risks: ["Sug'orish muammolari", "Hosildorlikning pastligi"],
    description: "Sug'orish tizimidagi muammolar va zararkunandalar tufayli piyoz hosili kutilganidan past bo'ldi. Bozor narxlarini barqarorlashtirish zarur."
  },
  {
    id: 6,
    name: "Uzum",
    type: "Meva / Bog'dorchilik",
    icon: <Zap className="w-5 h-5" />,
    production: 850000,
    demand: 600000,
    unit: "tonna",
    status: "Eksport",
    color: "emerald",
    trend: "up",
    seasonality: "Avgust - Oktabr",
    targetMarkets: ["Rossiya", "BAA", "Germaniya", "Xitoy"],
    risks: ["Sertifikatsiyalash", "Tez buzilish"],
    description: "O'zbekiston uzumlari jahon bozorida yuqori talabga ega. Eksport hajmi yildan-yilga ortib bormoqda, yangi logistika yo'laklari ochilmoqda."
  },
  {
    id: 7,
    name: "Olma",
    type: "Meva / Bog'dorchilik",
    icon: <CheckCircle2 className="w-5 h-5" />,
    production: 1100000,
    demand: 800000,
    unit: "tonna",
    status: "Eksport",
    color: "emerald",
    trend: "stable",
    seasonality: "Sentabr - Noyabr",
    targetMarkets: ["Rossiya", "Hindiston", "Qozog'iston"],
    risks: ["Raqobat", "Qayta ishlash"],
    description: "Intensiv bog'dorchilikning rivojlanishi olma ishlab chiqarishni yuqori darajaga olib chiqdi. Yuvish va saralash liniyalari eksportni osonlashtirmoqda."
  },
  {
    id: 8,
    name: "Gilos",
    type: "Meva / Bog'dorchilik",
    icon: <TrendingUp className="w-5 h-5" />,
    production: 120000,
    demand: 45000,
    unit: "tonna",
    status: "Eksport",
    color: "emerald",
    trend: "up",
    seasonality: "May - Iyun",
    targetMarkets: ["Xitoy", "Janubiy Koreya", "Rossiya", "Yevropa"],
    risks: ["Havo harorati", "Qisqa mavsum"],
    description: "Gilos - eng yuqori eksport salohiyatiga ega mahsulotlardan biri. Mavsumiy narxlar jahon bozorida juda jozibador."
  },
  {
    id: 9,
    name: "Guruch",
    type: "Donli ekin",
    icon: <Package className="w-5 h-5" />,
    production: 35000,
    demand: 420000,
    unit: "tonna",
    status: "Import",
    color: "rose",
    trend: "stable",
    seasonality: "Sentabr - Oktabr",
    targetMarkets: ["Vyetnam", "Pokiston", "Hindiston"],
    risks: ["Suv taqchilligi", "Ekologik omillar"],
    description: "Suv resurslarining yetishmovchiligi guruch yetishtirishni cheklamoqda. Ichki iste'molni qoplash uchun import hajmi oshishi kutilmoqda."
  },
  {
    id: 10,
    name: "Qovun (Poliz)",
    type: "Poliz ekinlari",
    icon: <Sprout className="w-5 h-5" />,
    production: 540000,
    demand: 320000,
    unit: "tonna",
    status: "Eksport",
    color: "emerald",
    trend: "up",
    seasonality: "Iyun - Sentabr",
    targetMarkets: ["Rossiya", "Latviya", "Germaniya", "Ukraina"],
    risks: ["Uzoq masofa", "Sifatni saqlash"],
    description: "O'zbek qovunlarining o'ziga xos ta'mi Yevropa bozorlarida katta qiziqish uyg'otmoqda. Mahsulotni saqlash va qadoqlash texnologiyalari yaxshilanmoqda."
  }
];

type SummaryType = 'export' | 'import' | 'production' | 'demand' | 'balance' | null;

const MarketAnalysisModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);
  const [summaryType, setSummaryType] = useState<SummaryType>(null);

  const stats = useMemo(() => {
    const totalProd = MARKET_DATA.reduce((acc, curr) => acc + curr.production, 0);
    const totalDemand = MARKET_DATA.reduce((acc, curr) => acc + curr.demand, 0);
    
    const deficitProducts = MARKET_DATA.filter(p => p.production < p.demand);
    const totalDeficit = deficitProducts.reduce((acc, curr) => acc + (curr.demand - curr.production), 0);
    
    const surplusProducts = MARKET_DATA.filter(p => p.production > p.demand);
    const totalSurplus = surplusProducts.reduce((acc, curr) => acc + (curr.production - curr.demand), 0);
    
    return {
      totalProd,
      totalDemand,
      totalDiff: totalProd - totalDemand,
      totalDeficit,
      deficitCount: deficitProducts.length,
      deficitProducts,
      totalSurplus,
      surplusCount: surplusProducts.length,
      surplusProducts
    };
  }, []);

  const formatNum = (num: number) => {
    return new Intl.NumberFormat('uz').format(num);
  };

  const formatShortNum = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-[100vw] overflow-x-hidden p-2 sm:p-0"
    >
      <style>{`
        .custom-modal-scroll::-webkit-scrollbar {
          display: none;
        }
        .custom-modal-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm w-fit active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" /> Ortga qaytish
      </button>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary-600 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg shadow-primary-600/30">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary-200" /> Bozor Tahlili
            </h1>
            <p className="text-primary-100 text-sm md:text-base font-medium max-w-xl">
              Qishloq xo'jaligi mahsulotlarining ishlab chiqarish va bozor talabi o'rtasidagi muvozanatini yillik kesimda kuzatib boring.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <span className="text-[10px] text-primary-200 uppercase font-black tracking-widest block">Muddat</span>
            <span className="text-white font-bold">2024 Yillik Hisobot</span>
          </div>
        </div>
        <svg className="absolute -right-4 -bottom-6 md:right-10 md:bottom-[-20%] w-32 h-32 md:w-64 md:h-64 text-white/10 pointer-events-none rounded-full" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50" /></svg>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSummaryType('production')}
          className="card-premium p-6 border-b-4 border-primary-500 cursor-pointer group transition-all hover:bg-primary-50/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-primary-50 text-primary-600 border border-primary-100 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5">Ishlab chiqarish</p>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-gray-900 leading-none">{formatShortNum(stats.totalProd)}</h3>
            <span className="text-gray-400 font-bold mb-0.5 text-sm">tonna</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSummaryType('demand')}
          className="card-premium p-6 border-b-4 border-amber-500 cursor-pointer group transition-all hover:bg-amber-50/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5">Bozor talabi</p>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-gray-900 leading-none">{formatShortNum(stats.totalDemand)}</h3>
            <span className="text-gray-400 font-bold mb-0.5 text-sm">tonna</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSummaryType('balance')}
          className="card-premium p-6 border-b-4 border-emerald-500 cursor-pointer group transition-all hover:bg-emerald-50/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5">Balans holati</p>
          </div>
          <div className="flex items-center gap-2">
            <h3 className={`text-3xl font-black leading-none ${stats.totalDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stats.totalDiff > 0 ? '+' : ''}{formatShortNum(stats.totalDiff)}
            </h3>
            {stats.totalDiff > 0 ? (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-200">ORTIQCHA</span>
            ) : (
              <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-1 rounded-full border border-rose-200">KAMOMAD</span>
            )}
          </div>
        </motion.div>
      </div>

       {/* NEW Dashboard Boxes - Row (Import/Export Highlights) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Opportunity Box */}
          {stats.totalSurplus > 0 && (
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSummaryType('export')}
              className="bg-emerald-900 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden group cursor-pointer transition-all hover:bg-emerald-800"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl pointer-events-none group-hover:bg-white/20 transition-all"></div>
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-4">
                     <div className="p-3.5 rounded-2xl bg-emerald-800 shadow-inner border border-white/20 text-white shrink-0">
                        <ArrowUpRight className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold font-display leading-tight">Eksport imkoniyati</h4>
                        <p className="text-emerald-100/80 text-[13px] font-medium uppercase tracking-widest mt-1">Jami ortiqcha hosil</p>
                     </div>
                  </div>
                  <div className="bg-emerald-800/80 backdrop-blur-md px-6 py-5 rounded-[1.5rem] border border-white/20 min-w-[220px]">
                     <h3 className="text-3xl font-black leading-none mb-2 text-emerald-400">{formatNum(stats.totalSurplus)} tonna</h3>
                     <p className="text-emerald-100 text-[13px] font-semibold">{stats.surplusCount} turdagi mahsulot uchun</p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* Import Need Box */}
          {stats.totalDeficit > 0 && (
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSummaryType('import')}
              className="bg-orange-600 rounded-[2rem] p-6 text-white shadow-xl shadow-orange-600/20 relative overflow-hidden group cursor-pointer transition-all hover:bg-orange-500"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl pointer-events-none group-hover:bg-white/20 transition-all"></div>
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-4">
                     <div className="p-3.5 rounded-2xl bg-orange-500 shadow-inner border border-white/20 text-white shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold font-display leading-tight">Import kerak</h4>
                        <p className="text-orange-100/80 text-[13px] font-medium uppercase tracking-widest mt-1">Jami kamomad</p>
                     </div>
                  </div>
                  <div className="bg-orange-500/80 backdrop-blur-md px-6 py-5 rounded-[1.5rem] border border-white/20 min-w-[220px]">
                     <h3 className="text-3xl font-black leading-none mb-2">{formatNum(stats.totalDeficit)} tonna</h3>
                     <p className="text-orange-100 text-[13px] font-semibold">{stats.deficitCount} turdagi mahsulot uchun</p>
                  </div>
               </div>
            </motion.div>
          )}
       </div>

      {/* Main List Table Area */}
      <div className="space-y-4">
        <h2 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
          Mahsulotlar bo'yicha tahlil 
          <div className="h-px flex-1 bg-gray-100"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {MARKET_DATA.map((product, idx) => {
            const coverage = Math.min(200, (product.production / product.demand) * 100);
            const diff = product.production - product.demand;
            const isShortage = diff < 0;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="card-premium p-5 md:p-6 group hover:border-primary-200 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${
                        product.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        product.color === 'rose' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        'bg-blue-50 text-blue-600 border-blue-100'
                      } border shadow-sm font-bold shrink-0`}>
                        {product.icon}
                      </div>
                      <div>
                        <h4 className="text-[17px] font-black text-gray-900 leading-tight mb-0.5">{product.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.type}</span>
                          <div className={`w-1 h-1 rounded-full ${product.trend === 'up' ? 'bg-emerald-500' : product.trend === 'down' ? 'bg-rose-500' : 'bg-gray-400'}`}></div>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 shadow-sm ${
                      product.status === 'Eksport' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      product.status === 'Import' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {product.status === 'Import' ? <AlertTriangle className="w-3 h-3" /> : product.status === 'Eksport' ? <ArrowUpRight className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                      {product.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium tracking-tight">Ishlab chiqarish:</span>
                      <span className="text-gray-900 font-black tracking-tight">{formatShortNum(product.production)} t</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium tracking-tight">Bozor talabi:</span>
                      <span className="text-gray-900 font-black tracking-tight">{formatShortNum(product.demand)} t</span>
                    </div>

                    <div className="space-y-2">
                       <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${Math.min(100, coverage)}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className={`h-full rounded-full ${
                             isShortage ? 'bg-rose-500' : 'bg-emerald-500'
                           }`}
                         />
                       </div>
                       <div className="flex justify-between items-center">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${isShortage ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {coverage.toFixed(1)}% qoplangan
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">{product.seasonality}</span>
                       </div>
                    </div>

                    <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                      isShortage ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        {isShortage ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        <span className="text-[11px] font-black uppercase tracking-widest">
                           {isShortage ? 'Yetishmayotgan' : 'Ortiqcha'}
                        </span>
                      </div>
                      <div className="text-lg font-black leading-none">
                        {formatNum(Math.abs(diff))} <span className="text-[10px] uppercase ml-0.5">t</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Detail Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:pb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-modal-scroll"
              >
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
                  >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col gap-7">
                  {/* Modal Header */}
                  <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-[2rem] border-2 ${
                      selectedProduct.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      selectedProduct.color === 'rose' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                      'bg-blue-50 text-blue-600 border-blue-100'
                    } shrink-0 shadow-sm`}>
                      {selectedProduct.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight">{selectedProduct.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">{selectedProduct.type}</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${selectedProduct.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            Trend: {selectedProduct.trend === 'up' ? "O'shishda" : selectedProduct.trend === 'down' ? 'Pasayishda' : 'Barqaror'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-emerald-50/30 rounded-[2.5rem] p-6 border border-emerald-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Leaf className="w-20 h-20 -rotate-12" />
                    </div>
                    <p className="text-[17px] text-gray-700 leading-relaxed font-medium italic relative z-10">
                      <span className="text-4xl text-emerald-200 absolute -top-4 -left-2 font-serif opacity-50">“</span>
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Stats Grid - Premium Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-emerald-600">
                          <div className="p-2 bg-emerald-50 rounded-xl"><Calendar className="w-5 h-5" /></div>
                          <span className="font-black uppercase tracking-widest text-[10px] text-gray-400">Hosil Mavsumi</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900">{selectedProduct.seasonality}</p>
                    </div>
                    <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-emerald-600">
                          <div className="p-2 bg-emerald-50 rounded-xl"><Activity className="w-5 h-5" /></div>
                          <span className="font-black uppercase tracking-widest text-[10px] text-gray-400">Bozor Holati</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900">{selectedProduct.status}</p>
                    </div>
                  </div>

                  {/* Target Markets */}
                  {selectedProduct.targetMarkets && (
                    <div className="space-y-4">
                        <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                          Asosiy bozorlar
                          <div className="h-px flex-1 bg-gray-100"></div>
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {selectedProduct.targetMarkets.map(market => (
                              <div key={market} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-5 py-3 rounded-2xl hover:bg-white hover:border-emerald-500 transition-all group">
                                <Globe className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                                <span className="text-sm font-bold text-gray-700">{market}</span>
                              </div>
                          ))}
                        </div>
                    </div>
                  )}

                  {/* Risks Section to fill space */}
                  <div className="space-y-4">
                    <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                      Potentsial xavflar
                      <div className="h-px flex-1 bg-gray-100"></div>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProduct.risks.map(risk => (
                          <div key={risk} className="flex items-center gap-3 bg-rose-50/50 border border-rose-100 px-4 py-3 rounded-2xl">
                              <ShieldAlert className="w-4 h-4 text-rose-500" />
                              <span className="text-sm font-bold text-rose-700">{risk}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* AI Advice with Dark Background - UPDATED 2 COLUMN LAYOUT */}
                  <div className="bg-gray-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -translate-y-32 translate-x-32 blur-[80px]"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
                      <div className="md:col-span-7 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                                <Zap className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h5 className="text-xl font-bold">AI Strategiyasi</h5>
                          </div>
                          <p className="text-[15px] text-gray-300 leading-relaxed font-medium">
                            {selectedProduct.production < selectedProduct.demand 
                              ? `Ushbu mahsulot boyicha bozorda sezilarli kamomad bor. Kelgusi mavsumda hosildorlikni ga/30-40% oshirish bozor narxlariga ijobiy ta'sir qiladi.` 
                              : `Eksport salohiyati juda yuqori. Mahsulot sifatini jahon standartlariga (Global G.A.P) moslashtirish daromadni 2 barobar ko'paytirish imkonini beradi.`}
                          </p>
                      </div>

                      <div className="md:col-span-5 flex flex-col justify-center border-l-0 md:border-l border-white/10 md:pl-8 space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-emerald-400">
                                <span>Muvaffaqiyat ehtimoli</span>
                                <span>85%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_10px_#10b981]"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className="p-3 bg-emerald-500/10 rounded-xl"><Target className="w-6 h-6 text-emerald-500" /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none mb-1">Maqsadli o'sish</p>
                                <p className="text-lg font-black text-white leading-none">+25%</p>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 group hover:bg-white hover:border-emerald-200 transition-all">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2 text-center">Ishlab chiqarish</span>
                      <p className="text-2xl font-black text-gray-900 text-center">{formatNum(selectedProduct.production)} t</p>
                    </div>
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 group hover:bg-white hover:border-rose-200 transition-all">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2 text-center">Bozor talabi</span>
                      <p className="text-2xl font-black text-gray-900 text-center">{formatNum(selectedProduct.demand)} t</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full py-5 rounded-[2.5rem] bg-gray-900 text-white font-black hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    Hisobotni yopish <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Strategic Summary Modal (Contextual) */}
      {createPortal(
        <AnimatePresence>
          {summaryType && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:pb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSummaryType(null)}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-modal-scroll"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gray-900 ${
                      summaryType === 'export' ? 'text-emerald-400' :
                      summaryType === 'import' ? 'text-rose-400' :
                      summaryType === 'production' ? 'text-primary-400' :
                      summaryType === 'demand' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {summaryType === 'export' ? <ArrowUpRight /> :
                       summaryType === 'import' ? <AlertTriangle /> :
                       summaryType === 'production' ? <Package /> :
                       summaryType === 'demand' ? <ShoppingCart /> : <TrendingUp />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {summaryType === 'export' ? 'Eksport Imkoniyatlari' :
                         summaryType === 'import' ? 'Mahsulot Yetishmovchiligi (Import)' :
                         summaryType === 'production' ? 'Ishlab chiqarish Tahlili' :
                         summaryType === 'demand' ? 'Bozor Talabi Tahlili' : 'Strategik Bozor Balansi'}
                      </h3>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">
                        {summaryType === 'balance' ? 'Batafsil bozor balansi' : 'Yo\'naltirilgan ma\'lumotlar tahlili'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSummaryType(null)}
                    className="p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all active:scale-90"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {summaryType === 'balance' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Surplus / Export Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="text-[13px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Eksport imkoniyati
                        </h4>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">{stats.surplusCount} tur</span>
                      </div>
                      <div className="space-y-3">
                        {stats.surplusProducts.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">{product.icon}</div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{product.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-emerald-600">+{formatNum(product.production - product.demand)}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">tonna</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deficit / Import Column */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="text-[13px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Ishlab chiqarish zarur
                        </h4>
                        <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full">{stats.deficitCount} tur</span>
                      </div>
                      <div className="space-y-3">
                        {stats.deficitProducts.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-100/50 rounded-2xl hover:bg-rose-50 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-white rounded-xl text-rose-600 shadow-sm group-hover:scale-110 transition-transform">{product.icon}</div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{product.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-rose-600">-{formatNum(product.demand - product.production)}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">tonna</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-[2rem] border-2 ${
                        summaryType === 'export' ? 'bg-emerald-50 border-emerald-100' :
                        summaryType === 'import' ? 'bg-rose-50 border-rose-100' :
                        summaryType === 'production' ? 'bg-primary-50 border-primary-100' :
                        'bg-amber-50 border-amber-100'
                    }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-lg font-black text-gray-900 mb-1">
                                    {summaryType === 'export' ? 'Jami Eksport Salohiyati' :
                                     summaryType === 'import' ? 'Jami Import Zaruriyati' :
                                     summaryType === 'production' ? 'Umumiy Ishlab Chiqarish' : 'Umumiy Bozor Talabi'}
                                </h4>
                                <p className="text-gray-500 text-sm font-medium">Barcha mahsulotlar kesimidagi umumiy miqdor</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-4xl font-black ${
                                    summaryType === 'export' ? 'text-emerald-600' :
                                    summaryType === 'import' ? 'text-rose-600' :
                                    summaryType === 'production' ? 'text-primary-600' : 'text-amber-600'
                                }`}>
                                    {formatNum(summaryType === 'export' ? stats.totalSurplus :
                                               summaryType === 'import' ? stats.totalDeficit :
                                               summaryType === 'production' ? stats.totalProd : stats.totalDemand)} 
                                    <span className="text-[14px] uppercase ml-2 text-gray-400">tonna</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(summaryType === 'export' ? stats.surplusProducts :
                          summaryType === 'import' ? stats.deficitProducts : MARKET_DATA).map(product => (
                            <div key={product.id} className="p-5 bg-gray-50 border border-gray-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-gray-900/5 transition-all group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">{product.icon}</div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{product.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{product.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {summaryType === 'export' ? 'Ortiqcha hosil' :
                                         summaryType === 'import' ? 'Kamomad' :
                                         summaryType === 'production' ? 'Ishlab chiqarish' : 'Bozor talabi'}
                                    </span>
                                    <span className={`text-sm font-black ${
                                        summaryType === 'export' ? 'text-emerald-600' :
                                        summaryType === 'import' ? 'text-rose-600' :
                                        summaryType === 'production' ? 'text-primary-600' : 'text-amber-600'
                                    }`}>
                                        {formatNum(summaryType === 'export' ? (product.production - product.demand) :
                                                   summaryType === 'import' ? (product.demand - product.production) :
                                                   summaryType === 'production' ? product.production : product.demand)} t
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-100">
                   <div className="bg-gray-50 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-900 border border-gray-100">
                            <Zap className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-900">AI Strategik Tavsiya</p>
                            <p className="text-xs font-medium text-gray-500">Bozor balansini {stats.totalDiff > 0 ? 'optimal saqlash' : 'yaxshilash'} bo'yicha ko'rsatma</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setSummaryType(null)}
                        className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                      >
                        Tushunarli
                      </button>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Final AI Suggestion Box */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setSummaryType('balance')}
        className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-7 text-white flex items-start gap-6 relative overflow-hidden group cursor-pointer transition-all hover:bg-gray-800"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="p-4 rounded-[1.5rem] bg-gray-800 border border-gray-700 text-emerald-400 shrink-0">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold mb-2">Yillik Strategik Xulosa</h4>
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-emerald-400">
               <span className="text-[10px] font-black uppercase tracking-widest">Batafsil</span>
               <ArrowRight className="w-3 h-3" />
            </div>
          </div>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-3xl font-medium">
            Joriy yilda {stats.surplusCount} turdagi mahsulot boyicha **{formatNum(stats.totalSurplus)} tonna** eksport salohiyati aniqlandi. 
            Shu bilan birga, {stats.deficitCount} turdagi mahsulotdagi kamomadni qoplash uchun intensiv texnologiyalarni qo'llash tavsiya etiladi.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarketAnalysisModule;
