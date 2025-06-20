import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Spin, Popconfirm, Input, App, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor, undoAuthorAction } from '../services/authorService';
import AuthorModal from '../components/author/AuthorModal';

const { Search } = Input;
const { Title } = Typography;

const AuthorPage = () => {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [historyStack, setHistoryStack] = useState([]);
    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION

    const fetchAuthors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAuthors();
            setAuthors(res.data);
            setFilteredAuthors(res.data);
        } catch (error) {
            console.error("fetchAuthors error:", error);
            message.error( error.response.data.message || error.response.data.error ||"fetchAuthors error:", DURATION);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

    const pushToHistory = (action) => {
        setHistoryStack(prev => [...prev, action]);
    };

    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredAuthors(authors);
            return;
        }
        const filtered = authors.filter(item =>
            item.hoTenTg.toLowerCase().includes(lowercasedValue) ||
            item.diaChiTg.toLowerCase().includes(lowercasedValue) ||
            item.dienThoaiTg.includes(lowercasedValue)
        );
        setFilteredAuthors(filtered);
    };

    const handleAdd = () => {
        setEditingAuthor(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingAuthor(record);
        setIsModalVisible(true);
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            if (editingAuthor) {
                const response = await updateAuthor(editingAuthor.maTacGia, values);
                message.success('Cập nhật tác giả thành công!', DURATION);
                pushToHistory({ actionType: 'UPDATE', data: { oldData: editingAuthor, newData: response.data } });
            } else {
                const response = await createAuthor(values);
                message.success('Thêm tác giả thành công!', DURATION);
                pushToHistory({ actionType: 'ADD', data: { maTacGia: response.data.maTacGia } });
            }
            setIsModalVisible(false);
            fetchAuthors();
        } catch (error) {
            console.error("handleSave error:", error);
            message.error( error.response.data.message || error.response.data.error ||"handleSave error:", DURATION);

        }
        finally { setLoading(false); }
    };

    const handleDelete = async (recordToDelete) => {
        setLoading(true);
        try {
            await deleteAuthor(recordToDelete.maTacGia);
            message.success('Xóa tác giả thành công!', DURATION);
            pushToHistory({ actionType: 'DELETE', data: { originalData: recordToDelete } });
            fetchAuthors();
        } catch (error) {
            console.error("handleDelete error:", error);
            message.error( error.response.data.message || error.response.data.error ||"handleDelete error:", DURATION);
        }
        finally { setLoading(false); }
    };

    const handleUndo = async () => {
        if (historyStack.length === 0) return;
        const lastAction = historyStack.pop();
        setLoading(true);
        try {
            await undoAuthorAction(lastAction);
            message.success('Hoàn tác thành công!', DURATION);
            setHistoryStack([...historyStack]);
            fetchAuthors();
        } catch (error) {
            historyStack.push(lastAction); // Trả lại nếu lỗi
            console.error("handleUndo error:", error);
            message.error( error.response.data.message || error.response.data.error ||"handleUndo error:", DURATION);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Mã Tác Giả', dataIndex: 'maTacGia', key: 'maTacGia', sorter: (a, b) => a.maTacGia - b.maTacGia },
        { title: 'Họ Tên', dataIndex: 'hoTenTg', key: 'hoTenTg', sorter: (a, b) => a.hoTenTg.localeCompare(b.hoTenTg) },
        { title: 'Địa chỉ', dataIndex: 'diaChiTg', key: 'diaChiTg' },
        { title: 'Điện thoại', dataIndex: 'dienThoaiTg', key: 'dienThoaiTg' },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa"><Button icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm title={`Bạn chắc chắn muốn xóa tác giả "${record.hoTenTg}"?`} onConfirm={() => handleDelete(record)}>
                            <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý Tác giả</Title>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm</Button>
                    <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>Phục hồi ({historyStack.length})</Button>
                    <Search
                        placeholder="Tìm theo tên, địa chỉ, điện thoại..."
                        onSearch={handleSearch}
                        allowClear
                        enterButton
                    />
                </Space>
            </div>

            <Spin spinning={loading}>
                <Table columns={columns} dataSource={filteredAuthors} rowKey="maTacGia" bordered />
            </Spin>
            {isModalVisible && (
                <AuthorModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleSave}
                    initialData={editingAuthor}
                />
            )}
        </div>
    );
};

export default AuthorPage;