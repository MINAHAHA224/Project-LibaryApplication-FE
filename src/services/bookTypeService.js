// src/services/bookTypeService.js
import apiClient from './api';

export const getBookTypes = () => apiClient.get('/book-types');
export const createBookType = (data) => apiClient.post('/book-types', data);
export const updateBookType = (id, data) => apiClient.put(`/book-types/${id}`, data);
export const deleteBookType = (id) => apiClient.delete(`/book-types/${id}`);
// === BỔ SUNG HÀM UNDO ===
export const undoBookTypeAction = (action) => {
    return apiClient.post('/book-types/undo', action);
};