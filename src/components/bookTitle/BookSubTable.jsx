// BookSubTable.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Spin, Popconfirm, Tag, App, Tooltip, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { getBooksByIsbn, getDrawers, createBook, updateBook, deleteBook, undoBookAction } from '../../services/bookService';
import { getPublicBooksByIsbn } from '../../services/publicService';
import BookModal from './BookModal';

const { Search } = Input;

const BookSubTable = ({ isbn, isGuest = false }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [drawers, setDrawers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [historyStack, setHistoryStack] = useState([]);
    const { message } = App.useApp();
    const DURATION = 3;

    const fetchBooksAndDrawers = useCallback(async () => {
        if (!isbn) return;
        setLoading(true);
        try {
            // Dựa vào isGuest để gọi đúng API
            const booksPromise = isGuest ? getPublicBooksByIsbn(isbn) : getBooksByIsbn(isbn);
            // API getDrawers không cần token nên có thể dùng chung
            const [booksRes, drawersRes] = await Promise.all([booksPromise, getDrawers()]);

            const booksWithKeys = booksRes.data.map(b => ({ ...b, key: b.maSach }));
            setBooks(booksWithKeys);
            setFilteredBooks(booksWithKeys);
            setDrawers(drawersRes.data);
        } catch (error) {
            console.error("Error fetching sub-table data:", error);
            message.error( error.response.data.message || error.response.data.error ||"fetchBooksAndDrawers error:", DURATION);
        } finally {
            setLoading(false);
        }
    }, [isbn, isGuest]);

    useEffect(() => {
        fetchBooksAndDrawers();
    }, [fetchBooksAndDrawers]);

    const handleSearchBooks = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredBooks(books);
            return;
        }
        const filtered = books.filter(book => {
            const drawerName = drawers.find(d => d.maNganTu === book.maNganTu)?.tenNganTu || '';
            return (
                book.maSach.toLowerCase().includes(lowercasedValue) ||
                drawerName.toLowerCase().includes(lowercasedValue)
            );
        });
        setFilteredBooks(filtered);
    };

    // --- Các hàm chỉ dành cho Thủ thư ---
    const pushToHistory = (action) => setHistoryStack(p => [...p, action]);
    const handleAdd = () => { setEditingBook(null); setIsModalVisible(true); };
    const handleEdit = (record) => { setEditingBook(record); setIsModalVisible(true); };



    const handleSave = async (values) => {
        setLoading(true);
        try {
            if (editingBook) { // Sửa
                const response = await updateBook(isbn, editingBook.maSach, values);
                message.success("Cập nhật sách thành công!", DURATION);
                pushToHistory({ actionType: 'UPDATE', data: { oldData: editingBook, newData: response.data, isbn } });
            } else { // Thêm
                const response = await createBook(isbn, values);
                message.success("Thêm sách thành công!", DURATION);
                pushToHistory({ actionType: 'ADD', data: { isbn: isbn, maSach: response.data.maSach } });
            }
            setIsModalVisible(false);
            fetchBooksAndDrawers();
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handling save error:", DURATION);
            console.error("Error handling save:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record) => {
        setLoading(true);
        try {
            await deleteBook(isbn, record.maSach);
            message.success("Xóa sách thành công!", DURATION);
            pushToHistory({ actionType: 'DELETE', data: { originalData: record, isbn: isbn } });
            fetchBooksAndDrawers();
        } catch (error) {
            console.error("Error handling delete:", error);
            message.error( error.response.data.message || error.response.data.error ||"handleDelete error:", DURATION);
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = async () => {
        if (historyStack.length === 0) return;
        const lastAction = historyStack.pop();
        setLoading(true);
        try {
            await undoBookAction(lastAction);
            message.success("Hoàn tác thành công!", DURATION);
            setHistoryStack([...historyStack]);
            fetchBooksAndDrawers();
        } catch (error) {
            historyStack.push(lastAction);
            console.error("Error handling undo:", error);
            message.error( error.response.data.message || error.response.data.error ||"handleUndo error:", DURATION);

        } finally {
            setLoading(false);
        }
    };
    // --- Kết thúc các hàm chỉ dành cho Thủ thư ---

    // === ĐỊNH NGHĨA CỘT ===
    const baseColumns = [
        { title: 'Mã Sách', dataIndex: 'maSach', key: 'maSach', sorter: (a, b) => a.maSach.localeCompare(b.maSach) },
        { title: 'Tình Trạng', dataIndex: 'tinhTrang', key: 'tinhTrang', render: (isOk) => <Tag color={isOk ? 'green' : 'volcano'}>{isOk ? 'Tốt' : 'Hỏng'}</Tag> },
        { title: 'Cho Mượn', dataIndex: 'choMuon', key: 'choMuon', render: (isRented) => <Tag color={isRented ? 'red' : 'geekblue'}>{isRented ? 'Đã mượn' : 'Trong kho'}</Tag> },
        // === CỘT MỚI ĐƯỢC THÊM VÀO ===
        {
            title: 'Loại Sách',
            dataIndex: 'laSachGoc', // Phải khớp với tên trường trong DTO
            key: 'laSachGoc',
            render: (isOriginal) => isOriginal ? <Tag color="purple">Sách Gốc</Tag> : <Tag color="default">Bản sao</Tag>
        },
        { title: 'Ngăn Tủ', dataIndex: 'maNganTu', key: 'maNganTu', render: (maNganTu) => drawers.find(d => d.maNganTu === maNganTu)?.tenNganTu || 'N/A' },
    ];

    const actionColumn = {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
            <Space>
                <Tooltip title="Sửa"><Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
                <Tooltip title="Xóa">
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record)}>
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Tooltip>
            </Space>
        ),
    };

    // Nếu không phải là guest, thêm cột Thao tác vào
    const columns = isGuest ? baseColumns : [...baseColumns, actionColumn];

    return (
        <Spin spinning={loading}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    {/* Chỉ hiển thị các nút chức năng nếu không phải là guest */}
                    {!isGuest && (
                        <>
                            <Button onClick={handleAdd} type="primary" icon={<PlusOutlined />}>Thêm Sách Con</Button>
                            <Button onClick={handleUndo} icon={<UndoOutlined />} disabled={historyStack.length === 0}>Phục hồi Sách ({historyStack.length})</Button>
                        </>
                    )}
                </Space>
                <Search
                    placeholder="Tìm mã sách, ngăn tủ..."
                    onSearch={handleSearchBooks}
                    style={{ width: 250 }}
                    allowClear
                />
            </div>
            <Table
                bordered
                dataSource={filteredBooks}
                columns={columns}
                rowKey="maSach"
                size="small"
            />
            {!isGuest && isModalVisible && (
                <BookModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleSave}
                    initialData={editingBook}
                    drawers={drawers}
                />
            )}
        </Spin>
    );
};

export default BookSubTable;