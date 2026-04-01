import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userLocation: { lat: number; lon: number } | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  setUserLocation: (loc: { lat: number; lon: number }) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  userLocation: null,
  login: () => {},
  logout: () => {},
  setUserLocation: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocationState] = useState<{ lat: number; lon: number } | null>(() => {
    const saved = localStorage.getItem('user_location_v1');
    return saved ? JSON.parse(saved) : null;
  });

  // 1 week session logic
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  const setUserLocation = (loc: { lat: number; lon: number }) => {
    localStorage.setItem('user_location_v1', JSON.stringify(loc));
    setUserLocationState(loc);
  };

  const logout = () => {
    localStorage.removeItem('auth_token_v1');
    localStorage.removeItem('auth_token_time_v1');
    setUser(null);
  };

  const login = (token: string, userData?: User) => {
    localStorage.setItem('auth_token_v1', token);
    localStorage.setItem('auth_token_time_v1', Date.now().toString());
    if (userData) {
      setUser(userData);
    } else {
      setLoading(true);
      checkSession();
    }
  };

  const checkSession = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token_v1');
      const timeStr = localStorage.getItem('auth_token_time_v1');

      if (!token || !timeStr) {
        throw new Error('No valid token found');
      }

      const savedTime = parseInt(timeStr, 10);
      if (Date.now() - savedTime > ONE_WEEK_MS) {
        throw new Error('Token expired immediately over 1 week');
      }

      // Real API integration
      const res = await api.get('/auth/me');
      
      // Assume response.data contains the user object or response.data.user
      const userData = res.data.user || res.data;
      setUser(userData);
    } catch (err) {
      console.warn('Session check failed or expired', err);
      logout();
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, userLocation, login, logout, setUserLocation }}>
      {children}
    </AuthContext.Provider>
  );
};
