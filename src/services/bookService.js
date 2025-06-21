import apiClient from './api';

// Lấy tất cả sách con của một đầu sách
export const getBooksByIsbn = (isbn) => {
    return apiClient.get(`/book-titles/${isbn}/books`);
};

// Lấy danh sách Ngăn tủ cho form
export const getDrawers = () => {
    return apiClient.get('/book-titles/books/drawers');
};

// Thêm sách con mới
export const createBook = (isbn, bookData) => {
    return apiClient.post(`/book-titles/${isbn}/books`, bookData);
};

// Cập nhật sách con
export const updateBook = (isbn, oldBookId, bookData) => {
    return apiClient.put(`/book-titles/${isbn}/books/${oldBookId}`, bookData);
};

// Xóa sách con
export const deleteBook = (isbn, bookId) => {
    return apiClient.delete(`/book-titles/${isbn}/books/${bookId}`);
};

// API Undo cho sách con (sẽ tạo ở Backend)
export const undoBookAction = (action) => {
    return apiClient.post('/book-titles/books/undo', action);
};