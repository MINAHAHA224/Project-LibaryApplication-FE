// import axios from 'axios';
// import { message } from 'antd'; // Import component message của AntD
//
// message.config({
//     duration: 3, // 3 giây
//     maxCount: 1, // Chỉ hiển thị 1 thông báo tại một thời điểm
// });
// // Tạo một instance của Axios với cấu hình mặc định
// const apiClient = axios.create({
//     baseURL: 'http://localhost:8080/api', // URL gốc của Backend API
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
//
// // Sử dụng interceptor để tự động đính kèm token vào mỗi request
// apiClient.interceptors.request.use(
//     (config) => {
//         // Lấy token từ localStorage (chúng ta sẽ lưu token ở đây sau khi đăng nhập)
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// // ===================================================================
// // INTERCEPTOR MỚI CHO RESPONSE
// // ===================================================================
// // === SỬA LẠI RESPONSE INTERCEPTOR ===
// apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Không hiển thị message ở đây nữa
//
//         // Nếu lỗi 401, vẫn xử lý đăng xuất
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('username');
//             if (window.location.pathname !== '/login') {
//                 window.location.href = '/login';
//             }
//         }
//
//         // Luôn trả về Promise bị reject để component có thể bắt
//         return Promise.reject(error);
//     }
// );
//
// export default apiClient;


// import axios from 'axios';
// import { App } from 'antd';
//
// // Sử dụng một biến global để truy cập vào message API của AntD
// // Điều này cần được khởi tạo từ component gốc
// let messageApi;
// export const setMessageApi = (message) => {
//     messageApi = message;
// };
//
// const apiClient = axios.create({
//     baseURL: 'http://localhost:8080/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
//
// // Interceptor cho Request (giữ nguyên)
// apiClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// // Interceptor cho Response (Cập nhật để xử lý ExceptionResponse)
// apiClient.interceptors.response.use(
//     // Hàm này sẽ được gọi nếu response thành công (status 2xx)
//     (response) => response,
//
//     // Hàm này sẽ được gọi nếu response có lỗi (status không phải 2xx)
//     (error) => {
//         // Luôn kiểm tra xem messageApi đã được khởi tạo chưa
//         if (!messageApi) {
//             console.error("AntD Message API has not been initialized!");
//             return Promise.reject(error);
//         }
//
//         // Mặc định, thời gian hiển thị là 3 giây
//         const DURATION = 3;
//
//         if (error.response) {
//             // **ĐÂY LÀ PHẦN THAY ĐỔI CHÍNH**
//             // Lấy message từ cấu trúc ExceptionResponse mới: `error.response.data.message`
//             const serverMessage = error.response.data?.message;
//
//             if (serverMessage) {
//                 // Nếu có message từ server, hiển thị nó
//                 messageApi.error(serverMessage, DURATION);
//             } else {
//                 // Nếu không có message, hiển thị lỗi chung dựa trên status code
//                 messageApi.error(`Lỗi ${error.response.status}: Yêu cầu không thành công.`, DURATION);
//             }
//
//             // Xử lý đăng xuất khi token không hợp lệ (giữ nguyên)
//             if (error.response.status === 401 || error.response.status === 403) {
//                 localStorage.removeItem('authToken');
//                 localStorage.removeItem('username');
//                 if (window.location.pathname !== '/login') {
//                     window.location.href = '/login';
//                 }
//             }
//         } else if (error.request) {
//             // Lỗi mạng, server không phản hồi
//             messageApi.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.', DURATION);
//         } else {
//             // Lỗi khác khi thiết lập request
//             messageApi.error('Đã có lỗi xảy ra khi gửi yêu cầu.', DURATION);
//         }
//
//         // Luôn trả về Promise bị reject để các khối .catch() trong component vẫn có thể xử lý logic riêng nếu cần
//         return Promise.reject(error);
//     }
// );
//
// export default apiClient;


import axios from 'axios';
// BỎ import { App } from 'antd';
// BỎ let messageApi; và export const setMessageApi;

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm một instance Axios mới chuyên dụng cho việc tải file
export const apiFileClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    responseType: 'blob', // QUAN TRỌNG: yêu cầu response dưới dạng file
});

// Interceptor cho Request (giữ nguyên)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho Response (Phiên bản đơn giản hóa)
apiClient.interceptors.response.use(
    // Response thành công thì cho đi qua
    (response) => response,

    // Response lỗi
    (error) => {
        // Chỉ xử lý logic đặc biệt cho lỗi 401/403 (Token không hợp lệ)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
                // Có thể hiển thị một thông báo trước khi chuyển hướng nếu muốn
                // Nhưng để đơn giản, ta chỉ chuyển hướng
            }
        }

        // Luôn ném lỗi ra để các hàm .catch() trong component có thể bắt được
        return Promise.reject(error);
    }
);

export default apiClient;