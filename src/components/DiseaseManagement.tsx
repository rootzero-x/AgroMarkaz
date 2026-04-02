import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Camera, History, Bug, Sparkles, 
  ChevronRight, ArrowLeft, Search, AlertCircle, 
  CheckCircle2, Info, Microscope, Droplets, Zap,
  FlaskConical, MapPin, Calendar, ClipboardCheck,
  Truck, Beaker, Thermometer, Wind
} from 'lucide-react';

interface Disease {
  id: string;
  name: string;
  scientificName: string;
  severity: 'high' | 'medium' | 'low';
  symptoms: string[];
  causes: string;
  treatment: {
    chemical: string;
    biological: string;
    preventive: string;
  };
}

const COMMON_DISEASES: Disease[] = [
  {
    id: '1',
    name: "Pomidor fitoftorozi",
    scientificName: "Phytophthora infestans",
    severity: 'high',
    symptoms: ["Barglarda jigarrang dog'lar", "Meva chirishi", "Poyaning qorayishi"],
    causes: "Yuqori namlik va past harorat",
    treatment: {
      chemical: "Ridomil Gold, Previkur Energy",
      biological: "Fitosporin-M",
      preventive: "Namlikni nazorat qilish, ekin almashinuvi"
    }
  },
  {
    id: '2',
    name: "Uzum oidiumi",
    scientificName: "Uncinula necator",
    severity: 'medium',
    symptoms: ["Oq g'ubor", "Barglar bujmayishi", "Meva yorilishi"],
    causes: "Issiq va quruq havo, havo aylanishining yomonligi",
    treatment: {
      chemical: "Topas, Tiovit Jet",
      biological: "Oltingugurtli eritmalar",
      preventive: "Butash, havo aylanishini yaxshilash"
    }
  },
  {
    id: '3',
    name: "G'o'za vilti",
    scientificName: "Verticillium dahliae",
    severity: 'high',
    symptoms: ["Barglar sarg'ayishi", "Poya kesimidagi qora halqa", "O'sishdan to'xtash"],
    causes: "Tuproqdagi zamburug'lar, noto'g'ri sug'orish",
    treatment: {
      chemical: "Fundazol (kam samarali)",
      biological: "Trichodermin",
      preventive: "Chidamli navlar, almashlab ekish"
    }
  }
];

const DiseaseManagementModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'home' | 'scanner' | 'detail' | 'laboratory' | 'schedule' | 'pests'>('home');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Laboratory State
  const [labStep, setLabStep] = useState(1);
  const [sampleType, setSampleType] = useState('');
  
  // Schedule State
  const [selectedCropSchema, setSelectedCropSchema] = useState('Cotton');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSelectedDisease(COMMON_DISEASES[0]);
      setView('detail');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={view === 'home' ? onBack : () => setView('home')}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm active:scale-95 translate-y-0 hover:-translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> 
          {view === 'home' ? 'Asosiy sahifaga' : 'Ortga'}
        </button>
        
        <div className="flex gap-3">
          <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-primary-600 transition-colors">
            <History className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-primary-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-rose-200">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
               <div className="relative z-10 max-w-2xl">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 border border-white/30">
                    <Zap className="w-3.5 h-3.5 fill-current" /> AI Diagnostika
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                    Ekinlaringizni <br /> <span className="text-rose-200">himoya qiling</span>
                  </h1>
                  <p className="text-rose-50 text-lg mb-8 font-medium leading-relaxed">
                    Sun'iy intellekt yordamida o'simliklardagi kasalliklarni rasm orqali aniqlang va professional davolash choralarini oling.
                  </p>
                  <button 
                    onClick={() => setView('scanner')}
                    className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <Camera className="w-6 h-6" /> Diagnostikani boshlash
                  </button>
               </div>
               <ShieldAlert className="absolute right-12 bottom-12 w-48 h-48 text-white/10 rotate-12" />
            </div>

            {/* Functional Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <button 
                 onClick={() => setView('laboratory')}
                 className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-primary-100 transition-all group text-left relative overflow-hidden active:scale-95"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                  <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform relative z-10">
                    <Microscope className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 relative z-10">Laboratoriya</h3>
                  <p className="text-gray-500 text-sm font-medium relative z-10">Namunalarni tahlilga yuboring va natijalarni raqamli oling.</p>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                    Tahlilni boshlash <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
               </button>

               <button 
                 onClick={() => setView('schedule')}
                 className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-emerald-100 transition-all group text-left relative overflow-hidden active:scale-95"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                  <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform relative z-10">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 relative z-10">Dorilash Rejasi</h3>
                  <p className="text-gray-500 text-sm font-medium relative z-10">Profilaktik dorilash taqvimi va aniq me'yorlar (PPE).</p>
                  <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    Taqvimni ko'rish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
               </button>

               <button 
                 onClick={() => setView('pests')}
                 className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-purple-100 transition-all group text-left relative overflow-hidden active:scale-95"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                  <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform relative z-10">
                    <Bug className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 relative z-10">Zararkunandalar</h3>
                  <p className="text-gray-500 text-sm font-medium relative z-10">Hududdagi hasharotlar migratsiyasi va xavf xaritasi.</p>
                  <div className="mt-4 flex items-center gap-2 text-purple-600 font-bold text-sm">
                    Xaritani ochish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
               </button>
            </div>

            {/* Common Diseases List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">Ko'p uchraydigan kasalliklar</h2>
                  <button className="text-primary-600 font-bold text-sm hover:underline">Hammasini ko'rish</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {COMMON_DISEASES.map((disease) => (
                   <button
                     key={disease.id}
                     onClick={() => {
                       setSelectedDisease(disease);
                       setView('detail');
                     }}
                     className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all text-left flex flex-col items-start gap-4 active:scale-95 group"
                   >
                     <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       disease.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                     }`}>
                       {disease.severity === 'high' ? 'Xavfli' : 'O\'rtacha'}
                     </div>
                     <div>
                       <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{disease.name}</h4>
                       <p className="text-gray-400 text-xs italic font-medium">{disease.scientificName}</p>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                       {disease.symptoms.slice(0, 2).map((symptom, i) => (
                         <span key={i} className="bg-gray-50 text-gray-500 text-[11px] px-2.5 py-1 rounded-lg font-bold border border-gray-100">
                           {symptom}
                         </span>
                       ))}
                     </div>
                     <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all">
                       Tavsiyalarni o'qish <ChevronRight className="w-4 h-4" />
                     </div>
                   </button>
                 ))}
               </div>
            </div>
          </motion.div>
        ) : view === 'scanner' ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 min-h-[600px] text-center relative overflow-hidden"
          >
             {isScanning && (
               <motion.div 
                 initial={{ top: '0%' }}
                 animate={{ top: '100%' }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent z-20 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
               />
             )}

             <div className="mb-8 relative">
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 ${isScanning ? 'bg-rose-50 scale-110 shadow-inner' : 'bg-gray-50'}`}>
                   {isScanning ? (
                     <Microscope className="w-16 h-16 text-rose-500 animate-pulse" />
                   ) : (
                     <Camera className="w-16 h-16 text-gray-300" />
                   )}
                </div>
                {!isScanning && (
                   <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2.5 rounded-2xl shadow-lg animate-bounce">
                      <Sparkles className="w-5 h-5" />
                   </div>
                )}
             </div>

             <h2 className="text-3xl font-black text-gray-900 mb-4">
               {isScanning ? "AI Rasm tahlil qilinmoqda..." : "Ekin rasmini yuboring"}
             </h2>
             <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">
               {isScanning 
                 ? "Bizning algoritm bargdagi dog'lar va anomaliyalarni professional tarzda tekshirmoqda." 
                 : "Kamerangizni ekinning bargi yoki zararlangan qismiga yo'naltiring."}
             </p>

             <div className="flex flex-col gap-4 w-full max-w-xs">
               <button 
                 onClick={handleScan}
                 disabled={isScanning}
                 className="bg-primary-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
               >
                 {isScanning ? "Kuting..." : "Rasmga olish"}
               </button>
               <button 
                 disabled={isScanning}
                 className="bg-white text-gray-600 border border-gray-200 py-4 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all disabled:opacity-50"
               >
                 Galereyadan yuklash
               </button>
             </div>

             <div className="mt-12 flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                   <span className="text-xs font-bold text-gray-400">Yuqori aniqlik</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                   <span className="text-xs font-bold text-gray-400">Cloud AI tahlil</span>
                </div>
             </div>
          </motion.div>
        ) : view === 'laboratory' ? (
          <motion.div
            key="laboratory"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                   <div className="max-w-xl">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">Professional Laboratoriya</div>
                      <h2 className="text-3xl font-black text-gray-900 mb-4">Namuna topshirish</h2>
                      <p className="text-gray-500 font-medium">Laboratoriya tahlili tuproq unumdorligini va kasalliklarni ildiz darajasida aniqlashning eng aniq usulidir.</p>
                   </div>
                   <div className="flex gap-4">
                      {[1, 2, 3].map(s => (
                         <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${labStep >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {s}
                         </div>
                      ))}
                   </div>
                </div>

                <div className="mt-10 py-10 border-t border-gray-100">
                   {labStep === 1 ? (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                         <h3 className="text-xl font-bold text-gray-900">Namuna turini tanlang</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                               { id: 'soil', name: 'Tuproq', icon: <Droplets />, desc: 'Minerallar va sho\'rlanish' },
                               { id: 'leaf', name: 'Barg', icon: <FlaskConical />, desc: 'Ozuqa elementlari tanqisligi' },
                               { id: 'water', name: 'Sug\'orish suvi', icon: <Beaker />, desc: 'Tuzlar va xlor miqdori' }
                            ].map(item => (
                               <button 
                                 key={item.id}
                                 onClick={() => setSampleType(item.id)}
                                 className={`p-6 rounded-3xl border-2 transition-all text-left group ${sampleType === item.id ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                               >
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${sampleType === item.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:text-blue-500'}`}>
                                     {item.icon}
                                  </div>
                                  <h4 className="font-black text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                               </button>
                            ))}
                         </div>
                         <button 
                           disabled={!sampleType}
                           onClick={() => setLabStep(2)}
                           className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black group active:scale-95 transition-all disabled:opacity-50"
                         >
                           Keyingi qadam <ChevronRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1" />
                         </button>
                      </div>
                   ) : labStep === 2 ? (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                         <h3 className="text-xl font-bold text-gray-900">Manzil va kuryer ma'lumotlari</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">To'liq manzil</label>
                               <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <input type="text" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Viloyat, tuman, mahalla..." />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Aloqa uchun telefon</label>
                               <input type="tel" className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="+998 90 123 45 67" />
                            </div>
                         </div>
                         <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex items-start gap-4">
                            <div className="bg-white p-2 rounded-xl text-yellow-600 shadow-sm"><Truck className="w-5 h-5" /></div>
                            <div>
                               <p className="text-sm font-bold text-yellow-900 mb-1 leading-none">Kuryer (Logistika)</p>
                               <p className="text-xs text-yellow-800 font-medium leading-relaxed">Namunalarni laboratoriyaga 24 soat ichida yetkazib beramiz. Xizmat xaqi 25,000 so'm.</p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button onClick={() => setLabStep(1)} className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors">Ortga</button>
                            <button onClick={() => setLabStep(3)} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black active:scale-95 transition-all">Tasdiqlash</button>
                         </div>
                      </div>
                   ) : (
                      <div className="py-10 text-center animate-in zoom-in-95">
                         <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardCheck className="w-12 h-12" />
                         </div>
                         <h3 className="text-3xl font-black text-gray-900 mb-2">Buyurtma qabul qilindi</h3>
                         <p className="text-gray-500 font-medium mb-8">Namuna raqami: <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#L-7821</span>. Kuryer siz bilan tez orada bog'lanadi.</p>
                         <button onClick={() => setView('home')} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">Yopish</button>
                      </div>
                   )}
                </div>
             </div>
          </motion.div>
        ) : view === 'schedule' ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                   <div>
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">Agrotexnik Taqvim</div>
                      <h2 className="text-3xl font-black text-gray-900">Dorilash Rejasi</h2>
                   </div>
                   <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                      {['Cotton', 'Fruit', 'Veggies'].map(type => (
                         <button 
                           key={type}
                           onClick={() => setSelectedCropSchema(type)}
                           className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCropSchema === type ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                         >
                            {type === 'Cotton' ? 'G\'o\'za' : type === 'Fruit' ? 'Bog\'dorchilik' : 'Sabzavotlar'}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-12">
                   {/* Current Month Highlights */}
                   <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-xl font-black text-gray-900 capitalize">Aprel oyi uchun rejali ishlar</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                         { title: 'Zamburug\'larga qarshi', time: '10-15 Aprel', chem: 'Tiovit Jet', dose: '5-7 kg/ga', risk: 'high' },
                         { title: 'Azotli o\'g\'itlash', time: '18-20 Aprel', chem: 'Karbamid', dose: '150 kg/ga', risk: 'medium' },
                         { title: 'Sho\'r yuvish (yakuniy)', time: 'Dala tayyorlik', chem: '-', dose: 'Normal', risk: 'low' }
                      ].map((item, i) => (
                         <div key={i} className="group p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-2 h-full ${item.risk === 'high' ? 'bg-emerald-500' : item.risk === 'medium' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className="text-xs font-black text-emerald-600 mb-2">{item.time}</div>
                            <h4 className="text-lg font-black text-gray-900 mb-1 leading-tight">{item.title}</h4>
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                               <div className="flex justify-between text-xs">
                                  <span className="font-bold text-gray-400 uppercase tracking-tighter">Preparat</span>
                                  <span className="font-black text-gray-900">{item.chem}</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="font-bold text-gray-400 uppercase tracking-tighter">Me'yor</span>
                                  <span className="font-black text-emerald-600">{item.dose}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>

                   {/* PPE & Safety */}
                   <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                      <div className="flex items-start gap-6">
                         <div className="bg-white/10 p-3 rounded-2xl text-emerald-400 shadow-inner">
                            <ShieldAlert className="w-8 h-8" />
                         </div>
                         <div>
                            <h4 className="text-xl font-black mb-2">Xavfsizlik yo'riqnomasi (PPE)</h4>
                            <p className="text-gray-400 font-medium mb-6 leading-relaxed">Kimyoviy ishlov berishda respirator, himoya ko'zoynagi va maxsus qo'lqoplardan foydalanish majburiydir. Ishni tonggi yoki kechki salqinda bajaring.</p>
                            <button className="flex items-center gap-2 text-emerald-400 font-bold hover:underline">
                               To'liq yo'riqnomani yuklash <ChevronRight className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : view === 'pests' ? (
          <motion.div
            key="pests"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                   <div className="max-w-xl">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">LIVE Monitoring</div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">Hududiy Zararkunandalar</h2>
                      <p className="text-gray-500 font-medium">Barcha viloyatlar bo'yicha hasharotlar va zararkunandalar migratsiyasi real vaqtda kuzatilmoqda.</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl text-purple-700 border border-purple-100 font-bold text-sm">
                         <Thermometer className="w-4 h-4" /> 28°C
                      </div>
                      <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl text-purple-700 border border-purple-100 font-bold text-sm">
                         <Wind className="w-4 h-4" /> 12 km/h
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   {/* Left: Map Simulation */}
                   <div className="lg:col-span-12 xl:col-span-12 h-[300px] bg-slate-100 rounded-[2.5rem] border border-gray-100 relative overflow-hidden shadow-inner group">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-transparent"></div>
                      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="text-slate-400 font-black uppercase text-4xl opacity-10 rotate-[-12deg] tracking-widest leading-none">O'zbekiston Agrosanoat Xaritasi</div>
                      </div>
                      
                      {/* Random Map Markers Simulation */}
                      <div className="absolute top-[30%] left-[40%] group-hover:scale-110 transition-transform">
                         <div className="w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)] relative">
                            <span className="absolute -top-10 -left-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Toshkent: Shiralar</span>
                         </div>
                      </div>
                      <div className="absolute top-[60%] left-[25%] group-hover:scale-110 transition-transform">
                         <div className="w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] relative"></div>
                      </div>
                      <div className="absolute top-[45%] left-[70%] group-hover:scale-110 transition-transform text-center flex flex-col items-center">
                         <div className="w-4 h-4 bg-rose-600 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.8)] relative animate-ping"></div>
                         <span className="mt-2 text-[10px] font-black uppercase bg-white/80 px-2 py-0.5 rounded border border-gray-100">Xavf: Farg'ona</span>
                      </div>

                      <div className="absolute bottom-6 right-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-gray-100 shadow-xl">
                         <div className="flex items-center gap-4 mb-3">
                            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Kritik xavf (Aktiv)</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">O'rtacha faollik</span>
                         </div>
                      </div>
                   </div>

                   {/* Right: List of Pests */}
                   <div className="lg:col-span-12 space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <Bug className="w-6 h-6 text-purple-500" /> Hozirgi kunda faol zararkunandalar
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                           { name: 'Oq qanot', location: 'Toshkent, Sirdaryo', risk: 'high', help: 'Biologik usulda Entofaglar tavsiya etiladi' },
                           { name: 'Shiralar', location: 'Farg\'ona vodiysi', risk: 'high', help: 'Karate, Desis preparatlari 0.3 l/ga' },
                           { name: 'G\'o\'za tunlami', location: 'Qashqadaryo, Buxoro', risk: 'medium', help: 'Feromon tutqichlardan foydalaning' }
                         ].map((pest, i) => (
                           <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group/item">
                              <div className={`p-1.5 rounded-lg text-white mb-4 w-fit ${pest.risk === 'high' ? 'bg-rose-500 shadow-rose-200 shadow-lg' : 'bg-orange-500 shadow-orange-200'}`}>
                                 <AlertCircle className="w-4 h-4" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{pest.name}</h4>
                              <p className="text-[11px] font-black text-purple-600 uppercase mb-3 ">{pest.location}</p>
                              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">{pest.help}</p>
                              <button className="text-primary-600 font-bold text-sm flex items-center gap-1 group-hover/item:gap-2 transition-all">
                                Batafsil <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : selectedDisease && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
             {/* Disease Header */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-4 h-full ${selectedDisease.severity === 'high' ? 'bg-rose-500' : 'bg-orange-500'}`}></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                   <div className="space-y-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block ${
                        selectedDisease.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {selectedDisease.severity === 'high' ? 'Kritik xavf' : 'O\'rtacha xavf'}
                      </div>
                      <h1 className="text-4xl font-black text-gray-900">{selectedDisease.name}</h1>
                      <p className="text-gray-400 font-mono italic text-sm">{selectedDisease.scientificName}</p>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                      <div className="bg-rose-100 text-rose-600 p-3 rounded-2xl">
                         <AlertCircle className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Diagnoz xulosasi</p>
                         <p className="text-gray-900 font-bold leading-tight">Zudlik bilan choralar ko'rish tavsiya etiladi</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Symptoms & Causes */}
                <div className="lg:col-span-4 space-y-6">
                   <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                         <Info className="w-5 h-5 text-blue-500" /> Alomatlar
                      </h3>
                      <div className="space-y-3">
                         {selectedDisease.symptoms.map((s, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl font-medium text-gray-700">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              {s}
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                        <Bug className="w-5 h-5 text-orange-500" /> Kelib chiqish sabablari
                      </h3>
                      <p className="text-gray-600 leading-relaxed font-medium">
                        {selectedDisease.causes}
                      </p>
                   </div>
                </div>

                {/* Right Column: Treatments */}
                <div className="lg:col-span-8 space-y-6">
                   <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative group">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="bg-primary-600 text-white p-3 rounded-2xl">
                            <Sparkles className="w-6 h-6" />
                         </div>
                         <h3 className="text-2xl font-black">AI Davolash Tavsiyalari</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 group-hover:shadow-lg transition-shadow">
                            <h4 className="text-lg font-black text-emerald-900 mb-3 flex items-center gap-2">
                               <CheckCircle2 className="w-5 h-5" /> Biologik choralar
                            </h4>
                            <p className="text-emerald-800 font-medium leading-relaxed">{selectedDisease.treatment.biological}</p>
                         </div>
                         <div className="p-6 bg-primary-50/50 rounded-3xl border border-primary-100 group-hover:shadow-lg transition-shadow">
                            <h4 className="text-lg font-black text-primary-900 mb-3 flex items-center gap-2">
                               <Zap className="w-5 h-5" /> Kimyoviy choralar
                            </h4>
                            <p className="text-primary-800 font-medium leading-relaxed">{selectedDisease.treatment.chemical}</p>
                         </div>
                         <div className="md:col-span-2 p-6 bg-slate-50/50 rounded-3xl border border-slate-200 group-hover:shadow-lg transition-shadow">
                            <h4 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                               <ShieldAlert className="w-5 h-5" /> Profilaktika va oldini olish
                            </h4>
                            <p className="text-slate-700 font-medium leading-relaxed">{selectedDisease.treatment.preventive}</p>
                         </div>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                         <p className="text-gray-400 text-xs font-medium italic">* Tavsiyalar umumiy xususiyatga ega, mahalliy agronom bilan maslahatlashing.</p>
                         <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black active:scale-95 transition-all">
                            Mutaxassisga bog'lanish
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiseaseManagementModule;
