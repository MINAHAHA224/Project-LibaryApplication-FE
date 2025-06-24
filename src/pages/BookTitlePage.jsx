


// src/pages/BookTitlePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {Table, Button, Space, message, Spin, Popconfirm, Image, Tooltip, Tag,  App, Input, Typography} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined, FileExcelOutlined } from '@ant-design/icons';
import {
    getBookTitles,
    deleteBookTitle,
    createBookTitle,
    updateBookTitle,
    undoBookTitleAction ,// Import API undo
    getBookTitleReportData
} from '../services/bookTitleService';
import { formatDate } from '../utils/helpers';
import dayjs from 'dayjs'; // Đảm bảo đã import dayjs

import BookTitleModal from '../components/bookTitle/BookTitleModal';
import BookSubTable from '../components/bookTitle/BookSubTable'; // Import sub-table
// import AuthenticatedImage from '../components/common/AuthenticatedImage'; // Import component mới

// ... imports
import { downloadFile } from '../utils/helpers';
import { downloadBookTitleReport } from '../services/bookTitleService';

import { useNavigate } from 'react-router-dom';



const { Search } = Input; // Import component Search của AntD
const { Title } = Typography;
const BookTitlePage = () => {
    // === KHAI BÁO BIẾN navigate Ở ĐÂY ===
    const navigate = useNavigate();

    const [bookTitles, setBookTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION
    // === STACK LỊCH SỬ HÀNH ĐỘNG ===
    const [historyStack, setHistoryStack] = useState([]);
    const [filteredBookTitles, setFilteredBookTitles] = useState([]); // State này chứa dữ liệu đã lọc để hiển thị

    const fetchBookTitles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getBookTitles();
            console.log("fetchBookTitles response:",response);
            const dataWithStatus = response.data.map(item => ({ ...item, status: 'UNCHANGED' }));
            setBookTitles(dataWithStatus);
            setFilteredBookTitles(dataWithStatus);
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"fetchBookTitles error:", DURATION);
            console.log("fetchBookTitles error:",error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookTitles();
    }, [fetchBookTitles]);

    // Hàm đẩy hành động vào stack
    const pushToHistory = (action) => {
        setHistoryStack(prev => [...prev, action]);
    };



    // === HÀM XỬ LÝ TÌM KIẾM MỚI ===
    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredBookTitles(bookTitles); // Nếu ô tìm kiếm trống, hiển thị lại toàn bộ
            return;
        }
        const filtered = bookTitles.filter(item =>
            item.codeBookTitle.toLowerCase().includes(lowercasedValue) ||
            item.nameBook.toLowerCase().includes(lowercasedValue) ||
            item.nameAuthor.toLowerCase().includes(lowercasedValue) ||
            item.nameCodeType.toLowerCase().includes(lowercasedValue)
        );
        setFilteredBookTitles(filtered);
    };

    // --- HANDLERS CHO CÁC THAO TÁC CRUD ---

    const handleAdd = () => {
        setEditingBook(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingBook(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (recordToDelete) => {
        setLoading(true);
        try {
            await deleteBookTitle(recordToDelete.codeBookTitle);
            message.success('Xóa đầu sách thành công!' ,DURATION);

            // Đẩy hành động DELETE vào stack
            pushToHistory({
                actionType: 'DELETE',
                data: { originalData: recordToDelete } // Lưu lại data gốc để có thể tạo lại
            });

            fetchBookTitles(); // Tải lại bảng
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handleDelete error:", DURATION);

           console.log("handleDelete error:",error);
        } finally {
            setLoading(false);
        }
    };

    const handleModalSave = async (formData, imageFile) => {
        setLoading(true);
// === SỬA LẠI LOGIC FORMAT NGÀY THÁNG Ở ĐÂY ===
        let formattedDate = null;
        // Kiểm tra xem formData.dateRelease có tồn tại không
        if (formData.dateRelease) {
            // Kiểm tra xem nó có phải là đối tượng dayjs không (có hàm .format)
            if (typeof formData.dateRelease.format === 'function') {
                formattedDate = formData.dateRelease.format('YYYY-MM-DD');
            } else {
                // Nếu không, nó là timestamp hoặc chuỗi, tạo đối tượng dayjs từ nó
                formattedDate = dayjs(formData.dateRelease).format('YYYY-MM-DD');
            }
        }
        // Format lại ngày tháng
        const dataToSend = {
            ...formData,
            dateRelease: formData.dateRelease ? formData.dateRelease.format('YYYY-MM-DD') : null,
        };

        // Tạo FormData
        const postData = new FormData();
        postData.append('bookTitleData', new Blob([JSON.stringify(dataToSend)], { type: 'application/json' }));

        // Nếu có file mới được chọn (dù là thêm hay sửa), đính kèm nó
        if (imageFile) {
            postData.append('imageFile', imageFile);
        }

        try {
            if (editingBook) {
                const response = await updateBookTitle(editingBook.codeBookTitle, postData);
                message.success("Cập nhật thành công!", DURATION);
                // Logic push history cho UPDATE phải lưu cả ISBN cũ và mới
                pushToHistory({
                    actionType: 'UPDATE',
                    data: {
                        oldData: editingBook, // Chứa ISBN cũ
                        newData: response.data // Chứa ISBN mới
                    }
                });
            } else {
                const response = await createBookTitle(postData);
                message.success("Thêm mới thành công!", DURATION);
                pushToHistory({ actionType: 'ADD', data: { codeBookTitle: response.data.codeBookTitle } });
            }
            setIsModalVisible(false);
            fetchBookTitles();
        } catch (error) {
            /*...*/
            message.error( error.response.data.message || error.response.data.error ||"handleModalSave error:", DURATION);
            console.log("handleModalSave error:",error);
        }
        finally { setLoading(false); }
    };

    // --- HANDLER CHO NÚT UNDO ---
    const handleUndo = async () => {
        if (historyStack.length === 0) {
            message.info('Không có hành động nào để hoàn tác.' , DURATION);
            return;
        }

        const lastAction = historyStack[historyStack.length - 1];

        setLoading(true);
        try {
            await undoBookTitleAction(lastAction);
            message.success('Hoàn tác thành công!',DURATION);

            // Xóa hành động đã hoàn tác khỏi stack
            setHistoryStack(prev => prev.slice(0, prev.length - 1));

            fetchBookTitles(); // Tải lại dữ liệu
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handleUndo error:", DURATION);
           console.log("handleUndo error:",error);
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        {
            title: 'Ảnh bìa',
            dataIndex: 'picturePath',
            key: 'picturePath',
            width: 100,
            render: (path) => (
                <Image
                    width={80}
                    src={`http://localhost:8080/dausach/${path}`}
                    fallback="/images/fallback.png"
                />
            ),
        },
        {
            title: 'ISBN',
            dataIndex: 'codeBookTitle',
            key: 'codeBookTitle',
            width: 150,
            sorter: (a, b) => a.codeBookTitle.localeCompare(b.codeBookTitle),
        },
        {
            title: 'Tên Sách',
            dataIndex: 'nameBook',
            key: 'nameBook',
            sorter: (a, b) => a.nameBook.localeCompare(b.nameBook),
        },
        {
            title: 'Tác Giả',
            dataIndex: 'nameAuthor',
            key: 'nameAuthor',
        },
        {
            title: 'Ngày XB',
            dataIndex: 'dateRelease',
            key: 'dateRelease',
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.dateRelease) - new Date(b.dateRelease),
        },
        {
            title: 'Thể loại',
            dataIndex: 'nameCodeType',
            key: 'nameCodeType',
            render: (type) => <Tag color="blue">{type}</Tag>,
            filters: [
                // Filter sẽ được thêm động sau khi có dữ liệu
            ],
            onFilter: (value, record) => record.nameCodeType.includes(value),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title={`Bạn chắc chắn muốn xóa "${record.nameBook}"?`}
                            onConfirm={() => handleDelete(record)} // Truyền cả record để lưu vào history
                        >
                            <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // === HÀM XỬ LÝ NÚT XUẤT EXCEL ĐÃ ĐƯỢC CẬP NHẬT ===
    const handlePreviewReport = () => {
        const previewColumns = [
            { title: 'ISBN', dataIndex: 'codeBookTitle', key: 'codeBookTitle' },
            { title: 'Tên Sách', dataIndex: 'nameBook', key: 'nameBook' },
            { title: 'Tác Giả', dataIndex: 'nameAuthor', key: 'nameAuthor' },
            { title: 'Thể Loại', dataIndex: 'nameCodeType', key: 'nameCodeType' },
            { title: 'Số Cuốn', dataIndex: 'soCuonThucTe', key: 'soCuonThucTe', align: 'right' },
        ];

        navigate('/report/preview', {
            state: {
                reportType: 'bookTitle',
                columns: previewColumns,
                title: 'Xem trước Báo cáo Đầu sách',
                backUrl: '/' // URL để quay lại trang này
            }
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Quản lý Đầu sách</Title>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Mới</Button>
                    <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
                        Phục hồi ({historyStack.length})
                    </Button>
                    <Search
                        placeholder="Tìm theo ISBN, tên sách, tác giả..."
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        allowClear // Cho phép xóa nhanh nội dung tìm kiếm
                        enterButton // Hiển thị nút tìm kiếm
                    />
                    <Button icon={<FileExcelOutlined />} onClick={handlePreviewReport}>Xuất Excel</Button>

                </Space>
            </div>

            <Spin spinning={loading}>
                <Table dataSource={filteredBookTitles} columns={columns} rowKey="codeBookTitle" bordered
                    // === PHẦN MỚI CHO SUB-TABLE ===
                       expandable={{
                           expandedRowRender: (record) => (
                               <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                                   <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                       Danh sách Sách của Đầu sách: {record.nameBook} (ISBN: {record.codeBookTitle})
                                   </p>
                                   <BookSubTable isbn={record.codeBookTitle} />
                               </div>
                           ),
                           // Chỉ cho phép mở một hàng tại một thời điểm
                           // expandRowByClick: true,
                       }}
                />
            </Spin>
            {isModalVisible && (
                <BookTitleModal
                    visible={isModalVisible}
                    onCancel={(shouldRefresh) => {
                        setIsModalVisible(false);
                        if (shouldRefresh) {
                            fetchBookTitles();
                        }
                    }}
                    onSave={handleModalSave} // Sẽ truyền cả file và data
                    initialData={editingBook}
                />
            )}
        </div>
    );
};

export default BookTitlePage;