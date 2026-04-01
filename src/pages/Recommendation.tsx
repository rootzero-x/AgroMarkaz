import React from 'react';
import { MapPin, Maximize2, Mountain, Droplet, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Recommendation: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6 md:space-y-8 pt-6 md:pt-4 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-primary-600 rounded-3xl p-6 md:p-8 relative overflow-hidden ring-0 border-0 shadow-lg shadow-primary-600/30">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 z-10 relative">Nimani ekay?</h1>
        <p className="text-primary-100 text-sm md:text-base font-medium z-10 relative">AI yordamida eng yaxshi ekinni tanlang</p>
        <svg className="absolute -right-4 -bottom-6 md:right-10 md:bottom-[-20%] w-32 h-32 md:w-64 md:h-64 text-white/10 pointer-events-none rounded-full" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="50"/></svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        
        <div className="card-premium p-5 md:p-6 relative">
          <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 mb-3">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary-600" /> Viloyat
          </label>
          <div className="relative">
            <select className="w-full pl-4 pr-10 py-3 md:py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
                               transition-all font-medium text-gray-800 appearance-none shadow-sm cursor-pointer md:text-lg">
              <option>Toshkent viloyati</option>
              <option>Samarqand viloyati</option>
              <option>Qashqadaryo viloyati</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center pointer-events-none">
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="card-premium p-5 md:p-6">
          <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 mb-3">
            <Maximize2 className="w-4 h-4 md:w-5 md:h-5 text-primary-600" /> Yer maydoni (gektar)
          </label>
          <input 
            type="number" 
            defaultValue={10}
            className="w-full px-4 py-3 md:py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
                       transition-all font-medium text-gray-800 shadow-sm md:text-lg"
          />
        </div>

        <div className="card-premium p-5 md:p-6">
          <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 mb-3">
            <Mountain className="w-4 h-4 md:w-5 md:h-5 text-primary-600" /> Tuproq turi
          </label>
          <div className="relative">
            <select className="w-full pl-4 pr-10 py-3 md:py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 
                               transition-all font-medium text-gray-800 appearance-none shadow-sm cursor-pointer md:text-lg">
              <option>Bo'z tuproq</option>
              <option>Qumli tuproq</option>
              <option>Sho'rxok tuproq</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center pointer-events-none">
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="card-premium p-5 md:p-6 mb-8 md:mb-0">
          <label className="flex items-center gap-2 text-sm md:text-base font-semibold text-gray-700 mb-3">
            <Droplet className="w-4 h-4 md:w-5 md:h-5 text-primary-600" /> Suv ta'minoti
          </label>
          <div className="grid grid-cols-3 gap-2 md:gap-3 h-[52px] md:h-[56px]">
            {['Kam', "O'rta", 'Ko\'p'].map((level) => (
              <button 
                key={level}
                className={`flex justify-center items-center h-full rounded-xl border font-semibold text-sm md:text-base transition-all cursor-pointer
                  ${level === "O'rta" ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-[0_2px_10px_rgba(75,137,55,0.12)] scale-[1.02]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button className="btn-primary w-full md:w-auto md:px-12 md:py-4 md:text-lg shadow-lg shadow-primary-500/30">
          Tavsiya olish
        </button>
      </div>

    </motion.div>
  );
};

export default Recommendation;
