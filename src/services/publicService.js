import apiClient from './api';

// API này không cần token
export const getPublicBookTitles = () => {
    // Lưu ý: Không dùng apiClient có interceptor token ở đây nếu API là public thật sự
    // Nhưng vì SecurityConfig đang cho phép, ta cứ dùng tạm apiClient cho tiện
    return apiClient.get('/public/book-titles');
};

export const getPublicBooksByIsbn = (isbn) => {
    return apiClient.get(`/public/book-titles/${isbn}/books`);
};