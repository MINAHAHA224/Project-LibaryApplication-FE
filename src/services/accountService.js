import apiClient from './api';

export const getStaffsWithoutLogin = () => apiClient.get('/accounts/staffs-no-login');
export const getReadersWithoutLogin = () => apiClient.get('/accounts/readers-no-login');
export const createAccount = (data) => apiClient.post('/accounts/create', data);