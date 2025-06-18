// import React, { createContext, useState, useContext, useEffect } from 'react';
// import apiClient from '../services/api';
//
// // Tạo Context
// const AuthContext = createContext(null);
//
// // Tạo Provider Component
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true); // Thêm state loading để kiểm tra token ban đầu
//
//     useEffect(() => {
//         // Khi app tải lần đầu, kiểm tra xem có token trong localStorage không
//         const token = localStorage.getItem('authToken');
//         const username = localStorage.getItem('username');
//
//         if (token && username) {
//             // Nếu có, giả định người dùng đã đăng nhập
//             setUser({ username });
//         }
//         setLoading(false); // Kết thúc kiểm tra
//     }, []);
//
//     const login = async (username, password) => {
//         try {
//             const response = await apiClient.post('/auth/login', { username, password });
//             const { token, user: loggedInUser } = response.data;
//
//             localStorage.setItem('authToken', token);
//             // Không cần lưu username riêng nữa, ta có thể lưu cả object user
//             localStorage.setItem('user', JSON.stringify(loggedInUser));
//
//             setUser(loggedInUser); // Cập nhật state với object đầy đủ
//         }  catch (error) {
//             console.error("Login failed:", error);
//             // Xóa token cũ nếu có lỗi
//             localStorage.removeItem('authToken');
//             localStorage.removeItem('username');
//             setUser(null);
//             throw error; // Ném lỗi để component Login có thể bắt và hiển thị
//         }
//     };
//
//     const logout = () => {
//         // Xóa token và thông tin user
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('username');
//         setUser(null);
//     };
//
//     // Giá trị mà context sẽ cung cấp cho các component con
//     const value = {
//         user,
//         isAuthenticated: !!user,
//         loading,
//         login,
//         logout,
//     };
//
//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
//
// // Custom hook để sử dụng AuthContext dễ dàng hơn
// export const useAuth = () => {
//     return useContext(AuthContext);
// };


import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Khi app tải lần đầu, đọc token và thông tin user từ localStorage
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                // Parse object user đã được lưu dưới dạng chuỗi JSON
                const userData = JSON.parse(storedUser);
                setUser(userData); // Khôi phục state với thông tin đã lưu
            } catch (error) {
                // Nếu parse lỗi, xóa thông tin hỏng
                console.error("Failed to parse user data from localStorage", error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiClient.post('/auth/login', { username, password });
            const { token, user: loggedInUser } = response.data;

            localStorage.setItem('authToken', token);
            // Lưu cả object user dưới dạng chuỗi JSON
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            setUser(loggedInUser);
        } catch (error) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // Xóa cả thông tin user
        setUser(null);
        // Điều hướng về trang login, có thể làm ở component hoặc ở đây
        window.location.href = '/login';
    };

    const value = { user, isAuthenticated: !!user, loading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);