import apiClient ,{ apiFileClient } from './api';

const getBookTitles = () => {
    return apiClient.get('/book-titles');
};

const getBookTitle = (isbn) => {
    return apiClient.get(`/book-titles/${isbn}`);
};

// Lấy dữ liệu cho form
const getFormData = () => {
    return Promise.all([
        apiClient.get('/book-titles/form-data/authors'),
        apiClient.get('/book-titles/form-data/languages'),
        apiClient.get('/book-titles/form-data/book-types'),
    ]);
};

const createBookTitle = (formData) => {
    return apiClient.post('/book-titles', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateBookTitle = (isbn, formData) => { // formData giờ là một FormData object
    return apiClient.put(`/book-titles/${isbn}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
const deleteBookTitle = (isbn) => {
    return apiClient.delete(`/book-titles/${isbn}`);
};
// === API MỚI CHO UNDO ===
const undoBookTitleAction = (action) => {
    return apiClient.post('/book-titles/undo', action);
};
 const getBookTitleReportData = () => {
    // Gọi đến API lấy dữ liệu JSON cho trang preview
    return apiClient.get('/book-titles/report/preview-data');
};

 const downloadBookTitleReport = () => {
    return apiFileClient.get('/book-titles/report/excel');
};

 const uploadBookImage = (isbn, imageFile) => {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return apiClient.post(`/book-titles/${isbn}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export {
    getBookTitles,
    getBookTitle,
    getFormData,
    createBookTitle,
    updateBookTitle,
    deleteBookTitle,
    undoBookTitleAction,
    getBookTitleReportData, // <<-- Thêm vào đây
    downloadBookTitleReport,  // <<-- Thêm vào đây
    uploadBookImage
};