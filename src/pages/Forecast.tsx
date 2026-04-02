import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  TrendingUp, 
  ChevronRight, 
  ArrowUpRight, 
  Target, 
  BarChart3, 
  LayoutDashboard,
  Zap,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const priceDataMap: Record<string, any[]> = {
  "Bug'doy": [
    { name: 'Yan', price: 2100 }, { name: 'Fev', price: 2300 }, { name: 'Mar', price: 2400 },
    { name: 'Apr', price: 2600 }, { name: 'May', price: 2450 }, { name: 'Iyun', price: 2800 },
  ],
  "Kartoshka": [
    { name: 'Yan', price: 3200 }, { name: 'Fev', price: 3100 }, { name: 'Mar', price: 3400 },
    { name: 'Apr', price: 3800 }, { name: 'May', price: 4100 }, { name: 'Iyun', price: 4500 },
  ],
  "Sabzi": [
    { name: 'Yan', price: 1800 }, { name: 'Fev', price: 2000 }, { name: 'Mar', price: 2100 },
    { name: 'Apr', price: 2300 }, { name: 'May', price: 2200 }, { name: 'Iyun', price: 2600 },
  ],
};

const crops = [
  { id: "Bug'doy", name: "Bug'doy", icon: "/wheat_icon.png" },
  { id: "Kartoshka", name: "Kartoshka", icon: "/potato_icon.png" },
  { id: "Sabzi", name: "Sabzi", icon: "/carrot_icon.png" },
];

const Forecast: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState("Bug'doy");

  const currentStats = {
    "Bug'doy": { price: '2,800', trend: '+8.5%', demand: 'O\'rta', advice: 'Sotish' },
    "Kartoshka": { price: '4,500', trend: '+15.2%', demand: 'Yuqori', advice: 'Kutish' },
    "Sabzi": { price: '2,600', trend: '+12.0%', demand: 'Barqaror', advice: 'Sotish' },
  }[selectedCrop as keyof typeof priceDataMap];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto min-h-full pb-24 md:pb-12"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px] mb-2 font-heading">
              <BarChart3 className="w-3.5 h-3.5" /> Market Intelligence
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
             Bozor Bashorati
           </h1>
           <p className="text-gray-500 font-semibold mt-1 text-lg">
             AI tomonidan tahlil qilingan <span className="text-primary-600 font-black">real vaqtda</span> narxlar o'zgarishi.
           </p>
        </div>
      </header>

      {/* Crop Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {crops.map((crop) => (
          <motion.div
            key={crop.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedCrop(crop.id)}
            className={`cursor-pointer rounded-[2.5rem] p-6 border-2 transition-all flex items-center gap-5 shadow-xl ${
              selectedCrop === crop.id 
              ? 'bg-primary-600 border-primary-600 shadow-primary-600/20' 
              : 'bg-white border-gray-100 shadow-gray-200/50 hover:border-primary-100'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl overflow-hidden p-1 shadow-sm ${selectedCrop === crop.id ? 'bg-white' : 'bg-gray-50'}`}>
               <img src={crop.icon} alt={crop.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${selectedCrop === crop.id ? 'text-white' : 'text-gray-900'}`}>{crop.name}</h3>
              <p className={`text-xs font-bold ${selectedCrop === crop.id ? 'text-primary-100' : 'text-gray-400'} uppercase tracking-wider`}>Bashoratni ko'rish</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Joriy Narx', value: currentStats?.price, sub: 'so\'m/kg', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: '30 Kunlik Trend', value: currentStats?.trend, sub: 'Kutilayotgan', icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Talab Darajasi', value: currentStats?.demand, sub: 'Bozordagi faollik', icon: LayoutDashboard, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'AI Tavsiya', value: currentStats?.advice, sub: 'Strategiya', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">{stat.value}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Analytics Main Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* Advanced Chart */}
        <div className="xl:col-span-2 flex flex-col">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex-1 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Narxlar Tendensiyasi</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedCrop} Prognozi</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceDataMap[selectedCrop]}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 900, fill: '#94a3b8' }} 
                    dy={12}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }}
                    tickFormatter={(val) => `${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                    itemStyle={{ color: '#16a34a', fontWeight: 900, fontSize: '15px' }}
                    labelStyle={{ fontWeight: 700, marginBottom: '4px', color: '#64748b' }}
                    formatter={(value: any) => [`${value} som/kg`, 'Narx']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#16a34a" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    activeDot={{ r: 10, fill: '#16a34a', stroke: '#fff', strokeWidth: 4 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Analysis Cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex-1">
             <div className="bg-primary-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Info className="w-6 h-6 text-primary-600" />
             </div>
             <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">AI Analiz Xulosasi</h3>
             <div className="space-y-4">
                {[
                  { factor: "Bozor Talabi", status: "Osilayotgan", desc: "Aholi tomonidan mahsulotga bo'lgan talab 15% ga oshdi." },
                  { factor: "Ob-havo Ta'sir", status: "Salbiy", desc: "Yaqin kunlardagi yog'ingarchilik yig'im-terimga ta'sir qilishi mumkin." },
                  { factor: "Eksport", status: "Faol", desc: "Qo'shni davlatlarga eksport hajmi 20% ga oshishi narxni ushlaydi." }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[11px] font-black uppercase text-gray-500 tracking-wider font-heading">{item.factor}</span>
                       <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{item.status}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 leading-tight">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                       <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black uppercase text-[10px] tracking-[.3em] text-primary-400">Strategik Maslahat</span>
                 </div>
                 <p className="text-lg font-bold leading-tight mb-4">
                    Xosilingizni sentabr oyiga qadar <span className="text-primary-400 underline decoration-primary-400/30">saqlashni</span> tavsiya qilamiz.
                 </p>
                 <button className="flex items-center gap-2 text-xs font-black group-hover:gap-3 transition-all">
                   TO'LIQ HISOBOT <ChevronRight className="w-4 h-4 text-primary-400" />
                 </button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <ArrowUpRight className="w-32 h-32" />
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Forecast;
