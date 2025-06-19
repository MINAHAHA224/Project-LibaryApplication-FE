// src/services/passwordService.js
import apiClient from './api';

export const getCreatedLogins = () => apiClient.get('/passwords/created-logins');
export const resetPasswordForUser = (data) => apiClient.post('/passwords/reset-for-user', data);