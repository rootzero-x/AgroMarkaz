import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, Phone, User, BadgeInfo } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import AuthTransitionOverlay from '../components/AuthTransitionOverlay';
import LocationPrompt from '../components/LocationPrompt';
import { motion, AnimatePresence } from 'framer-motion';

const phoneRegExp = /^\+?[0-9]{9,15}$/;

const schema = yup.object().shape({
  full_name: yup.string().required('To\'liq ismingizni kiriting'),
  email: yup.string().email('Noto\'g\'ri email formati').required('Email kiritilishi shart'),
  username: yup.string().required('Username kiritilishi shart').min(4, 'Kamida 4 ta belgi'),
  phone_number: yup.string().matches(phoneRegExp, 'Noto\'g\'ri format').required('Telefon kiritilishi shart'),
  password: yup.string().required('Parol kiritilishi shart').min(6, 'Kamida 6 ta belgi'),
});

const Register: React.FC = () => {
  const { login, isAuthenticated, loading: contextLoading, userLocation, setUserLocation } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });
  
  const [loading, setLoading] = useState(false);
  const [successLoading, setSuccessLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [apiError, setApiError] = useState('');

  if (contextLoading) return <LoadingOverlay />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const goToDashboard = () => {
    setSuccessLoading(true);
    setTimeout(() => navigate('/'), 1600);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await api.post('/auth/register', data);
      const token = response.data.token || response.data.accessToken;
      if (token) {
        login(token);
        setLoading(false);
        if (userLocation) {
          goToDashboard();
        } else {
          setShowLocationPrompt(true);
        }
      } else {
        setLoading(false);
        setSuccessLoading(true);
        setTimeout(() => navigate('/login'), 1600);
      }
    } catch (error: any) {
      console.error('Register error', error);
      setApiError(error.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationGranted = (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    setShowLocationPrompt(false);
    goToDashboard();
  };

  const handleLocationSkip = () => {
    setShowLocationPrompt(false);
    goToDashboard();
  };

  return (
    <>
      <AnimatePresence>
        {successLoading && <AuthTransitionOverlay variant="register" />}
        {showLocationPrompt && (
          <LocationPrompt onGranted={handleLocationGranted} onSkip={handleLocationSkip} />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 90 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[500px] origin-center backface-hidden"
      >
        <div className="bg-white rounded-[24px] md:rounded-[32px] md:border border-gray-100 p-6 sm:p-7 md:p-8 md:shadow-[0_4px_40px_-5px_rgba(0,0,0,0.05)] w-full overflow-y-auto max-h-[96dvh] custom-scrollbar">
          
          {/* Compact Integrated Header inside the card */}
          <div className="text-center mb-5 sm:mb-6 flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-[14px] flex items-center justify-center mb-3 sm:mb-4 lg:hidden">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Yangi hisob yaratish</h1>
            <p className="text-[12px] sm:text-[13px] md:text-sm text-gray-500 font-medium">Platformaga xush kelibsiz</p>
          </div>

          {apiError && (
            <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs sm:text-[13px] font-medium text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <BadgeInfo className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('full_name')}
                  className={`input-field pl-11 py-3 sm:py-3.5 text-sm sm:text-[15px] ${errors.full_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                  placeholder="To'liq ismingizni kiriting"
                />
              </div>
              {errors.full_name && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.full_name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-[18px] w-[18px] text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    className={`input-field pl-11 py-3 sm:py-3.5 text-sm sm:text-[15px] ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                    placeholder="Elektron manzilingizni kiriting"
                  />
                </div>
                {errors.email && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-[18px] w-[18px] text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('username')}
                    className={`input-field pl-11 py-3 sm:py-3.5 text-sm sm:text-[15px] ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                    placeholder="Yangi username yarating"
                  />
                </div>
                {errors.username && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('phone_number', {
                    onChange: (e) => {
                      let val = e.target.value;
                      const isPlus = val.startsWith('+');
                      val = val.replace(/\D/g, '');
                      if (isPlus || val.length > 0) {
                        val = '+' + val;
                      }
                      if (val.length > 13) {
                        val = val.slice(0, 13);
                      }
                      e.target.value = val;
                    }
                  })}
                  onFocus={(e) => {
                    if (!e.target.value || e.target.value === '+') {
                      setValue('phone_number', '+998', { shouldValidate: false });
                    }
                  }}
                  className={`input-field pl-11 py-3 sm:py-3.5 text-sm sm:text-[15px] ${errors.phone_number ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                  placeholder="+998 __ ___ __ __"
                  maxLength={13}
                />
              </div>
              {errors.phone_number && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.phone_number.message}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`input-field pl-11 py-3 sm:py-3.5 text-sm sm:text-[15px] ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                  placeholder="Xavfsiz parol o'rnating"
                />
              </div>
              {errors.password && <p className="mt-1 ml-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || successLoading}
              className="btn-primary mt-6 sm:mt-7 relative overflow-hidden group py-3.5 sm:py-4 w-full"
            >
              <span className={`transition-all duration-300 flex items-center justify-center gap-2 text-[15px] font-bold ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                Tasdiqlash va Kirish
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </button>
          </form>
          
          <p className="mt-7 sm:mt-8 text-center text-[13px] sm:text-sm text-gray-500">
            Allaqachon hisobingiz bormi?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-all underline decoration-primary-600/30 underline-offset-4">
              Tizimga kirish
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Register;
