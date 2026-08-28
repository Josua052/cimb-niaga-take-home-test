import axios from 'axios';

/**
 * Centralized Axios HTTP client instance with base URL from environment variables.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
