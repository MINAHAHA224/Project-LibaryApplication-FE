import apiClient from './api';

export const getAuthors = () => apiClient.get('/authors');

export const createAuthor = (data) => apiClient.post('/authors', data);

export const updateAuthor = (id, data) => apiClient.put(`/authors/${id}`, data);

export const deleteAuthor = (id) => apiClient.delete(`/authors/${id}`);

export const undoAuthorAction = (action) => apiClient.post('/authors/undo', action);