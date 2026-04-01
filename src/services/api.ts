import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.agromarkaz.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token_v1');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 Unauthorized for token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('auth_token_v1'); // sending old token
        if (refreshToken) {
          const res = await axios.post('https://api.agromarkaz.com/api/auth/refresh', {
            token: refreshToken,
          });
          const newToken = res.data.token || res.data.accessToken;
          if (newToken) {
            localStorage.setItem('auth_token_v1', newToken);
            localStorage.setItem('auth_token_time_v1', Date.now().toString());
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.warn('Refresh token failed:', refreshError);
        localStorage.removeItem('auth_token_v1');
        localStorage.removeItem('auth_token_time_v1');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
