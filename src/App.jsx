// import React from 'react';
// import { useAuth } from './contexts/AuthContext';
// import AppRoutes from './routes/AppRoutes';
// import { Spin } from 'antd';
//
// function App() {
//     const { loading } = useAuth();
//
//     // Trong khi chờ xác thực token ban đầu, hiển thị spinner
//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <Spin size="large" tip="Đang tải..." />
//             </div>
//         );
//     }
//
//     // Sau khi kiểm tra xong, hiển thị các routes
//     return <AppRoutes />;
// }
//
// export default App;


import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { Spin } from 'antd';

function App() {
    const { loading } = useAuth();
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }
    return <AppRoutes />;
}
export default App;