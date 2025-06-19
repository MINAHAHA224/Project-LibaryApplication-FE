



import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Spin, Popconfirm, Tag, App ,Input, Typography } from 'antd';
import { PlusOutlined ,WarningOutlined ,FileExcelOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { getReaders, createReader, updateReader, deleteReader, undoReaderAction } from '../services/readerService';
import { formatDate } from '../utils/helpers';
import ReaderModal from '../components/reader/ReaderModal';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;
const ReaderPage = () => {
    const [readers, setReaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingReader, setEditingReader] = useState(null);
    const [historyStack, setHistoryStack] = useState([]);
    const { message: messageApi } = App.useApp();
    const DURATION = 3;
    const navigate = useNavigate();

    const [filteredReaders, setFilteredReaders] = useState([]); // State chứa dữ liệu đã lọc để hiển thị

    const fetchReaders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getReaders();
            setReaders(res.data);
            setFilteredReaders(res.data); // Ban đầu, dữ liệu hiển thị bằng dữ liệu gốc

        } catch (error) {
            // lỗi đã được xử lý ở component cha hoặc interceptor
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReaders();
    }, [fetchReaders]);

    const pushToHistory = (action) => {
        setHistoryStack(prev => [...prev, action]);
    };

    const handleAdd = () => {
        setEditingReader(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingReader(record);
        setIsModalVisible(true);
    };
    const handlePreviewReport = () => {
        // Không cần truyền state nữa vì trang đích đã biết phải làm gì
        navigate('/readers/report/preview');
    };
    // === HÀM TÌM KIẾM MỚI ===
    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredReaders(readers); // Nếu ô tìm kiếm trống, hiển thị lại toàn bộ
            return;
        }
        const filtered = readers.filter(item =>
            `${item.hodg} ${item.tendg}`.toLowerCase().includes(lowercasedValue) ||
            item.emaildg.toLowerCase().includes(lowercasedValue) ||
            item.socmnd.includes(lowercasedValue) ||
            item.dienthoai.includes(lowercasedValue)
        );
        setFilteredReaders(filtered);
    };

    const handleSave = async (values) => {
        setLoading(true);
        const formattedValues = {
            ...values,
            ngaysinh: values.ngaysinh?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
            ngaylamthe: values.ngaylamthe?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
            ngayhethan: values.ngayhethan?.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
        };
        try {
            if (editingReader) {
                const response = await updateReader(editingReader.madg, formattedValues);
                messageApi.success('Cập nhật độc giả thành công!', DURATION);
                pushToHistory({ actionType: 'UPDATE', data: { oldData: editingReader, newData: response.data } });
            } else {
                const response = await createReader(formattedValues);
                messageApi.success('Thêm độc giả thành công!', DURATION);
                pushToHistory({ actionType: 'ADD', data: { madg: response.data.madg } });
            }
            setIsModalVisible(false);
            fetchReaders();
        } catch (error) {
            // Lỗi đã được xử lý bởi interceptor hoặc ở component cha, không cần message.error ở đây.
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (readerId) => { // Đổi tên biến cho rõ ràng
        setLoading(true);
        try {
            // Tìm lại record đầy đủ trong state để lưu vào history
            const recordToDelete = readers.find(r => r.madg === readerId);
            if (!recordToDelete) {
                messageApi.error("Không tìm thấy độc giả để xóa.", DURATION);
                return;
            }

            await deleteReader(readerId); // Gọi API với ID đúng
            messageApi.success('Xóa độc giả thành công!', DURATION);

            pushToHistory({ actionType: 'DELETE', data: { originalData: recordToDelete } });

            fetchReaders();
        } catch (error) {
            console.error("Failed to delete reader:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = async () => {
        if (historyStack.length === 0) {
            messageApi.info('Không có hành động nào để hoàn tác.', DURATION);
            return;
        }
        const lastAction = historyStack.pop();
        setLoading(true);
        try {
            await undoReaderAction(lastAction);
            messageApi.success('Hoàn tác thành công!', DURATION);
            setHistoryStack([...historyStack]); // Cập nhật state để re-render
            fetchReaders();
        } catch (error) {
            // Lỗi đã được xử lý bởi interceptor hoặc ở component cha
        } finally {
            setLoading(false);
        }
    };
    const columns = [
        { title: 'Mã ĐG', dataIndex: 'madg', key: 'madg', sorter: (a, b) => a.madg - b.madg },
        { title: 'Họ Tên', key: 'hoTen', render: (_, record) => `${record.hodg} ${record.tendg}` },
        { title: 'Email', dataIndex: 'emaildg', key: 'emaildg' },
        { title: 'Giới Tính', dataIndex: 'gioitinh', key: 'gioitinh', render: (gt) => (gt ? 'Nam' : 'Nữ') },
        { title: 'Ngày Sinh', dataIndex: 'ngaysinh', key: 'ngaysinh', render: (text) => formatDate(text) },
        { title: 'Trạng Thái', dataIndex: 'hoatdong', key: 'hoatdong', render: (hd) => <Tag color={hd ? 'green' : 'red'}>{hd ? 'Hoạt động' : 'Khóa'}</Tag> },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title={`Bạn chắc chắn muốn xóa độc giả "${record.hodg} ${record.tendg}"?`}
                        onConfirm={() => handleDelete(record.madg)} // SỬA Ở ĐÂY: DÙNG record.madg
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý Độc giả</Title>
                <Space style={{ marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Độc giả</Button>
                    <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
                        Phục hồi ({historyStack.length})
                    </Button>
                    {/* === THANH TÌM KIẾM === */}

                    <Search
                        placeholder="Tìm theo Tên, Email, CMND, Số điện thoại..."
                        onSearch={handleSearch}
                        allowClear
                        enterButton
                    />
                    <Button icon={<FileExcelOutlined />} onClick={handlePreviewReport}>
                        Xuất Báo cáo
                    </Button>

                </Space>

            </div>


            <Spin spinning={loading}>
                <Table dataSource={filteredReaders} columns={columns} rowKey="madg" bordered />
            </Spin>
            {isModalVisible && (
                <ReaderModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleSave}
                    initialData={editingReader}
                />
            )}
        </div>
    );
};

export default ReaderPage;