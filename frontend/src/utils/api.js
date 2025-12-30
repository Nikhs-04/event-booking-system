import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
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

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getProfile = () => api.get('/auth/profile');

// Event APIs
export const getEvents = () => api.get('/events');
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post('/events', eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Booking APIs
export const createPayPalOrder = (bookingData) => api.post('/bookings/create-paypal-order', bookingData);
export const capturePayPalOrder = (captureData) => api.post('/bookings/capture-paypal-order', captureData);
export const getUserBookings = () => api.get('/bookings/my-bookings');
export const getAllBookings = () => api.get('/bookings/all');

export default api;