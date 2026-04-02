import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Shield, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Billing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Freemium',
      price: '0',
      period: '7 kun',
      description: "7 kun davomida ekilgan mahsulotni nazorat qiladi",
      features: [
        'Mahsulot qo\'yish: 1 ta',
        'Mahsulot nazorati: 7 kun',
        'Ob-havo tahlili: 7 kun',
        'Agronom maslahati: 7 kun',
      ],
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      name: 'Bronze',
      price: '15',
      period: 'oylik',
      description: "1 oy davomida ekilgan mahsulotni nazorat qiladi",
      featured: true,
      features: [
        'Mahsulot qo\'yish: 7 ta',
        'Mahsulot nazorati: 1 oy',
        'Ob-havo tahlili: 1 oy',
        'Agronom maslahati: 1 oy',
      ],
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
    },
    {
      name: 'Pro Plus',
      price: '50',
      period: 'oylik',
      description: "Kengaytirilgan imkoniyatlar bilan to'liq nazorat",
      features: [
        'Mahsulot qo\'yish: 30 ta',
        'Mahsulot nazorati: Cheksiz',
        'Ob-havo tahlili: To\'liq',
        'Premium Agronom: 24/7',
      ],
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
    },
    {
      name: 'Konstruktor',
      price: 'Maxsus',
      period: 'taklif',
      description: "Yetishtiriladigan mahsulotni hosili yig'ib olinguncha nazorat",
      features: [
        'Mahsulot qo\'yish: 3 ta',
        'Mahsulot nazorati: Tarif davomida',
        'Ob-havo tahlili: Tarif davomida',
        'Agronom maslahati: Tarif davomida',
      ],
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div className="min-h-full pb-12">
      {/* Header Area */}
      <div className="mb-12 flex flex-col items-start gap-6 px-4 max-w-5xl">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-[13px] font-extrabold text-gray-500 hover:text-gray-900 transition-colors mb-2 group uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Ortga qaytish
        </button>
        <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] tracking-tighter leading-[1.1] mb-4">
          PLATFORMADAN FOYDALANISH UCHUN 
          <br />
          <span className="text-[#559643]">TARIFLAR</span>
        </h1>
        <p className="text-gray-500 font-semibold text-lg md:text-xl max-w-2xl leading-relaxed">
          Sizning xo'jaligingiz rivoji uchun eng maqbul rejani tanlang va professional nazoratni hoziroq boshlang.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative flex flex-col h-full bg-white rounded-[2.5rem] border-2 ${plan.featured ? 'border-orange-400 shadow-2xl shadow-orange-100 z-10' : 'border-gray-100 shadow-xl shadow-gray-200/50'} overflow-hidden group hover:-translate-y-2 transition-all duration-300`}
          >
            {plan.featured && (
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  Ommabop
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className={`p-8 pb-6 ${plan.lightColor}`}>
               <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${plan.textColor}`}>
                 {plan.name}
               </h3>
               <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl md:text-5xl font-black text-gray-900">
                    {plan.price !== 'Maxsus' ? `$${plan.price}` : plan.price}
                  </span>
                  {plan.price !== 'Maxsus' && (
                    <span className="text-gray-500 font-bold">/{plan.period}</span>
                  )}
               </div>
               <p className="text-gray-600 text-sm font-medium leading-relaxed min-h-[40px]">
                 {plan.description}
               </p>
            </div>

            {/* Plan Features */}
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.lightColor}`}>
                      <Check className={`w-3.5 h-3.5 ${plan.textColor}`} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  plan.featured 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/10'
                }`}
              >
                {plan.name === 'Konstruktor' ? (
                  <>Aloqa <Send className="w-5 h-5" /></>
                ) : (
                  <>Tanlash <Zap className="w-5 h-5" /></>
                )}
              </button>
            </div>

            {/* Decorative background circle */}
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${plan.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges / Footer Info */}
      <div className="mt-16 bg-white/50 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-8 justify-around mx-4 shadow-xl shadow-gray-200/50">
         <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-primary-50 p-3 rounded-2xl border border-primary-100 group-hover:scale-110 transition-transform">
               <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
               <p className="text-sm font-black text-gray-900 uppercase">Xavfsiz to'lov</p>
               <p className="text-xs text-gray-500 font-bold">Payme / Click / Visa</p>
            </div>
         </div>
         <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100 group-hover:scale-110 transition-transform">
               <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
               <p className="text-sm font-black text-gray-900 uppercase">Tezkor Faollashtirish</p>
               <p className="text-xs text-gray-500 font-bold">To'lovdan so'ng darhol</p>
            </div>
         </div>
         <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 group-hover:scale-110 transition-transform">
               <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
               <p className="text-sm font-black text-gray-900 uppercase">24/7 Qo'llab-quvvatlash</p>
               <p className="text-xs text-gray-500 font-bold">Har qanday savolga javob</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Billing;
