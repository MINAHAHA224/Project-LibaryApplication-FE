import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { App as AntApp } from 'antd'; // Import <App> của AntD và đổi tên thành AntApp
import App from './App.jsx'; // Đây vẫn là App.jsx chứa Routes của chúng ta
import './index.css';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                {/* Bọc toàn bộ ứng dụng của chúng ta bên trong <AntApp> */}
                <AntApp>
                    <App />
                </AntApp>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);