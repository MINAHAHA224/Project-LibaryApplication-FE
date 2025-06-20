// src/pages/BookTypePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Spin, Popconfirm, Input, App, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';
import { getBookTypes, createBookType, updateBookType, deleteBookType, undoBookTypeAction } from '../services/bookTypeService';
import BookTypeModal from '../components/bookType/BookTypeModal';

const { Search } = Input;
const { Title } = Typography; // Import Title

const BookTypePage = () => {
    const [bookTypes, setBookTypes] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [historyStack, setHistoryStack] = useState([]); // State cho Undo
    // === KHAI BÁO ĐỂ SỬ DỤNG TRONG COMPONENT NÀY ===
    const { message } = App.useApp();
    const DURATION = 3; // Hoặc 5 giây như bạn muốn

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getBookTypes();
            setBookTypes(res.data);
            setFilteredData(res.data);
        } catch (error) {
            // Bây giờ ta phải tự xử lý lỗi ở đây
            message.error( error.response.data.message || error.response.data.error ||"fetchData Không thể tải danh sách thể loại.", DURATION);

        }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const pushToHistory = (action) => {
        setHistoryStack(prev => [...prev, action]);
    };

    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase();
        const filtered = bookTypes.filter(item =>
            item.id.toLowerCase().includes(lowercasedValue) ||
            item.name.toLowerCase().includes(lowercasedValue)
        );
        setFilteredData(filtered);
    };


    const handleSave = async (values) => {
        try {
            if (editingData) {
                // Khi sửa, API cần cả id cũ và dữ liệu mới
                const response = await updateBookType(editingData.id, values);
                message.success('Cập nhật thành công!', DURATION);

                // Lưu cả dữ liệu cũ và mới vào history để undo
                pushToHistory({
                    actionType: 'UPDATE',
                    data: {
                        oldData: editingData, // Dữ liệu gốc trước khi mở modal
                        newData: response.data // Dữ liệu đã cập nhật thành công từ API
                    }
                });

            } else {
                const response = await createBookType(values);
                message.success('Thêm thành công!', DURATION);
                // Khi thêm, chỉ cần lưu id mới để có thể xóa khi undo
                pushToHistory({ actionType: 'ADD', data: { id: values.id } });
            }
            setIsModalVisible(false);
            fetchData(); // Tải lại dữ liệu
        } catch (error) {

            message.error( error.response.data.message || error.response.data.error ||"handleSave error:", DURATION);
        }
    };

    const handleDelete = async (recordToDelete) => {
        try {
            await deleteBookType(recordToDelete.id);
            message.success('Xóa thành công!', DURATION);
            pushToHistory({ actionType: 'DELETE', data: { originalData: recordToDelete } });
            fetchData();
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handleDelete error:", DURATION);


        }
    };

    const handleUndo = async () => {
        if (historyStack.length === 0) {
            message.info('Không có hành động nào để hoàn tác.', DURATION);
            return;
        }
        const lastAction = historyStack.pop();
        setLoading(true);
        try {
            await undoBookTypeAction(lastAction);
            message.success('Hoàn tác thành công!', DURATION);
            setHistoryStack([...historyStack]);
            fetchData();
        } catch (error) {
            historyStack.push(lastAction);
            message.error( error.response.data.message || error.response.data.error ||"handleUndo error:", DURATION);

        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Mã Thể Loại', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id.localeCompare(b.id) },
        { title: 'Tên Thể Loại', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        {
            title: 'Thao tác', key: 'action', align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => { setEditingData(record); setIsModalVisible(true); }} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        {/*<Popconfirm title={`Bạn chắc chắn muốn xóa thể loại "${record.name}"?`} onConfirm={() => handleDelete(record)}>*/}
                        {/*    <Button danger icon={<DeleteOutlined />}  />*/}
                        {/*</Popconfirm>*/}
                        <Button danger icon={<DeleteOutlined />} onClick={ () => handleDelete(record) } />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý Thể loại</Title>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingData(null); setIsModalVisible(true); }}>Thêm</Button>
                    <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>Phục hồi ({historyStack.length})</Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchData}>Tải lại</Button>
                    <Search placeholder="Tìm kiếm..." onSearch={handleSearch} style={{ width: 250 }} allowClear />
                </Space>
            </div>
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={filteredData} rowKey="id" bordered />
            </Spin>
            {isModalVisible && (
                <BookTypeModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleSave}
                    initialData={editingData}
                />
            )}
        </div>
    );
};
import { Typography } from 'antd'; // Import thêm
export default BookTypePage;