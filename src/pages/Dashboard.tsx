import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-primary-600 rounded-[28px] p-8 text-white relative overflow-hidden flex flex-col justify-end min-h-[140px]">
          <h1 className="text-2xl font-semibold mb-1 z-10">Salom, Ali 👋</h1>
          <p className="text-white/80 z-10 text-sm">Bugun yaxshi hossildar ko'ring</p>
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4 px-2">Tavsiya etiladigan ekinlar</h2>
          <div className="space-y-3">
            {[ 
              { name: 'Bug\'doy', score: '87%', trend: '+25%', icon: '🌾', color: 'bg-primary-600' },
              { name: 'Kartoshka', score: '82%', trend: '+18%', icon: '🥔', color: 'bg-primary-600/80' },
              { name: 'Sabzi', score: '78%', trend: '+15%', icon: '🥕', color: 'bg-primary-600/60' }
            ].map((item, idx) => (
              <div key={idx} className="card-premium p-4 pl-5 flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200">
                <div className="text-3xl bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-orange-100/50">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 leading-tight mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden max-w-[140px]">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.score }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{item.score}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-primary-600 text-sm font-semibold flex items-center gap-1">
                    {item.trend} <span className="text-gray-300 ml-1">›</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
