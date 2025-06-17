import apiClient from './api';

export const getDatabases = () => apiClient.get('/backups/databases');
export const getBackupHistory = (dbName) => apiClient.get(`/backups/history?dbName=${dbName}`);
export const backupDatabase = (data) => apiClient.post('/backups', data);
export const restoreDatabase = (data) => apiClient.post('/backups/restore', data);