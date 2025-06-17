import apiClient from './api';

export const getStaffs = () => apiClient.get('/staffs');
export const getStaff = (id) => apiClient.get(`/staffs/${id}`);
export const createStaff = (data) => apiClient.post('/staffs', data);
export const updateStaff = (id, data) => apiClient.put(`/staffs/${id}`, data);
export const deleteStaff = (id) => apiClient.delete(`/staffs/${id}`);

export const undoStaffAction = (action) => {
    return apiClient.post('/staffs/undo', action);
};