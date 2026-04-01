import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const trendData = [
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 2900 },
  { name: 'Apr', value: 3100 },
  { name: 'May', value: 3500 },
];

const Home: React.FC = () => {
  const { user } = useAuth();
  
  const HandWave = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block relative -top-0.5 ml-1">
      <path d="M14.5 9.5V5.5C14.5 4.67157 13.8284 4 13 4C12.1716 4 11.5 4.67157 11.5 5.5V10.5M11.5 10.5V7.5C11.5 6.67157 10.8284 6 10 6C9.17157 6 8.5 6.67157 8.5 7.5V11.5M8.5 11.5V9.5C8.5 8.67157 7.82843 8 7 8C6.17157 8 5.5 8.67157 5.5 9.5V15.5C5.5 18.5376 7.96243 21 11 21H13C16.866 21 20 17.866 20 14V11.5C20 10.6716 19.3284 10 18.5 10C17.6716 10 17 10.6716 17 11.5V12.5M17 12.5V8.5C17 7.67157 16.3284 7 15.5 7C14.6716 7 14 7.67157 14 8.5V11" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6 md:space-y-8 pt-6 md:pt-4 max-w-7xl mx-auto">
      
      {/* Greeting Banner */}
      <div className="bg-primary-600 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg shadow-primary-600/20 md:col-span-12">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 relative z-10 flex items-center">
          Salom, {user?.full_name?.split(' ')[0] || 'Ali'} <HandWave />
        </h1>
        <p className="text-primary-100 relative z-10 text-sm md:text-base font-medium">Bugun yaxshi hossildar ko'ring</p>
        <div className="absolute top-[-50%] right-[-10%] md:right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Recommended Crops */}
        <div className="xl:col-span-5 flex flex-col min-w-0">
          <h2 className="text-[17px] md:text-lg font-semibold text-gray-800 mb-4 px-1">Tavsiya etiladigan ekinlar</h2>
          <div className="space-y-3 md:space-y-4 flex-1">
            {[ 
              { name: 'Bug\'doy', score: '87%', trend: '+25%', emoji: '🌾', color: 'bg-primary-600' },
              { name: 'Kartoshka', score: '82%', trend: '+18%', emoji: '🥔', color: 'bg-primary-600/80' },
              { name: 'Sabzi', score: '78%', trend: '+15%', emoji: '🥕', color: 'bg-primary-600/60' }
            ].map((item, idx) => (
              <div key={idx} className="card-premium p-4 md:p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 text-2xl md:text-3xl">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1.5 md:text-lg">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: item.score }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                      />
                    </div>
                    <span className="text-[11px] md:text-xs font-bold text-gray-400">{item.score}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-primary-600 text-sm md:text-base font-semibold flex items-center">
                    {item.trend} <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-0.5 text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Trend Chart */}
        <div className="xl:col-span-7 flex flex-col min-w-0">
          <div className="card-premium p-5 md:p-6 pb-2 md:pb-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-[17px] md:text-lg font-semibold text-gray-800">Bozor tendensiyasi</h2>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
            </div>
            <div className="flex-1 w-full ml-[-12px] min-h-[200px] md:min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
                    labelStyle={{ display: 'none' }}
                    itemStyle={{ color: '#4A8835', fontWeight: 600 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4A8835" 
                    strokeWidth={4} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#4A8835', stroke: '#fff', strokeWidth: 2 }}
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

export default Home;
