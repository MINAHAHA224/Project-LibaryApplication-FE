import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các trang và components
import LoginPage from '../pages/LoginPage';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import BookTitlePage from '../pages/BookTitlePage';
import ReaderPage from '../pages/ReaderPage';
import StaffPage from '../pages/StaffPage';
import RentalPage from '../pages/RentalPage';
import BackupPage from '../pages/BackupPage';
import BookTypePage from '../pages/BookTypePage';
import ReportPreviewPage from '../pages/ReportPreviewPage';
import ReaderReportPreview from '../pages/ReaderReportPreview'; // Import trang mới
import OverdueReportPreview from '../pages/OverdueReportPreview';
import MostBorrowedReportPreview from '../pages/MostBorrowedReportPreview';
import AccountManagementPage from "../pages/AccountManagementPage.jsx";
import ResetPasswordPage from '../pages/ResetPasswordPage';

function AppRoutes() { // Đổi tên thành AppRoutes
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<BookTitlePage />} />
                    <Route path="/readers" element={<ReaderPage />} />
                    <Route path="/staffs" element={<StaffPage />} />
                    <Route path="/book-types" element={<BookTypePage />} />
                    <Route path="/rentals" element={<RentalPage />} />
                    {/*<Route path="/returns" element={<ReturnPage />} />*/}
                    <Route path="/report/preview" element={<ReportPreviewPage />} />
                    <Route path="/readers/report/preview" element={<ReaderReportPreview />} /> {/* Route mới */}
                    <Route path="/rentals/reports/overdue/preview" element={<OverdueReportPreview />} />
                    <Route path="/rentals/reports/most-borrowed/preview" element={<MostBorrowedReportPreview />} />
                    {/* === THÊM ROUTE MỚI CHO QUẢN LÝ TÀI KHOẢN === */}
                    <Route path="/accounts" element={<AccountManagementPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    <Route path="/backup" element={<BackupPage />} />
                </Route>
            </Route>
            <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Routes>
    );
}

export default AppRoutes;