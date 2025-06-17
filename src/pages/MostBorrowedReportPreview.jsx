import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Spin, Empty, Typography, Space, App as AntdApp } from 'antd';
import { FileExcelOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { downloadFile } from '../utils/helpers';
import { getMostBorrowedReportData, downloadMostBorrowedReport } from '../services/rentalService';
import './ReportPreviewPage.css';

const { Title, Text } = Typography;

const MostBorrowedReportPreview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { message } = AntdApp.useApp();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const tuNgay = searchParams.get('tuNgay');
    const denNgay = searchParams.get('denNgay');

    const fetchData = useCallback(async () => {
        if (!tuNgay || !denNgay) {
            message.error("Thiếu thông tin ngày để tạo báo cáo.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await getMostBorrowedReportData(tuNgay, denNgay);
            setData(response.data);
        } catch (error) { /* handled */ }
        finally { setLoading(false); }
    }, [tuNgay, denNgay, message]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDownloadExcel = async () => {
        setLoading(true);
        try {
            const response = await downloadMostBorrowedReport(tuNgay, denNgay);
            downloadFile(response, `BaoCao_SachMuonNhieu_${tuNgay}_${denNgay}.xlsx`);
        } catch (error) { /* handled */ }
        finally { setLoading(false); }
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    return (
        <div>
            <div className="report-toolbar">
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>Xem trước: Đầu sách Mượn nhiều</Title>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rentals')}>Quay lại</Button>
                        <Button type="primary" icon={<FileExcelOutlined />} onClick={handleDownloadExcel} loading={loading}>Tải Excel</Button>
                    </Space>
                </Space>
            </div>

            <Spin spinning={loading}>
                <div className="report-preview-content">
                    <div className="report-header">
                        <Title level={2} style={{ textAlign: 'center' }}>DANH MỤC ĐẦU SÁCH ĐƯỢC MƯỢN NHIỀU</Title>
                        <div className="report-meta-info">
                            <Text strong>Từ ngày:</Text> {formatDateForDisplay(tuNgay)}     <Text strong>Đến ngày:</Text> {formatDateForDisplay(denNgay)}<br />
                            <Text strong>Nhân viên lập báo cáo:</Text> {user?.username} <br />
                            <Text strong>Ngày in:</Text> {new Date().toLocaleString('vi-VN')}
                        </div>
                    </div>

                    {data.length > 0 ? (
                        <div className="report-table-container">
                            <table className="preview-table">
                                <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>ISBN</th>
                                    <th>Tên sách</th>
                                    <th>Tác giả</th>
                                    <th>Thể loại</th>
                                    <th>Số lượt mượn</th>
                                    <th>Ghi chú</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr key={item.isbn}>
                                        <td className="center">{index + 1}</td>
                                        <td>{item.isbn}</td>
                                        <td>{item.tenSach}</td>
                                        <td>{item.tacGia}</td>
                                        <td>{item.theLoai}</td>
                                        <td className="right">{item.soLuotMuon}</td>
                                        <td>{item.ghiChu}</td>
                                    </tr>
                                ))}
                                <tr className="grand-total-row">
                                    <td colSpan="6">Tổng số đầu sách</td>
                                    <td className="right">{data.length}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !loading && <Empty description="Không có dữ liệu trong khoảng thời gian đã chọn." style={{ marginTop: 50 }} />
                    )}
                </div>
            </Spin>
        </div>
    );
};

export default MostBorrowedReportPreview;