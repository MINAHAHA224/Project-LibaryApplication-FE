



import React, { useState, useEffect, useCallback } from 'react';
import {
    Row, Col, List, Table, Button, Checkbox, Radio, Space,
    Spin, Popconfirm, Tooltip, Empty, App, Modal, Typography, DatePicker
} from 'antd';
import { CloudUploadOutlined, RetweetOutlined } from '@ant-design/icons';
import { getDatabases, getBackupHistory, backupDatabase, restoreDatabase } from '../services/backupService';
const { Title, Text } = Typography; // Có thể giữ lại Title vì nó không bị trùng tên

const BackupPage = () => {
    const [databases, setDatabases] = useState([]);
    const [selectedDb, setSelectedDb] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedBackupPosition, setSelectedBackupPosition] = useState(null);
    const [overwrite, setOverwrite] = useState(false);
    const [loading, setLoading] = useState({ dbs: true, history: false });
    const { message , modal} = App.useApp();
    const DURATION = 3;

    const [isPitr, setIsPitr] = useState(false); // State cho checkbox PITR
    const [restoreDateTime, setRestoreDateTime] = useState(null); // State cho ngày giờ

    const fetchDatabases = useCallback(async () => {
        setLoading(p => ({ ...p, dbs: true }));
        try {
            const res = await getDatabases();
            setDatabases(res.data);
            if (res.data.length > 0) {
                setSelectedDb(res.data[0].name);
            }
        } catch (error) {
            console.error("fetchDatabases error:", error);
        } finally {
            setLoading(p => ({ ...p, dbs: false }));
        }
    }, []);

    const fetchHistory = useCallback(async (dbName) => {
        if (!dbName) return;
        setLoading(p => ({ ...p, history: true }));
        setSelectedBackupPosition(null); // Reset lựa chọn khi đổi DB
        setHistory([]);
        try {
            const res = await getBackupHistory(dbName);
            setHistory(res.data);
        } catch (error) {
            console.error(`fetchHistory for ${dbName} error:`, error);
        } finally {
            setLoading(p => ({ ...p, history: false }));
        }
    }, []);

    useEffect(() => {
        fetchDatabases();
    }, [fetchDatabases]);

    useEffect(() => {
        fetchHistory(selectedDb);
    }, [selectedDb, fetchHistory]);

    const handleBackup = async () => {
        if (!selectedDb) {
            message.warning('Vui lòng chọn một cơ sở dữ liệu để sao lưu.', DURATION);
            return;
        }
        setLoading(p => ({ ...p, history: true }));
        try {
            await backupDatabase({ dbName: selectedDb, overwrite });
            message.success(`Sao lưu ${selectedDb} thành công!`, DURATION);
            fetchHistory(selectedDb);
        } catch (error) {
            console.error("handleBackup error:", error);
        } finally {
            setLoading(p => ({ ...p, history: false }));
        }
    };

    const handleRestore = () => {
        if (!selectedBackupPosition) {
            message.warning('Vui lòng chọn một bản sao lưu để phục hồi.', DURATION);
            return;
        }
        // Kiểm tra điều kiện cho PITR
        if (isPitr && !restoreDateTime) {
            message.warning('Vui lòng chọn ngày giờ để phục hồi tới thời điểm đó.', DURATION);
            return;
        }

        modal.confirm({ // Sử dụng modal instance từ App.useApp()
            title: 'Bạn chắc chắn muốn phục hồi?',
            content: `Hành động này sẽ khôi phục CSDL '${selectedDb}' về bản sao lưu số ${selectedBackupPosition}. Mọi dữ liệu hiện tại sẽ bị mất và ứng dụng sẽ được tải lại.`,
            okText: 'Chắc chắn Phục hồi',
            cancelText: 'Hủy',
            // onOk sẽ trả về một Promise, nút OK sẽ tự có loading
            // onOk: async () => {
            //     const payload = {
            //         dbName: selectedDb,
            //         backupFileNumber: selectedBackupPosition,
            //         pitr: isPitr,
            //         // Format lại ngày giờ để Backend có thể parse
            //         restoreDateTime: isPitr ? restoreDateTime.format('YYYY-MM-DDTHH:mm:ss') : null,
            //     };
            //
            //     try {
            //         await restoreDatabase(payload);
            //
            //         // Nếu thành công, đóng modal confirm và mở modal success
            //         modal.success({
            //             title: 'Phục hồi thành công!',
            //             content: 'Cơ sở dữ liệu đã được phục hồi. Hệ thống sẽ tự động tải lại ngay bây giờ.',
            //             okText: 'Tải lại',
            //             onOk: () => window.location.reload(),
            //             afterClose: () => window.location.reload(), // Đề phòng user không nhấn OK
            //         });
            //
            //     } catch (error) {
            //         console.error("Restore failed", error);
            //         // Lỗi đã được interceptor xử lý và hiển thị toast
            //         // Chỉ cần ném lỗi ra để modal confirm biết là đã thất bại
            //         // và không tự đóng lại.
            //         throw error;
            //     }
            // },
            onOk: async () => {
                const payload = {
                    dbName: selectedDb,
                    backupFileNumber: selectedBackupPosition,
                    pitr: isPitr,
                    // Format lại ngày giờ để Backend có thể parse
                    restoreDateTime: isPitr ? restoreDateTime.format('YYYY-MM-DDTHH:mm:ss') : null,
                };
                const restoreLoadingKey = 'restoreLoading';
                message.loading({ content: 'Đang phục hồi, vui lòng không đóng trang...', key: restoreLoadingKey, duration: 0 });
                try {
                    await restoreDatabase(payload);
                    message.destroy(restoreLoadingKey);

                    // Nếu thành công, đóng modal confirm và mở modal success
                    modal.success({
                        title: 'Phục hồi thành công!',
                        content: 'Cơ sở dữ liệu đã được phục hồi. Hệ thống sẽ tự động tải lại ngay bây giờ.',
                        okText: 'Tải lại',
                        duration: 10  // Đề phòng user không nhấn OK
                    });
                    // Đặt một bộ đếm thời gian để tự động reload trang sau một khoảng thời gian dài (ví dụ: 15 giây)
                    // để chờ server khởi động lại.
                    setTimeout(() => {
                        window.location.reload();
                    }, 15000);

                } catch (error) {
                    message.destroy(restoreLoadingKey);
                }
            },
        });
    };


    const columns = [
        { title: 'Bản sao lưu thứ #', dataIndex: 'position', key: 'position', width: '15%' },
        { title: 'Diễn giải', dataIndex: 'description', key: 'description' },
        { title: 'Ngày giờ sao lưu', dataIndex: 'date', key: 'date', render: (text) => text ? new Date(text).toLocaleString('vi-VN') : '' },
        { title: 'User', dataIndex: 'user', key: 'user' },
        {
            title: 'Chọn để Phục hồi',
            key: 'select',
            align: 'center',
            render: (_, record) => (
                <Radio
                    checked={selectedBackupPosition === record.position}
                    onChange={() => setSelectedBackupPosition(record.position)}
                />
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Sao lưu & Phục hồi Cơ sở dữ liệu</Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={8} md={6}>
                    <h3>Cơ sở dữ liệu</h3>
                    <Spin spinning={loading.dbs}>
                        <List
                            bordered
                            dataSource={databases}
                            renderItem={(item) => (
                                <List.Item
                                    onClick={() => setSelectedDb(item.name)}
                                    className={selectedDb === item.name ? 'db-list-item-active' : 'db-list-item'}
                                >
                                    {item.name}
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Col>
                <Col xs={24} sm={16} md={18}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space wrap>
                            <Popconfirm title={`Bạn chắc chắn muốn sao lưu CSDL "${selectedDb}"?`} onConfirm={handleBackup} okText="Đồng ý" cancelText="Hủy">
                                <Button type="primary" icon={<CloudUploadOutlined />}>Sao lưu</Button>
                            </Popconfirm>

                            <Button type="primary" danger icon={<RetweetOutlined />}
                                    disabled={!selectedBackupPosition} onClick={handleRestore}>
                                Phục hồi
                            </Button>

                            <Checkbox checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)}>
                                Xóa các bản sao lưu cũ trước khi sao lưu
                            </Checkbox>

                            <Checkbox checked={isPitr} onChange={(e) => setIsPitr(e.target.checked)}>
                                Phục hồi tới một thời điểm (Point-in-Time)
                            </Checkbox>
                        </Space>

                        {/* Ô chọn ngày giờ chỉ hiện khi tick vào checkbox */}
                        {isPitr && (
                            <Space direction="vertical" style={{ marginTop: 10, padding: 10, border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                                <Text>Chọn thời điểm phục hồi:</Text>
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm:ss"
                                    onChange={(value) => setRestoreDateTime(value)}
                                    style={{ width: '100%' }}
                                />
                                <Text type="secondary" style={{fontSize: '12px'}}>Lưu ý: Thời điểm này phải sau thời điểm của bản sao lưu FULL đã chọn.</Text>
                            </Space>
                        )}
                        <h3>
                            Lịch sử sao lưu của: <span style={{ color: '#1890ff' }}>{selectedDb}</span>
                        </h3>
                        <Spin spinning={loading.history}>
                            <Table
                                columns={columns}
                                dataSource={history}
                                rowKey="id"
                                bordered
                                locale={{ emptyText: <Empty description="Chưa có bản sao lưu nào." /> }}
                            />
                        </Spin>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default BackupPage;