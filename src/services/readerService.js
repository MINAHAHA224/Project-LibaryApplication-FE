import apiClient, { apiFileClient } from './api';

export const getReaders = () => apiClient.get('/readers');
export const getReader = (id) => apiClient.get(`/readers/${id}`);
export const createReader = (data) => apiClient.post('/readers', data);
export const updateReader = (id, data) => apiClient.put(`/readers/${id}`, data);
export const deleteReader = (id) => apiClient.delete(`/readers/${id}`);
// === HÀM CÒN THIẾU ĐỂ BỔ SUNG ===
export const undoReaderAction = (action) => {
    return apiClient.post('/readers/undo', action);
};

export const downloadReadersReport = () => {
    return apiFileClient.get('/readers/report/excel');
};