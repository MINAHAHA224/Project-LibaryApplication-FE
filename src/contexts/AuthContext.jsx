import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';

// Tạo Context
const AuthContext = createContext(null);

// Tạo Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm state loading để kiểm tra token ban đầu

    useEffect(() => {
        // Khi app tải lần đầu, kiểm tra xem có token trong localStorage không
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        if (token && username) {
            // Nếu có, giả định người dùng đã đăng nhập
            setUser({ username });
        }
        setLoading(false); // Kết thúc kiểm tra
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiClient.post('/auth/login', { username, password });
            const { token, username: loggedInUsername } = response.data;

            // Lưu token và thông tin user vào localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', loggedInUsername);

            // Cập nhật state
            setUser({ username: loggedInUsername });

            return true; // Đăng nhập thành công
        } catch (error) {
            console.error("Login failed:", error);
            // Xóa token cũ nếu có lỗi
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            setUser(null);
            throw error; // Ném lỗi để component Login có thể bắt và hiển thị
        }
    };

    const logout = () => {
        // Xóa token và thông tin user
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setUser(null);
    };

    // Giá trị mà context sẽ cung cấp cho các component con
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
    return useContext(AuthContext);
};