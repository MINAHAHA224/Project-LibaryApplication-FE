import apiClient, { apiFileClient } from './api';

// Lấy dữ liệu cho form
export const getNewTicketId = () => apiClient.get('/rentals/new-ticket-id');
export const getStaffList = () => apiClient.get('/rentals/staffs');
export const getActiveReader = (readerId) => apiClient.get(`/rentals/readers/${readerId}`);
export const getAvailableBook = (bookId) => apiClient.get(`/rentals/books/${bookId}`);

// Lấy dữ liệu chính
export const getRentalHistory = () => apiClient.get('/rentals');
export const getRentalDetail = (ticketId) => apiClient.get(`/rentals/${ticketId}`);

// Tạo phiếu mượn
export const createRental = (data) => apiClient.post('/rentals', data);
// --- NGHIỆP VỤ TRẢ SÁCH ---
export const returnBook = (data) => apiClient.post('/rentals/return-book', data);
export const downloadOverdueReport = () => {
    return apiFileClient.get('/readers/reports/overdue-borrowings');
};

export const downloadMostBorrowedReport = (tuNgay, denNgay) => {
    return apiFileClient.get(`/rentals/reports/most-borrowed?tuNgay=${tuNgay}&denNgay=${denNgay}`);
};
export const getMostBorrowedReportData = (tuNgay, denNgay) => {
    return apiClient.get(`/rentals/reports/most-borrowed-preview-data?tuNgay=${tuNgay}&denNgay=${denNgay}`);
};
export const getOverdueReportData = () => apiClient.get('/readers/reports/overdue-preview-data');