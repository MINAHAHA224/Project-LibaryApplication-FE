// src/services/authService.js
import apiClient from './api';

export const login = (data) => apiClient.post('/auth/login', data);
export const changePassword = (data) => apiClient.post('/auth/change-password', data);
export const forgotPassword = (data) => apiClient.post('/auth/forgot-password', data);