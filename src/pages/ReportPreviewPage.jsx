// import React, { useEffect, useState, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Table, Button, Spin, Empty, Typography, Space, App as AntdApp } from 'antd';
// import { FileExcelOutlined, FilePdfOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
// import { useAuth } from '../contexts/AuthContext';
// import { downloadFile } from '../utils/helpers';
//
// // Import tất cả các service liên quan đến báo cáo
// import { getBookTitleReportData, downloadBookTitleReport } from '../services/bookTitleService';
// import { getReaders, downloadReadersReport } from '../services/readerService'; // Giả sử bạn có hàm download này
// import { downloadOverdueReport, downloadMostBorrowedReport } from '../services/rentalService'; // Giả sử
// import { downloadBookTitlePdf, printBookTitlePdf } from '../services/pdfService';
//
//
// const { Title } = Typography;
//
// const ReportPreviewPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { state } = location;
//     const { user } = useAuth();
//     const { message } = AntdApp.useApp();
//
//     // Nếu không có state hoặc reportType, điều hướng về trang trước đó
//     useEffect(() => {
//         if (!state || !state.reportType) {
//             message.error("Không có dữ liệu báo cáo để hiển thị.");
//             navigate(-1);
//         }
//     }, [state, navigate, message]);
//
//     // Nếu state không tồn tại, render null để tránh lỗi
//     if (!state) return null;
//
//     const { reportType, columns, title, backUrl, downloadParams } = state;
//
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//
//     // Hàm lấy dữ liệu JSON cho bảng preview
//     const fetchDataForPreview = useCallback(async () => {
//         setLoading(true);
//         try {
//             let response;
//             switch (reportType) {
//                 case 'bookTitle':
//                     response = await getBookTitleReportData();
//                     break;
//                 case 'reader':
//                     response = await getReaders();
//                     break;
//                 // Thêm các case khác cho các báo cáo khác ở đây
//                 default:
//                     throw new Error("Loại báo cáo không hợp lệ.");
//             }
//             setData(response.data);
//         } catch (error) {
//             // Lỗi đã được interceptor xử lý, không cần message ở đây
//             console.error(`Failed to fetch data for report type: ${reportType}`, error);
//         } finally {
//             setLoading(false);
//         }
//     }, [reportType]);
//
//     useEffect(() => {
//         fetchDataForPreview();
//     }, [fetchDataForPreview]);
//
//     // Hàm xử lý tải file Excel
//     const handleDownloadExcel = async () => {
//         setLoading(true);
//         try {
//             let response;
//             switch (reportType) {
//                 case 'bookTitle':
//                     response = await downloadBookTitleReport();
//                     downloadFile(response, 'BaoCao_DauSach.xlsx');
//                     break;
//                 case 'reader':
//                     response = await downloadReadersReport();
//                     downloadFile(response, 'BaoCao_DocGia.xlsx');
//                     break;
//                 // Thêm các case khác
//                 default:
//                     message.error("Chức năng xuất Excel chưa được hỗ trợ cho báo cáo này.");
//                     return;
//             }
//         } catch (error) {
//             console.error(`Failed to download excel for report type: ${reportType}`, error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Hàm xử lý tải file PDF
//     const handleDownloadPdf = () => {
//         if (data.length === 0) return;
//         try {
//             switch (reportType) {
//                 case 'bookTitle':
//                     downloadBookTitlePdf(data, user.username);
//                     break;
//                 // Thêm các case khác
//                 default:
//                     message.error("Chức năng xuất PDF chưa được hỗ trợ cho báo cáo này.");
//             }
//         } catch (error) {
//             console.error(`Failed to download pdf for report type: ${reportType}`, error);
//         }
//     };
//
//     // Hàm xử lý In PDF
//     const handlePrintPdf = () => {
//         if (data.length === 0) return;
//         try {
//             switch (reportType) {
//                 case 'bookTitle':
//                     printBookTitlePdf(data, user.username);
//                     break;
//                 // Thêm các case khác
//                 default:
//                     message.error("Chức năng in PDF chưa được hỗ trợ cho báo cáo này.");
//             }
//         } catch (error) {
//             console.error(`Failed to print pdf for report type: ${reportType}`, error);
//         }
//     };
//
//
//     return (
//         <div>
//             <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
//                 <Title level={3} style={{ margin: 0 }}>{title || 'Xem trước Báo cáo'}</Title>
//                 <Space>
//                     <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backUrl || -1)}>
//                         Quay lại
//                     </Button>
//                     <Button
//                         icon={<PrinterOutlined />}
//                         onClick={handlePrintPdf}
//                         disabled={loading || data.length === 0}
//                         style={{ backgroundColor: '#673ab7', color: 'white' }}
//                     >
//                         In PDF
//                     </Button>
//                     <Button
//                         icon={<FilePdfOutlined />}
//                         onClick={handleDownloadPdf}
//                         disabled={loading || data.length === 0}
//                         style={{ backgroundColor: '#f44336', color: 'white' }}
//                     >
//                         Tải PDF
//                     </Button>
//                     <Button
//                         type="primary"
//                         icon={<FileExcelOutlined />}
//                         onClick={handleDownloadExcel}
//                         disabled={loading || data.length === 0}
//                     >
//                         Tải Excel
//                     </Button>
//                 </Space>
//             </Space>
//
//             <Spin spinning={loading}>
//                 <Table
//                     columns={columns}
//                     dataSource={data}
//                     bordered
//                     rowKey={(record, index) => record.id || record.isbn || record.madg || record.maNV || index}
//                     locale={{ emptyText: <Empty description="Không có dữ liệu để tạo báo cáo." /> }}
//                 />
//             </Spin>
//         </div>
//     );
// };
//
// export default ReportPreviewPage;


// src/pages/ReportPreviewPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Typography, Space, App as AntdApp } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { downloadFile } from '../utils/helpers';

// Import các service
import { getBookTitleReportData, downloadBookTitleReport } from '../services/bookTitleService';
// Giả sử bạn sẽ tạo các hàm này cho các báo cáo khác
// import { getReaderReportData, downloadReadersReport } from '../services/readerService';
import { downloadBookTitlePdf, printBookTitlePdf } from '../services/pdfService';
import './ReportPreviewPage.css'; // Import file CSS

const { Title, Text } = Typography;

// --- HÀM HELPER ĐỂ GOM NHÓM DỮ LIỆU ---
const groupDataByGenre = (data) => {
    if (!data || data.length === 0) return [];

    const groupedMap = data.reduce((acc, item) => {
        const genre = item.nameCodeType || 'Chưa phân loại';
        if (!acc[genre]) {
            acc[genre] = {
                genreName: genre,
                items: [],
                totalBooks: 0,
                totalCopies: 0,
            };
        }
        acc[genre].items.push(item);
        acc[genre].totalBooks += 1;
        acc[genre].totalCopies += item.soCuonThucTe || 0;
        return acc;
    }, {});

    return Object.values(groupedMap);
};


const ReportPreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const { user } = useAuth();
    const { message } = AntdApp.useApp();

    const [rawData, setRawData] = useState([]); // Lưu dữ liệu gốc để xuất file
    const [groupedData, setGroupedData] = useState([]);
    const [totals, setTotals] = useState({ books: 0, copies: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state || !state.reportType) {
            message.error("Không có dữ liệu báo cáo để hiển thị.");
            navigate(-1);
        }
    }, [state, navigate, message]);

    const fetchDataForPreview = useCallback(async () => {
        if (!state || !state.reportType) return;
        setLoading(true);
        try {
            let response;
            if (state.reportType === 'bookTitle') {
                response = await getBookTitleReportData();
                setRawData(response.data); // Lưu dữ liệu thô
                const processedData = groupDataByGenre(response.data);
                setGroupedData(processedData);

                let totalBooks = 0;
                let totalCopies = 0;
                processedData.forEach(group => {
                    totalBooks += group.totalBooks;
                    totalCopies += group.totalCopies;
                });
                setTotals({ books: totalBooks, copies: totalCopies });
            }

        } catch (error) {
            console.error(`Failed to fetch data for report type: ${state.reportType}`, error);
        } finally {
            setLoading(false);
        }
    }, [state]);

    useEffect(() => {
        fetchDataForPreview();
    }, [fetchDataForPreview]);

    const handleDownloadExcel = async () => {
        // Hàm này sẽ gọi API backend để tạo file Excel đã được format sẵn
        try {
            const response = await downloadBookTitleReport();
            downloadFile(response, 'BaoCao_DauSach.xlsx');
        } catch (error) {
            console.error(`Failed to download excel for report`, error);
        }
    };

    const handleDownloadPdf = () => {
        if (rawData.length === 0) return;
        downloadBookTitlePdf(rawData, user.username);
    };

    const handlePrintPdf = () => {
        if (rawData.length === 0) return;
        printBookTitlePdf(rawData, user.username);
    };

    if (!state) return null;
    const { title, backUrl } = state;

    return (
        <div>
            <div style={{ marginBottom: 16, padding: '16px 24px', background: '#fff', border: '1px solid #f0f0f0' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>{title || 'Xem trước Báo cáo'}</Title>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(backUrl || -1)}>Quay lại</Button>
                        <Button icon={<PrinterOutlined />} onClick={handlePrintPdf} disabled={loading || groupedData.length === 0} style={{ backgroundColor: '#673ab7', color: 'white' }}>In PDF</Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleDownloadPdf} disabled={loading || groupedData.length === 0} style={{ backgroundColor: '#f44336', color: 'white' }}>Tải PDF</Button>
                        <Button type="primary" icon={<FileExcelOutlined />} onClick={handleDownloadExcel} disabled={loading}>Tải Excel</Button>
                    </Space>
                </Space>
                <div style={{ marginTop: 20 }}>
                    <Text strong>Nhân viên lập báo cáo:</Text> {user?.hoTenDayDu} <br/>
                    <Text strong>Ngày in:</Text> {new Date().toLocaleString('vi-VN')}
                </div>
            </div>

            <Spin spinning={loading}>
                {groupedData.length > 0 ? (
                    <div className="report-table-container">
                        <table className="preview-table">
                            {/* --- HEADER CHÍNH CỦA BẢNG --- */}
                            <thead>
                            <tr>
                                <th style={{width: '5%'}}>STT</th>
                                <th style={{width: '15%'}}>ISBN</th>
                                <th style={{width: '25%'}}>Tên sách</th>
                                <th>Tác giả</th>
                                <th style={{width: '10%'}}>Ngôn ngữ</th>
                                <th style={{width: '10%'}}>Số cuốn</th>
                            </tr>
                            </thead>

                            {/* --- LẶP QUA TỪNG NHÓM THỂ LOẠI --- */}
                            {groupedData.map((group) => (
                                <tbody className="genre-group" key={group.genreName}>
                                {/* Dòng Header của Thể loại */}
                                <tr className="genre-header-row">
                                    <td colSpan="6">Thể loại : {group.genreName}</td>
                                </tr>

                                {/* Lặp qua các sách trong nhóm */}
                                {group.items.map((item, index) => (
                                    <tr key={item.codeBookTitle}>
                                        <td className="center">{index + 1}</td>
                                        <td>{item.codeBookTitle}</td>
                                        <td>{item.nameBook}</td>
                                        <td>{item.nameAuthor}</td>
                                        <td>{item.nameCodeLanguage}</td>
                                        <td className="right">{item.soCuonThucTe}</td>
                                    </tr>
                                ))}

                                {/* Dòng Tổng con của Thể loại */}
                                <tr className="subtotal-row">
                                    <td colSpan="5">Số đầu sách</td>
                                    <td className="right">{group.totalBooks}</td>
                                </tr>
                                </tbody>
                            ))}

                            {/* --- FOOTER CUỐI CÙNG CỦA BẢNG --- */}
                            <tfoot>
                            <tr className="grand-total-row">
                                <td colSpan="5">Số đầu sách thư viện</td>
                                <td className="right">{totals.books}</td>
                            </tr>
                            <tr className="grand-total-row">
                                <td colSpan="5">Số cuốn sách thư viện</td>
                                <td className="right">{totals.copies}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    !loading && <Empty description="Không có dữ liệu để tạo báo cáo." />
                )}
            </Spin>
        </div>
    );
};

export default ReportPreviewPage;