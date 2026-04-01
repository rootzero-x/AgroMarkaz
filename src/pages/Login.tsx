import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Leaf, Lock, User } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import AuthTransitionOverlay from '../components/AuthTransitionOverlay';
import LocationPrompt from '../components/LocationPrompt';
import { motion, AnimatePresence } from 'framer-motion';

const schema = yup.object().shape({
  username: yup.string().required('Username kiritilishi shart'),
  password: yup.string().required('Parol kiritilishi shart'),
});

const Login: React.FC = () => {
  const { login, isAuthenticated, loading: contextLoading, userLocation, setUserLocation } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
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
      const response = await api.post('/auth/login', data);
      const token = response.data.token || response.data.accessToken;
      if (token) {
        login(token);
        setLoading(false);
        // If we already have location saved, skip prompt
        if (userLocation) {
          goToDashboard();
        } else {
          setShowLocationPrompt(true);
        }
      } else {
        throw new Error('Token topilmadi');
      }
    } catch (error: any) {
      console.error('Login error', error);
      setApiError(error.response?.data?.message || 'Tizimga kirishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
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
        {successLoading && <AuthTransitionOverlay variant="login" />}
        {showLocationPrompt && (
          <LocationPrompt onGranted={handleLocationGranted} onSkip={handleLocationSkip} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: -90 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] origin-center backface-hidden"
      >
        <div className="bg-white rounded-[24px] md:rounded-[32px] md:border border-gray-100 p-6 md:p-8 md:shadow-[0_4px_40px_-5px_rgba(0,0,0,0.05)] w-full overflow-y-auto max-h-[96dvh] custom-scrollbar">

          {/* Compact Integrated Header inside the card */}
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary-50 rounded-[14px] flex items-center justify-center mb-4 lg:hidden">
              <Leaf className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Xush kelibsiz!</h1>
            <p className="text-[13px] sm:text-sm text-gray-500">AgroMarkaz hisobingizga kiring</p>
          </div>

          {apiError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs sm:text-[13px] font-medium text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-1.5 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('username')}
                  className={`input-field pl-11 py-3.5 text-sm sm:text-[15px] ${errors.username ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                  placeholder="Foydalanuvchi nomini kiriting"
                />
              </div>
              {errors.username && <p className="mt-1.5 ml-1 text-xs sm:text-[13px] text-red-500 font-medium">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-1.5 ml-1">Parol</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`input-field pl-11 py-3.5 text-sm sm:text-[15px] ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : ''}`}
                  placeholder="Maxfiy parolingizni kiriting"
                />
              </div>
              {errors.password && <p className="mt-1.5 ml-1 text-xs sm:text-[13px] text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || successLoading}
              className="btn-primary mt-6 sm:mt-8 relative overflow-hidden group py-3.5 sm:py-4 w-full"
            >
              <span className={`transition-all duration-300 flex items-center justify-center gap-2 text-[15px] font-bold ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                Tizimga kirish
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

          <p className="mt-8 text-center text-[13px] sm:text-sm text-gray-500">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-all underline decoration-primary-600/30 underline-offset-4">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
