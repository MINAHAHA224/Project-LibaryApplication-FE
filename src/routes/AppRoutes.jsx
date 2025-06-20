// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
//
// // Import các trang và components
// import LoginPage from '../pages/LoginPage';
// import MainLayout from '../components/layout/MainLayout';
// import ProtectedRoute from '../components/auth/ProtectedRoute';
// import BookTitlePage from '../pages/BookTitlePage';
// import ReaderPage from '../pages/ReaderPage';
// import StaffPage from '../pages/StaffPage';
// import RentalPage from '../pages/RentalPage';
// import BackupPage from '../pages/BackupPage';
// import BookTypePage from '../pages/BookTypePage';
// import ReportPreviewPage from '../pages/ReportPreviewPage';
// import ReaderReportPreview from '../pages/ReaderReportPreview'; // Import trang mới
// import OverdueReportPreview from '../pages/OverdueReportPreview';
// import MostBorrowedReportPreview from '../pages/MostBorrowedReportPreview';
// import AccountManagementPage from "../pages/AccountManagementPage.jsx";
// import ResetPasswordPage from '../pages/ResetPasswordPage';
//
// function AppRoutes() { // Đổi tên thành AppRoutes
//     return (
//         <Routes>
//             <Route path="/login" element={<LoginPage />} />
//             <Route element={<ProtectedRoute />}>
//                 <Route element={<MainLayout />}>
//                     <Route path="/" element={<BookTitlePage />} />
//                     <Route path="/readers" element={<ReaderPage />} />
//                     <Route path="/staffs" element={<StaffPage />} />
//                     <Route path="/book-types" element={<BookTypePage />} />
//                     <Route path="/rentals" element={<RentalPage />} />
//                     {/*<Route path="/returns" element={<ReturnPage />} />*/}
//                     <Route path="/report/preview" element={<ReportPreviewPage />} />
//                     <Route path="/readers/report/preview" element={<ReaderReportPreview />} /> {/* Route mới */}
//                     <Route path="/rentals/reports/overdue/preview" element={<OverdueReportPreview />} />
//                     <Route path="/rentals/reports/most-borrowed/preview" element={<MostBorrowedReportPreview />} />
//                     {/* === THÊM ROUTE MỚI CHO QUẢN LÝ TÀI KHOẢN === */}
//                     <Route path="/accounts" element={<AccountManagementPage />} />
//                     <Route path="/reset-password" element={<ResetPasswordPage />} />
//
//                     <Route path="/backup" element={<BackupPage />} />
//                 </Route>
//             </Route>
//             <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
//         </Routes>
//     );
// }
//
// export default AppRoutes;


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các trang và components
import LoginPage from '../pages/LoginPage';
import StaffLoginPage from '../pages/StaffLoginPage';
import GuestSearchPage from '../pages/GuestSearchPage';

import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import BookTitlePage from '../pages/BookTitlePage';
import ReaderPage from '../pages/ReaderPage';
import StaffPage from '../pages/StaffPage';
import BookTypePage from '../pages/BookTypePage';
import RentalPage from '../pages/RentalPage';
import BackupPage from '../pages/BackupPage';
import AccountManagementPage from "../pages/AccountManagementPage";
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Import các trang xem trước báo cáo
import ReportPreviewPage from '../pages/ReportPreviewPage';
import ReaderReportPreview from '../pages/ReaderReportPreview';
import OverdueReportPreview from '../pages/OverdueReportPreview';
import MostBorrowedReportPreview from '../pages/MostBorrowedReportPreview';
import AuthorPage from "../pages/AuthorPage.jsx";


function AppRoutes() {
    return (
        <Routes>
            {/* === CÁC ROUTE CÔNG KHAI === */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/staff" element={<StaffLoginPage />} />
            <Route path="/guest/search" element={<GuestSearchPage />} />

            {/* === CÁC ROUTE ĐƯỢC BẢO VỆ (DÀNH CHO THỦ THƯ/ADMIN) === */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    {/* Trang mặc định sau khi đăng nhập */}
                    <Route path="/" element={<BookTitlePage />} />

                    {/* Các trang quản lý */}
                    <Route path="/authors" element={<AuthorPage />} />
                    <Route path="/readers" element={<ReaderPage />} />
                    <Route path="/staffs" element={<StaffPage />} />
                    <Route path="/book-types" element={<BookTypePage />} />
                    <Route path="/rentals" element={<RentalPage />} />

                    {/* Các trang quản trị hệ thống */}
                    <Route path="/accounts" element={<AccountManagementPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/backup" element={<BackupPage />} />

                    {/* Các trang xem trước báo cáo (cần đăng nhập để xem) */}
                    <Route path="/report/preview" element={<ReportPreviewPage />} />
                    <Route path="/readers/report/preview" element={<ReaderReportPreview />} />
                    <Route path="/rentals/reports/overdue/preview" element={<OverdueReportPreview />} />
                    <Route path="/rentals/reports/most-borrowed/preview" element={<MostBorrowedReportPreview />} />
                </Route>
            </Route>

            {/* Điều hướng mặc định và trang không tồn tại */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;