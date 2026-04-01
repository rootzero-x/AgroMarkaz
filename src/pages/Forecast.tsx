import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const priceData = [
  { name: 'Apr', price: 2500 },
  { name: 'May', price: 2700 },
  { name: 'Iyun', price: 2900 },
  { name: 'Iyul', price: 3100 },
  { name: 'Avg', price: 3300 },
  { name: 'Sen', price: 3600 },
];

const Forecast: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Bug\'doy');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6 md:space-y-8 pt-6 md:pt-4 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-primary-600 rounded-3xl p-6 md:p-8 text-white relative shadow-lg shadow-primary-600/20 overflow-hidden">
        <h1 className="text-xl md:text-2xl font-semibold mb-1 flex items-center gap-2 relative z-10">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white/90" /> Bozor prognozi
        </h1>
        <p className="text-primary-100 text-xs md:text-sm font-medium mt-1 relative z-10">AI tahlili asosida</p>
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 min-w-0">
        
        {/* Controls */}
        <div className="lg:col-span-4">
          <div className="card-premium p-5 md:p-6 space-y-3 h-full">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-2">Ekin turini tanlang</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-xl">
                {selectedCrop === "Bug'doy" ? '🌾' : selectedCrop === 'Kartoshka' ? '🥔' : '🥕'}
              </div>
              <select 
                className="w-full pl-12 pr-10 py-3.5 md:py-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
                         transition-all font-semibold text-gray-800 appearance-none shadow-sm cursor-pointer md:text-lg"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="Bug'doy">Bug'doy</option>
                <option value="Kartoshka">Kartoshka</option>
                <option value="Sabzi">Sabzi</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              </div>
            </div>
            
            <div className="hidden lg:block mt-8 p-4 bg-primary-50/50 rounded-2xl border border-primary-50">
              <h3 className="text-primary-800 font-medium text-sm mb-2">Tahlil xulosasi</h3>
              <p className="text-primary-600/80 text-xs mb-3">
                {selectedCrop} narxi sentabr oyiga borib yanada o'sishi kutilmoqda. Xosilni kechroq sotish daromadni oshirishi mumkin.
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8 min-w-0">
          <div className="card-premium p-5 md:p-6 h-full flex flex-col">
            <h2 className="text-[17px] md:text-xl font-semibold text-gray-800 mb-6 px-2">
              Narx tendensiyasi <span className="text-gray-400 text-sm font-medium ml-2">(so'm/kg)</span>
            </h2>
            <div className="flex-1 w-full ml-[-20px] min-h-[300px] md:min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#D1D5DB' }} dy={10} />
                  <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} dx={-10} ticks={[0, 900, 1800, 2700, 3600]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', padding: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px', fontSize: '13px' }}
                    itemStyle={{ color: '#4A8835', fontWeight: 700, fontSize: '15px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#4A8835" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: '#4A8835', strokeWidth: 0 }}
                    activeDot={{ r: 8, fill: '#4A8835', stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Forecast;
