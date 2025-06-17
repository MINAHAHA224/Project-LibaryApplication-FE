// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Button, Space, message, Spin, Popconfirm, Tag, App, Tooltip } from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// import { getBooksByIsbn, getDrawers, createBook, updateBook, deleteBook, undoBookAction } from '../../services/bookService';
// import BookModal from './BookModal'; // Import modal mới
//
// const BookSubTable = ({ isbn }) => {
//     const [books, setBooks] = useState([]);
//     const [drawers, setDrawers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingBook, setEditingBook] = useState(null);
//     const [historyStack, setHistoryStack] = useState([]);
//     const { message: messageApi } = App.useApp();
//     const DURATION = 3;
//
//     const fetchBooksAndDrawers = useCallback(async () => {
//         if (!isbn) return;
//         setLoading(true);
//         try {
//             const [booksRes, drawersRes] = await Promise.all([getBooksByIsbn(isbn), getDrawers()]);
//             setBooks(booksRes.data);
//             setDrawers(drawersRes.data);
//         } catch (error) {
//             // Lỗi đã được xử lý bởi interceptor
//         } finally {
//             setLoading(false);
//         }
//     }, [isbn]);
//
//     useEffect(() => {
//         fetchBooksAndDrawers();
//     }, [fetchBooksAndDrawers]);
//
//     const pushToHistory = (action) => setHistoryStack(p => [...p, action]);
//
//     const handleAdd = () => {
//         setEditingBook(null);
//         setIsModalVisible(true);
//     };
//
//     const handleEdit = (record) => {
//         setEditingBook(record);
//         setIsModalVisible(true);
//     };
//
//     const handleSave = async (values) => {
//         setLoading(true);
//         try {
//             if (editingBook) { // Sửa
//                 const response = await updateBook(isbn, editingBook.maSach, values);
//                 messageApi.success("Cập nhật sách thành công!", DURATION);
//                 pushToHistory({ actionType: 'UPDATE', data: { oldData: editingBook, newData: response.data, isbn } });
//             } else { // Thêm
//                 const response = await createBook(isbn, values);
//                 messageApi.success("Thêm sách thành công!", DURATION);
//                 pushToHistory({ actionType: 'ADD', data: { isbn: isbn, maSach: response.data.maSach } });
//             }
//             setIsModalVisible(false);
//             fetchBooksAndDrawers();
//         } catch (error) {
//             // Lỗi đã được xử lý
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleDelete = async (record) => {
//         setLoading(true);
//         try {
//             await deleteBook(isbn, record.maSach);
//             messageApi.success("Xóa sách thành công!", DURATION);
//             pushToHistory({ actionType: 'DELETE', data: { originalData: record, isbn: isbn } });
//             fetchBooksAndDrawers();
//         } catch (error) {
//             // Lỗi đã được xử lý
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleUndo = async () => {
//         if (historyStack.length === 0) return;
//         const lastAction = historyStack.pop();
//         setLoading(true);
//         try {
//             await undoBookAction(lastAction);
//             messageApi.success("Hoàn tác thành công!", DURATION);
//             setHistoryStack([...historyStack]);
//             fetchBooksAndDrawers();
//         } catch (error) {
//             historyStack.push(lastAction);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const columns = [
//         { title: 'Mã Sách', dataIndex: 'maSach', key: 'maSach', sorter: (a, b) => a.maSach.localeCompare(b.maSach) },
//         { title: 'Tình Trạng', dataIndex: 'tinhTrang', key: 'tinhTrang', render: (isOk) => <Tag color={isOk ? 'green' : 'volcano'}>{isOk ? 'Tốt' : 'Hỏng'}</Tag> },
//         { title: 'Cho Mượn', dataIndex: 'choMuon', key: 'choMuon', render: (isRented) => <Tag color={isRented ? 'red' : 'geekblue'}>{isRented ? 'Đã mượn' : 'Trong kho'}</Tag> },
//         { title: 'Ngăn Tủ', dataIndex: 'maNganTu', key: 'maNganTu', render: (maNganTu) => drawers.find(d => d.maNganTu === maNganTu)?.tenNganTu || 'N/A' },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             render: (_, record) => (
//                 <Space>
//                     <Tooltip title="Sửa">
//                         <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//                     </Tooltip>
//                     <Tooltip title="Xóa">
//                         <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record)}>
//                             <Button type="link" danger icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                     </Tooltip>
//                 </Space>
//             ),
//         },
//     ];
//
//     return (
//         <Spin spinning={loading}>
//             <Space style={{ marginBottom: 16 }}>
//                 <Button onClick={handleAdd} type="primary" icon={<PlusOutlined />}>Thêm Sách Con</Button>
//                 <Button onClick={handleUndo} icon={<UndoOutlined />} disabled={historyStack.length === 0}>Phục hồi Sách ({historyStack.length})</Button>
//             </Space>
//             <Table
//                 bordered
//                 dataSource={books}
//                 columns={columns}
//                 rowKey="maSach"
//                 size="small"
//             />
//             {isModalVisible && (
//                 <BookModal
//                     visible={isModalVisible}
//                     onCancel={() => setIsModalVisible(false)}
//                     onSave={handleSave}
//                     initialData={editingBook}
//                     drawers={drawers}
//                 />
//             )}
//         </Spin>
//     );
// };
//
// export default BookSubTable;



import React, { useState, useEffect, useCallback } from 'react';
import {Table, Button, Space, message, Spin, Popconfirm, Tag, App, Tooltip, Input} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { getBooksByIsbn, getDrawers, createBook, updateBook, deleteBook, undoBookAction } from '../../services/bookService';
import BookModal from './BookModal'; // Import modal mới
const { Search } = Input; // Import Search

const BookSubTable = ({ isbn }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]); // <<-- State mới để hiển thị


    const [drawers, setDrawers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [historyStack, setHistoryStack] = useState([]);
    const { message: messageApi } = App.useApp();
    const DURATION = 3;

    const fetchBooksAndDrawers = useCallback(async () => {
        if (!isbn) return;
        setLoading(true);
        try {
            const [booksRes, drawersRes] = await Promise.all([getBooksByIsbn(isbn), getDrawers()]);
            const booksWithKeys = booksRes.data.map(b => ({...b, key: b.maSach}));
            setBooks(booksWithKeys);
            setFilteredBooks(booksWithKeys); // <<-- Cập nhật state mới
            setDrawers(drawersRes.data);
        } catch (error) {
            // Lỗi đã được xử lý bởi interceptor
        } finally {
            setLoading(false);
        }
    }, [isbn]);

    useEffect(() => {
        fetchBooksAndDrawers();
    }, [fetchBooksAndDrawers]);

// === HÀM TÌM KIẾM MỚI ===
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
    const pushToHistory = (action) => setHistoryStack(p => [...p, action]);

    const handleAdd = () => {
        setEditingBook(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingBook(record);
        setIsModalVisible(true);
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            if (editingBook) { // Sửa
                const response = await updateBook(isbn, editingBook.maSach, values);
                messageApi.success("Cập nhật sách thành công!", DURATION);
                pushToHistory({ actionType: 'UPDATE', data: { oldData: editingBook, newData: response.data, isbn } });
            } else { // Thêm
                const response = await createBook(isbn, values);
                messageApi.success("Thêm sách thành công!", DURATION);
                pushToHistory({ actionType: 'ADD', data: { isbn: isbn, maSach: response.data.maSach } });
            }
            setIsModalVisible(false);
            fetchBooksAndDrawers();
        } catch (error) {
            // Lỗi đã được xử lý
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record) => {
        setLoading(true);
        try {
            await deleteBook(isbn, record.maSach);
            messageApi.success("Xóa sách thành công!", DURATION);
            pushToHistory({ actionType: 'DELETE', data: { originalData: record, isbn: isbn } });
            fetchBooksAndDrawers();
        } catch (error) {
            // Lỗi đã được xử lý
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
            messageApi.success("Hoàn tác thành công!", DURATION);
            setHistoryStack([...historyStack]);
            fetchBooksAndDrawers();
        } catch (error) {
            historyStack.push(lastAction);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Mã Sách', dataIndex: 'maSach', key: 'maSach', sorter: (a, b) => a.maSach.localeCompare(b.maSach) },
        { title: 'Tình Trạng', dataIndex: 'tinhTrang', key: 'tinhTrang', render: (isOk) => <Tag color={isOk ? 'green' : 'volcano'}>{isOk ? 'Tốt' : 'Hỏng'}</Tag> },
        { title: 'Cho Mượn', dataIndex: 'choMuon', key: 'choMuon', render: (isRented) => <Tag color={isRented ? 'red' : 'geekblue'}>{isRented ? 'Đã mượn' : 'Trong kho'}</Tag> },
        { title: 'Ngăn Tủ', dataIndex: 'maNganTu', key: 'maNganTu', render: (maNganTu) => drawers.find(d => d.maNganTu === maNganTu)?.tenNganTu || 'N/A' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record)}>
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Spin spinning={loading}>
            {/* === THANH CÔNG CỤ MỚI === */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <Button onClick={handleAdd} type="primary" icon={<PlusOutlined />}>Thêm Sách Con</Button>
                    <Button onClick={handleUndo} icon={<UndoOutlined />} disabled={historyStack.length === 0}>Phục hồi Sách ({historyStack.length})</Button>
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
            {isModalVisible && (
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