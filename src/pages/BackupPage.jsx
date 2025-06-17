import React, { useState, useEffect } from 'react';
import { Row, Col, List, Table, Button, Checkbox, Radio, Space, message, Spin, Popconfirm, Tooltip, Empty } from 'antd';
import { CloudUploadOutlined, RetweetOutlined } from '@ant-design/icons';
import { getDatabases, getBackupHistory, backupDatabase, restoreDatabase } from '../services/backupService';

const BackupPage = () => {
    const [databases, setDatabases] = useState([]);
    const [selectedDb, setSelectedDb] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedBackupId, setSelectedBackupId] = useState(null);
    const [overwrite, setOverwrite] = useState(false);
    const [loading, setLoading] = useState({ dbs: true, history: false });

    useEffect(() => {
        fetchDatabases();
    }, []);

    useEffect(() => {
        if (selectedDb) {
            fetchHistory(selectedDb);
        }
    }, [selectedDb]);

    const fetchDatabases = async () => {
        setLoading(p => ({ ...p, dbs: true }));
        try {
            const res = await getDatabases();
            setDatabases(res.data);
            if (res.data.length > 0) {
                setSelectedDb(res.data[0].name);
            }
        } catch (error) {
            message.error('Không thể tải danh sách cơ sở dữ liệu.');
        } finally {
            setLoading(p => ({ ...p, dbs: false }));
        }
    };

    const fetchHistory = async (dbName) => {
        setLoading(p => ({ ...p, history: true }));
        setHistory([]);
        try {
            const res = await getBackupHistory(dbName);
            setHistory(res.data);
        } catch (error) {
            message.error(`Không thể tải lịch sử sao lưu cho ${dbName}.`);
        } finally {
            setLoading(p => ({ ...p, history: false }));
        }
    };

    const handleBackup = async () => {
        if (!selectedDb) {
            message.warning('Vui lòng chọn một cơ sở dữ liệu để sao lưu.');
            return;
        }
        setLoading(p => ({ ...p, history: true }));
        try {
            await backupDatabase({ dbName: selectedDb, overwrite });
            message.success(`Sao lưu ${selectedDb} thành công!`);
            fetchHistory(selectedDb); // Refresh history
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Lỗi khi sao lưu.';
            message.error(errorMessage);
        } finally {
            setLoading(p => ({ ...p, history: false }));
        }
    };

    const handleRestore = async () => {
        if (!selectedBackupId) {
            message.warning('Vui lòng chọn một bản sao lưu để phục hồi.');
            return;
        }
        setLoading(p => ({ ...p, history: true }));
        try {
            await restoreDatabase({ dbName: selectedDb, backupId: selectedBackupId });
            message.success(`${selectedDb} đã được phục hồi thành công!`);
            message.info('Dữ liệu đã thay đổi, một số chức năng có thể cần tải lại trang.');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Lỗi khi phục hồi.';
            message.error(errorMessage);
        } finally {
            setLoading(p => ({ ...p, history: false }));
        }
    };

    const columns = [
        { title: '#', dataIndex: 'id', key: 'id' },
        { title: 'Diễn giải', dataIndex: 'description', key: 'description' },
        { title: 'Ngày giờ sao lưu', dataIndex: 'date', key: 'date', render: (text) => new Date(text).toLocaleString('vi-VN')},
        { title: 'User', dataIndex: 'user', key: 'user' },
        {
            title: 'Chọn',
            key: 'select',
            render: (_, record) => (
                <Radio
                    checked={selectedBackupId === record.id}
                    onChange={() => setSelectedBackupId(record.id)}
                />
            ),
        },
    ];

    return (
        <div>
            <h1>Sao lưu & Phục hồi Cơ sở dữ liệu</h1>
            <Row gutter={[16, 16]}>
                <Col span={6}>
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
                <Col span={18}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                            <Popconfirm title={`Bạn chắc chắn muốn sao lưu CSDL "${selectedDb}"?`} onConfirm={handleBackup} okText="Đồng ý" cancelText="Hủy">
                                <Button type="primary" icon={<CloudUploadOutlined />}>Sao lưu</Button>
                            </Popconfirm>
                            <Popconfirm title={`Hành động này sẽ khôi phục CSDL "${selectedDb}" về thời điểm đã chọn. Dữ liệu hiện tại sẽ bị mất. Bạn chắc chắn?`} onConfirm={handleRestore} okText="Chắc chắn phục hồi" cancelText="Hủy">
                                <Button type="primary" danger icon={<RetweetOutlined />} disabled={!selectedBackupId}>Phục hồi</Button>
                            </Popconfirm>
                            <Checkbox checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)}>
                                Xóa các bản sao lưu cũ trước khi sao lưu
                            </Checkbox>
                        </Space>
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