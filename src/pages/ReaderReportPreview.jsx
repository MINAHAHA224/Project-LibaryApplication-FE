// src/pages/ReaderReportPreview.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Typography, Space, App as AntdApp } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { downloadFile } from '../utils/helpers';
import { getReaders, downloadReadersReport } from '../services/readerService';
import './ReportPreviewPage.css'; // Tái sử dụng CSS chung
import { formatDate } from '../utils/helpers';

const { Title, Text } = Typography;

const ReaderReportPreview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { message } = AntdApp.useApp();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getReaders();
            setData(response.data);
        } catch (error) {
            // Lỗi đã được xử lý bởi interceptor
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDownloadExcel = async () => {
        setLoading(true);
        try {
            const response = await downloadReadersReport();
            downloadFile(response, 'BaoCao_DocGia.xlsx');
        } catch (error) {
            // Lỗi đã được xử lý
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <div className="report-toolbar">
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ margin: 0 }}>Xem trước Báo cáo Độc giả</Title>
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/readers')}>Quay lại</Button>

                        <Button type="primary" icon={<FileExcelOutlined />} onClick={handleDownloadExcel} loading={loading}>Tải Excel</Button>
                    </Space>
                </Space>
            </div>

            <Spin spinning={loading}>
                <div className="report-preview-content">
                    <div className="report-header">
                        <Title level={2} style={{ textAlign: 'center', margin: 0 }}>DANH SÁCH ĐỘC GIẢ</Title>
                        <div className="report-meta-info" style={{ marginTop: 20 }}>
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
                                    <th>Họ tên</th>
                                    <th>Số CMND</th>
                                    <th>Phái</th>
                                    <th>Địa chỉ</th>
                                    <th>Số ĐT</th>
                                    <th>Ngày làm thẻ</th>
                                    <th>Trạng thái</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((reader, index) => (
                                    <tr key={reader.madg}>
                                        <td className="center">{index + 1}</td>
                                        <td>{`${reader.hodg} ${reader.tendg}`}</td>
                                        <td>{reader.socmnd}</td>
                                        <td>{reader.gioitinh === 1 ? 'Nam' : 'Nữ'}</td>
                                        <td>{reader.diachi}</td>
                                        <td>{reader.dienthoai}</td>
                                        <td className="center">{formatDate(reader.ngaylamthe)}</td>
                                        <td className="center">{reader.hoatdong === 1 ? 'Hoạt động' : 'Bị Khóa'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        !loading && <Empty description="Không có dữ liệu để tạo báo cáo." style={{ marginTop: 50 }} />
                    )}
                </div>
            </Spin>
        </div>
    );
};

export default ReaderReportPreview;