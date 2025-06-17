import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Typography, Space, App as AntdApp } from 'antd';
import { FileExcelOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { downloadFile } from '../utils/helpers';
import { getOverdueReportData, downloadOverdueReport } from '../services/rentalService';
import './ReportPreviewPage.css'; // Tái sử dụng CSS chung

const { Title, Text } = Typography;

const OverdueReportPreview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { message } = AntdApp.useApp();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getOverdueReportData();
            setData(response.data);
        } catch (error) { /* handled by interceptor */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDownloadExcel = async () => {
        setLoading(true);
        try {
            const response = await downloadOverdueReport();
            downloadFile(response, 'BaoCao_DocGiaQuaHan.xlsx');
        } catch (error) { /* handled */ }
        finally { setLoading(false); }
    };

    // Hàm helper để render các chuỗi đã gộp
    const renderGroupedCell = (text) => {
        if (!text) return null;
        return text.split(',').map((item, index) => (
            <div key={index}>{item.trim()}</div>
        ));
    };

    return (
        <div>
            <div className="report-toolbar">
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>Xem trước Báo cáo Độc giả Mượn sách Quá hạn</Title>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/rentals')}>Quay lại</Button>
                        <Button type="primary" icon={<FileExcelOutlined />} onClick={handleDownloadExcel} loading={loading}>Tải Excel</Button>
                    </Space>
                </Space>
            </div>

            <Spin spinning={loading}>
                <div className="report-preview-content">
                    <div className="report-header">
                        <Title level={2} style={{ textAlign: 'center' }}>DANH SÁCH ĐỘC GIẢ MƯỢN SÁCH QUÁ HẠN</Title>
                        <div className="report-meta-info">
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
                                    <th>Số CMND</th>
                                    <th>Họ Tên</th>
                                    <th>Mã sách</th>
                                    <th>Tên sách</th>
                                    <th>Ngày mượn</th>
                                    <th>Số ngày quá hạn</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr key={item.soCmnd + index}>
                                        <td className="center">{index + 1}</td>
                                        <td>{item.soCmnd}</td>
                                        <td>{`${item.hoDg} ${item.tenDg}`}</td>
                                        <td>{renderGroupedCell(item.maSachGop)}</td>
                                        <td>{renderGroupedCell(item.tenSachGop)}</td>
                                        <td className="center">{renderGroupedCell(item.ngayMuonGop)}</td>
                                        <td className="right">{renderGroupedCell(item.soNgayMuonQuaHanGop)}</td>
                                    </tr>
                                ))}
                                {/* Dòng tổng cuối cùng */}
                                <tr className="grand-total-row">
                                    <td colSpan="6">Tổng số độc giả quá hạn</td>
                                    <td className="right">{data.length}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !loading && <Empty description="Không có độc giả nào mượn sách quá hạn." style={{ marginTop: 50 }} />
                    )}
                </div>
            </Spin>
        </div>
    );
};

export default OverdueReportPreview;