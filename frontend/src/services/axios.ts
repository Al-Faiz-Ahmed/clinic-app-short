import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/components/toast/Toaster';

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  message?: string | null;
  error?: string | null;
  data: T | null;
};

function isApiEnvelope(value: unknown): value is ApiEnvelope {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.success === 'boolean' &&
    'data' in v &&
    ('message' in v || 'error' in v)
  );
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle backend envelope { success, message, error, data }
api.interceptors.response.use(
  (response) => {
    // If response is not in the envelope shape (e.g. file download), pass through.
    if (!isApiEnvelope(response.data)) return response;

    // Envelope present: treat success=false as an application error even if HTTP is 200.
    if (response.data.success === true) return response;

    const errorMessage =
      response.data.message || response.data.error || 'An error occurred';
    toast.error?.(errorMessage);
    return Promise.reject(
      Object.assign(new Error(errorMessage), {
        name: response.data.error || 'ApiError',
        response: response.data,
        status: response.status,
      })
    );
  },
  (error: AxiosError) => {
    const payload = error.response?.data;
    if (isApiEnvelope(payload)) {
      const errorMessage = payload.message || payload.error || error.message;
      toast.error?.(errorMessage || 'An error occurred');
      return Promise.reject(
        Object.assign(new Error(errorMessage || 'An error occurred'), {
          name: payload.error || 'ApiError',
          response: payload,
          status: error.response?.status,
          original: error,
        })
      );
    }

    const errorMessage =
      (payload as any)?.message || error.message || 'An error occurred';
    toast.error?.(errorMessage);
    return Promise.reject(error);
  }
);

export default api;
