import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronRight, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Calendar,
  ArrowUpRight,
  MessageSquare,
  Camera,
  CloudSun,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const trendData = [
  { name: 'Yan', value: 2400 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 2800 },
  { name: 'Apr', value: 3500 },
  { name: 'May', value: 3200 },
  { name: 'Iyun', value: 4100 },
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Faol Monitoring', value: '12', sub: '6 ta mahsulot', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Salomatlik Indeksi', value: '94.2%', sub: '+2.1% o\'sish', icon: ShieldCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Bozor Holati', value: '+5.2%', sub: 'Haftalik trend', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Navbatdagi Tadbir', value: 'Ertaga', sub: 'Oziqlantirish', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const quickActions = [
    { title: 'Tavsiyalar', desc: 'AI ekin maslahatlari', icon: Zap, path: '/recommendation', color: 'bg-emerald-600' },
    { title: 'AI Skaner', desc: 'Kasalliklarni aniqlash', icon: Camera, path: '/recommendation', color: 'bg-primary-600' },
    { title: 'Ob-Havo', desc: '7 kunlik bashorat', icon: CloudSun, path: '/weather', color: 'bg-orange-500' },
    { title: 'Agro Chat', desc: 'Mutaxassis bilan muloqot', icon: MessageSquare, path: '/', color: 'bg-indigo-600' },
  ];

  const HandWave = () => (
    <div className="relative flex items-center justify-center ml-2">
      <motion.div
        animate={{ 
          y: [0, -4, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="w-10 h-10 md:w-11 md:h-11 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm transition-transform"
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 fill-emerald-600/10" strokeWidth={2.5} />
      </motion.div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto min-h-full pb-24 md:pb-12"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px] mb-2 font-heading">
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard Overview
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-2">
             Salom, {user?.full_name?.split(' ')[0] || 'Ali'}! <HandWave />
           </h1>
           <p className="text-gray-500 font-semibold mt-1 text-lg md:text-xl">
             Bugun xo'jaligingizda ishlar <span className="text-primary-600 font-black">a'lo</span> darajada!
           </p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
           <button className="px-5 py-2 bg-gray-900 text-white font-black text-[11px] rounded-xl shadow-lg uppercase tracking-wider">Bugun</button>
           <button className="px-5 py-2 text-gray-400 font-black text-[11px] hover:text-gray-900 transition-colors uppercase tracking-wider">Haftalik</button>
           <button className="px-5 py-2 text-gray-400 font-black text-[11px] hover:text-gray-900 transition-colors uppercase tracking-wider">Oylik</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="bg-gray-50 p-2 rounded-xl text-gray-400 group-hover:text-primary-600 transition-colors cursor-pointer">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-none mb-2">{stat.value}</h3>
            <p className="text-xs font-bold text-gray-400">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* Market Trend Chart */}
        <div className="xl:col-span-2 flex flex-col">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Bozor tendensiyasi</h2>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">O'rtacha narxlar o'zgarishi</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-black">
                   <TrendingUp className="w-3.5 h-3.5" /> +12.5%
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} 
                    dy={12}
                  />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                    itemStyle={{ color: '#16a34a', fontWeight: 900, fontSize: '14px' }}
                    labelStyle={{ fontWeight: 700, marginBottom: '4px', color: '#64748b' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#16a34a" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    activeDot={{ r: 8, fill: '#16a34a', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommended Crops */}
        <div className="flex flex-col">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Tavsiyalar</h2>
              <button onClick={() => navigate('/recommendation')} className="text-primary-600 hover:text-primary-700 font-bold text-xs flex items-center gap-1 group">
                Barchasi <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[ 
                { name: 'Bug\'doy', score: '87%', trend: 'Yaxshi', icon: '/wheat_icon.png', color: 'bg-emerald-600' },
                { name: 'Kartoshka', score: '82%', trend: 'Normal', icon: '/potato_icon.png', color: 'bg-orange-500' },
                { name: 'Sabzi', score: '78%', trend: 'Barqaror', icon: '/carrot_icon.png', color: 'bg-primary-600' }
              ].map((item, idx) => (
                <div key={idx} className="group p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 transition-transform overflow-hidden p-0.5">
                        <img 
                          src={item.icon} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-black text-gray-900 leading-none truncate">{item.name}</h4>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-1 rounded-md">{item.trend}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 flex-1 bg-gray-200/50 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full ${item.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: item.score }}
                                transition={{ duration: 1.2, delay: 0.5 + idx * 0.1 }}
                              />
                           </div>
                           <span className="text-[10px] font-black text-gray-400">{item.score}</span>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-gray-900 rounded-[2rem] p-5 text-white relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-primary-300 uppercase tracking-widest mb-1">AI Maslahat</p>
                   <p className="text-sm font-bold leading-snug">Hozir ekinlarni sug'orish uchun eng maqbul vaqt.</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                   <Zap className="w-12 h-12 text-primary-400" />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {quickActions.map((action, i) => (
           <motion.div
             key={i}
             whileHover={{ y: -5 }}
             onClick={() => {
               if (action.title === 'Agro Chat') {
                 window.dispatchEvent(new CustomEvent('open-chat'));
               } else {
                 navigate(action.path);
               }
             }}
             className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/40 cursor-pointer flex flex-col gap-4 group"
           >
             <div className={`${action.color} w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-all`}>
                <action.icon className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             <div>
               <h4 className="font-black text-gray-900 leading-tight tracking-tight">{action.title}</h4>
               <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">{action.desc}</p>
             </div>
           </motion.div>
         ))}
      </div>
    </motion.div>
  );
};

export default Home;
