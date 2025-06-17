// // // src/pages/BookTitlePage.jsx
// // import React, { useState, useEffect, useCallback } from 'react';
// // import {Table, Button, Space, message, Spin, Popconfirm, Image, Tooltip, Tag, App} from 'antd';
// // import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// // import {
// //     getBookTitles,
// //     deleteBookTitle,
// //     createBookTitle,
// //     updateBookTitle,
// //     undoBookTitleAction // Import API undo
// // } from '../services/bookTitleService';
// // import { formatDate } from '../utils/helpers';
// // import BookTitleModal from '../components/bookTitle/BookTitleModal';
// // import BookSubTable from '../components/bookTitle/BookSubTable'; // Import sub-table
// //
// // const BookTitlePage = () => {
// //     const [bookTitles, setBookTitles] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [isModalVisible, setIsModalVisible] = useState(false);
// //     const [editingBook, setEditingBook] = useState(null);
// //     const { message } = App.useApp(); // Khởi tạo message instance
// //     const DURATION = 3; // Định nghĩa DURATION
// //     // === STACK LỊCH SỬ HÀNH ĐỘNG ===
// //     const [historyStack, setHistoryStack] = useState([]);
// //
// //     const fetchBookTitles = useCallback(async () => {
// //         setLoading(true);
// //         try {
// //             const response = await getBookTitles();
// //             setBookTitles(response.data);
// //         } catch (error) {
// //             // Interceptor đã hiển thị lỗi
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, []);
// //
// //     useEffect(() => {
// //         fetchBookTitles();
// //     }, [fetchBookTitles]);
// //
// //     // Hàm đẩy hành động vào stack
// //     const pushToHistory = (action) => {
// //         setHistoryStack(prev => [...prev, action]);
// //     };
// //
// //     // --- HANDLERS CHO CÁC THAO TÁC CRUD ---
// //
// //     const handleAdd = () => {
// //         setEditingBook(null);
// //         setIsModalVisible(true);
// //     };
// //
// //     const handleEdit = (record) => {
// //         setEditingBook(record);
// //         setIsModalVisible(true);
// //     };
// //
// //     const handleDelete = async (recordToDelete) => {
// //         setLoading(true);
// //         try {
// //             await deleteBookTitle(recordToDelete.codeBookTitle);
// //             message.success('Xóa đầu sách thành công!' ,DURATION);
// //
// //             // Đẩy hành động DELETE vào stack
// //             pushToHistory({
// //                 actionType: 'DELETE',
// //                 data: { originalData: recordToDelete } // Lưu lại data gốc để có thể tạo lại
// //             });
// //
// //             fetchBookTitles(); // Tải lại bảng
// //         } catch (error) {
// //             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
// //             message.error(errorMessage, DURATION);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     // Hàm này được gọi khi form trong Modal được submit
// //     const handleModalSave = async (formData, imageFile) => {
// //         setLoading(true);
// //
// //         const postData = new FormData();
// //         postData.append('bookTitleData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
// //         if (imageFile) {
// //             postData.append('imageFile', imageFile);
// //         }
// //
// //         try {
// //             if (editingBook) { // --- Sửa ---
// //                 const response = await updateBookTitle(editingBook.codeBookTitle, postData);
// //                 message.success("Cập nhật thành công!" , DURATION);
// //
// //                 // Đẩy hành động UPDATE vào stack
// //                 pushToHistory({
// //                     actionType: 'UPDATE',
// //                     data: {
// //                         oldData: editingBook, // Dữ liệu trước khi sửa
// //                         newData: response.data // Dữ liệu sau khi sửa từ API trả về
// //                     }
// //                 });
// //
// //             } else { // --- Thêm mới ---
// //                 const response = await createBookTitle(postData);
// //                 message.success("Thêm mới thành công!" , DURATION);
// //
// //                 // Đẩy hành động ADD vào stack
// //                 pushToHistory({
// //                     actionType: 'ADD',
// //                     data: { codeBookTitle: response.data.codeBookTitle } // Chỉ cần lưu lại ID để có thể xóa
// //                 });
// //             }
// //             setIsModalVisible(false);
// //             fetchBookTitles();
// //         } catch (error) {
// //             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
// //             message.error(errorMessage, DURATION);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     // --- HANDLER CHO NÚT UNDO ---
// //     const handleUndo = async () => {
// //         if (historyStack.length === 0) {
// //             message.info('Không có hành động nào để hoàn tác.' , DURATION);
// //             return;
// //         }
// //
// //         const lastAction = historyStack[historyStack.length - 1];
// //
// //         setLoading(true);
// //         try {
// //             await undoBookTitleAction(lastAction);
// //             message.success('Hoàn tác thành công!',DURATION);
// //
// //             // Xóa hành động đã hoàn tác khỏi stack
// //             setHistoryStack(prev => prev.slice(0, prev.length - 1));
// //
// //             fetchBookTitles(); // Tải lại dữ liệu
// //         } catch (error) {
// //             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
// //             message.error(errorMessage, DURATION);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //
// //     const columns = [
// //         {
// //             title: 'Ảnh bìa',
// //             dataIndex: 'picturePath',
// //             key: 'picturePath',
// //             width: 100,
// //             render: (path) => (
// //                 <Image
// //                     width={80}
// //                     src={`http://localhost:8080/dausach/${path}`} // Giả định server public folder resource/images
// //                     fallback="/images/fallback.png" // Ảnh dự phòng nếu lỗi
// //                 />
// //             ),
// //         },
// //         {
// //             title: 'ISBN',
// //             dataIndex: 'codeBookTitle',
// //             key: 'codeBookTitle',
// //             width: 150,
// //             sorter: (a, b) => a.codeBookTitle.localeCompare(b.codeBookTitle),
// //         },
// //         {
// //             title: 'Tên Sách',
// //             dataIndex: 'nameBook',
// //             key: 'nameBook',
// //             sorter: (a, b) => a.nameBook.localeCompare(b.nameBook),
// //         },
// //         {
// //             title: 'Tác Giả',
// //             dataIndex: 'nameAuthor',
// //             key: 'nameAuthor',
// //         },
// //         {
// //             title: 'Ngày XB',
// //             dataIndex: 'dateRelease',
// //             key: 'dateRelease',
// //             render: (text) => formatDate(text),
// //             sorter: (a, b) => new Date(a.dateRelease) - new Date(b.dateRelease),
// //         },
// //         {
// //             title: 'Thể loại',
// //             dataIndex: 'nameCodeType',
// //             key: 'nameCodeType',
// //             render: (type) => <Tag color="blue">{type}</Tag>,
// //             filters: [
// //                 // Filter sẽ được thêm động sau khi có dữ liệu
// //             ],
// //             onFilter: (value, record) => record.nameCodeType.includes(value),
// //         },
// //         {
// //             title: 'Thao tác',
// //             key: 'action',
// //             render: (_, record) => (
// //                 <Space size="middle">
// //                     <Tooltip title="Sửa">
// //                         <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
// //                     </Tooltip>
// //                     <Tooltip title="Xóa">
// //                         <Popconfirm
// //                             title={`Bạn chắc chắn muốn xóa "${record.nameBook}"?`}
// //                             onConfirm={() => handleDelete(record)} // Truyền cả record để lưu vào history
// //                         >
// //                             <Button danger icon={<DeleteOutlined />} />
// //                         </Popconfirm>
// //                     </Tooltip>
// //                 </Space>
// //             ),
// //         },
// //     ];
// //
// //     return (
// //         <div>
// //             <Space style={{ marginBottom: 16 }}>
// //                 <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Mới</Button>
// //                 <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
// //                     Phục hồi ({historyStack.length})
// //                 </Button>
// //             </Space>
// //             <Spin spinning={loading}>
// //                 <Table dataSource={bookTitles} columns={columns} rowKey="codeBookTitle" bordered
// //                     // === PHẦN MỚI CHO SUB-TABLE ===
// //                        expandable={{
// //                            expandedRowRender: (record) => (
// //                                <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
// //                                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
// //                                        Danh sách Sách của Đầu sách: {record.nameBook} (ISBN: {record.codeBookTitle})
// //                                    </p>
// //                                    <BookSubTable isbn={record.codeBookTitle} />
// //                                </div>
// //                            ),
// //                            // Chỉ cho phép mở một hàng tại một thời điểm
// //                            // expandRowByClick: true,
// //                        }}
// //                 />
// //             </Spin>
// //             {isModalVisible && (
// //                 <BookTitleModal
// //                     visible={isModalVisible}
// //                     onCancel={() => setIsModalVisible(false)}
// //                     onSave={handleModalSave} // Sẽ truyền cả file và data
// //                     initialData={editingBook}
// //                 />
// //             )}
// //         </div>
// //     );
// // };
// //
// // export default BookTitlePage;
//
//
//
// // src/pages/BookTitlePage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import {Table, Button, Space, message, Spin, Popconfirm, Image, Tooltip, Tag, App} from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// import {
//     getBookTitles,
//     deleteBookTitle,
//     createBookTitle,
//     updateBookTitle,
//     undoBookTitleAction // Import API undo
// } from '../services/bookTitleService';
// import { formatDate } from '../utils/helpers';
// import BookTitleModal from '../components/bookTitle/BookTitleModal';
// import BookSubTable from '../components/bookTitle/BookSubTable'; // Import sub-table
//
// const BookTitlePage = () => {
//     const [bookTitles, setBookTitles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingBook, setEditingBook] = useState(null);
//     const { message } = App.useApp(); // Khởi tạo message instance
//     const DURATION = 3; // Định nghĩa DURATION
//     // === STACK LỊCH SỬ HÀNH ĐỘNG ===
//     const [historyStack, setHistoryStack] = useState([]);
//
//     const fetchBookTitles = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await getBookTitles();
//             setBookTitles(response.data);
//         } catch (error) {
//             // Interceptor đã hiển thị lỗi
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         fetchBookTitles();
//     }, [fetchBookTitles]);
//
//     // Hàm đẩy hành động vào stack
//     const pushToHistory = (action) => {
//         setHistoryStack(prev => [...prev, action]);
//     };
//
//     // --- HANDLERS CHO CÁC THAO TÁC CRUD ---
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
//     const handleDelete = async (recordToDelete) => {
//         setLoading(true);
//         try {
//             await deleteBookTitle(recordToDelete.codeBookTitle);
//             message.success('Xóa đầu sách thành công!' ,DURATION);
//
//             // Đẩy hành động DELETE vào stack
//             pushToHistory({
//                 actionType: 'DELETE',
//                 data: { originalData: recordToDelete } // Lưu lại data gốc để có thể tạo lại
//             });
//
//             fetchBookTitles(); // Tải lại bảng
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
//             message.error(errorMessage, DURATION);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Hàm này được gọi khi form trong Modal được submit
//     const handleModalSave = async (formData, imageFile) => {
//         setLoading(true);
//
//         const postData = new FormData();
//         postData.append('bookTitleData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
//         if (imageFile) {
//             postData.append('imageFile', imageFile);
//         }
//
//         try {
//             if (editingBook) { // --- Sửa ---
//                 const response = await updateBookTitle(editingBook.codeBookTitle, postData);
//                 message.success("Cập nhật thành công!" , DURATION);
//
//                 // Đẩy hành động UPDATE vào stack
//                 pushToHistory({
//                     actionType: 'UPDATE',
//                     data: {
//                         oldData: editingBook, // Dữ liệu trước khi sửa
//                         newData: response.data // Dữ liệu sau khi sửa từ API trả về
//                     }
//                 });
//
//             } else { // --- Thêm mới ---
//                 const response = await createBookTitle(postData);
//                 message.success("Thêm mới thành công!" , DURATION);
//
//                 // Đẩy hành động ADD vào stack
//                 pushToHistory({
//                     actionType: 'ADD',
//                     data: { codeBookTitle: response.data.codeBookTitle } // Chỉ cần lưu lại ID để có thể xóa
//                 });
//             }
//             setIsModalVisible(false);
//             fetchBookTitles();
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
//             message.error(errorMessage, DURATION);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // --- HANDLER CHO NÚT UNDO ---
//     const handleUndo = async () => {
//         if (historyStack.length === 0) {
//             message.info('Không có hành động nào để hoàn tác.' , DURATION);
//             return;
//         }
//
//         const lastAction = historyStack[historyStack.length - 1];
//
//         setLoading(true);
//         try {
//             await undoBookTitleAction(lastAction);
//             message.success('Hoàn tác thành công!',DURATION);
//
//             // Xóa hành động đã hoàn tác khỏi stack
//             setHistoryStack(prev => prev.slice(0, prev.length - 1));
//
//             fetchBookTitles(); // Tải lại dữ liệu
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
//             message.error(errorMessage, DURATION);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//
//     const columns = [
//         {
//             title: 'Ảnh bìa',
//             dataIndex: 'picturePath',
//             key: 'picturePath',
//             width: 100,
//             render: (path) => (
//                 <Image
//                     width={80}
//                     src={`http://localhost:8080/dausach/${path}`} // Giả định server public folder resource/images
//                     fallback="/images/fallback.png" // Ảnh dự phòng nếu lỗi
//                 />
//             ),
//         },
//         {
//             title: 'ISBN',
//             dataIndex: 'codeBookTitle',
//             key: 'codeBookTitle',
//             width: 150,
//             sorter: (a, b) => a.codeBookTitle.localeCompare(b.codeBookTitle),
//         },
//         {
//             title: 'Tên Sách',
//             dataIndex: 'nameBook',
//             key: 'nameBook',
//             sorter: (a, b) => a.nameBook.localeCompare(b.nameBook),
//         },
//         {
//             title: 'Tác Giả',
//             dataIndex: 'nameAuthor',
//             key: 'nameAuthor',
//         },
//         {
//             title: 'Ngày XB',
//             dataIndex: 'dateRelease',
//             key: 'dateRelease',
//             render: (text) => formatDate(text),
//             sorter: (a, b) => new Date(a.dateRelease) - new Date(b.dateRelease),
//         },
//         {
//             title: 'Thể loại',
//             dataIndex: 'nameCodeType',
//             key: 'nameCodeType',
//             render: (type) => <Tag color="blue">{type}</Tag>,
//             filters: [
//                 // Filter sẽ được thêm động sau khi có dữ liệu
//             ],
//             onFilter: (value, record) => record.nameCodeType.includes(value),
//         },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Tooltip title="Sửa">
//                         <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//                     </Tooltip>
//                     <Tooltip title="Xóa">
//                         <Popconfirm
//                             title={`Bạn chắc chắn muốn xóa "${record.nameBook}"?`}
//                             onConfirm={() => handleDelete(record)} // Truyền cả record để lưu vào history
//                         >
//                             <Button danger icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                     </Tooltip>
//                 </Space>
//             ),
//         },
//     ];
//
//     return (
//         <div>
//             <Space style={{ marginBottom: 16 }}>
//                 <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Mới</Button>
//                 <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
//                     Phục hồi ({historyStack.length})
//                 </Button>
//             </Space>
//             <Spin spinning={loading}>
//                 <Table dataSource={bookTitles} columns={columns} rowKey="codeBookTitle" bordered
//                     // === PHẦN MỚI CHO SUB-TABLE ===
//                        expandable={{
//                            expandedRowRender: (record) => (
//                                <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
//                                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                                        Danh sách Sách của Đầu sách: {record.nameBook} (ISBN: {record.codeBookTitle})
//                                    </p>
//                                    <BookSubTable isbn={record.codeBookTitle} />
//                                </div>
//                            ),
//                            // Chỉ cho phép mở một hàng tại một thời điểm
//                            // expandRowByClick: true,
//                        }}
//                 />
//             </Spin>
//             {isModalVisible && (
//                 <BookTitleModal
//                     visible={isModalVisible}
//                     onCancel={() => setIsModalVisible(false)}
//                     onSave={handleModalSave} // Sẽ truyền cả file và data
//                     initialData={editingBook}
//                 />
//             )}
//         </div>
//     );
// };
//
// export default BookTitlePage;


// // src/pages/BookTitlePage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import {Table, Button, Space, message, Spin, Popconfirm, Image, Tooltip, Tag, App} from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// import {
//     getBookTitles,
//     deleteBookTitle,
//     createBookTitle,
//     updateBookTitle,
//     undoBookTitleAction // Import API undo
// } from '../services/bookTitleService';
// import { formatDate } from '../utils/helpers';
// import BookTitleModal from '../components/bookTitle/BookTitleModal';
// import BookSubTable from '../components/bookTitle/BookSubTable'; // Import sub-table
//
// const BookTitlePage = () => {
//     const [bookTitles, setBookTitles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingBook, setEditingBook] = useState(null);
//     const { message } = App.useApp(); // Khởi tạo message instance
//     const DURATION = 3; // Định nghĩa DURATION
//     // === STACK LỊCH SỬ HÀNH ĐỘNG ===
//     const [historyStack, setHistoryStack] = useState([]);
//
//     const fetchBookTitles = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await getBookTitles();
//             setBookTitles(response.data);
//         } catch (error) {
//             // Interceptor đã hiển thị lỗi
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         fetchBookTitles();
//     }, [fetchBookTitles]);
//
//     // Hàm đẩy hành động vào stack
//     const pushToHistory = (action) => {
//         setHistoryStack(prev => [...prev, action]);
//     };
//
//     // --- HANDLERS CHO CÁC THAO TÁC CRUD ---
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
//     const handleDelete = async (recordToDelete) => {
//         setLoading(true);
//         try {
//             await deleteBookTitle(recordToDelete.codeBookTitle);
//             message.success('Xóa đầu sách thành công!' ,DURATION);
//
//             // Đẩy hành động DELETE vào stack
//             pushToHistory({
//                 actionType: 'DELETE',
//                 data: { originalData: recordToDelete } // Lưu lại data gốc để có thể tạo lại
//             });
//
//             fetchBookTitles(); // Tải lại bảng
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
//             message.error(errorMessage, DURATION);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Hàm này được gọi khi form trong Modal được submit
//     const handleModalSave = async (formData, imageFile) => {
//         setLoading(true);
//
//         const postData = new FormData();
//         postData.append('bookTitleData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
//         if (imageFile) {
//             postData.append('imageFile', imageFile);
//         }
//
//         try {
//             if (editingBook) { // --- Sửa ---
//                 const response = await updateBookTitle(editingBook.codeBookTitle, postData);
//                 message.success("Cập nhật thành công!" , DURATION);
//
//                 // Đẩy hành động UPDATE vào stack
//                 pushToHistory({
//                     actionType: 'UPDATE',
//                     data: {
//                         oldData: editingBook, // Dữ liệu trước khi sửa
//                         newData: response.data // Dữ liệu sau khi sửa từ API trả về
//                     }
//                 });
//
//             } else { // --- Thêm mới ---
//                 const response = await createBookTitle(postData);
//                 message.success("Thêm mới thành công!" , DURATION);
//
//                 // Đẩy hành động ADD vào stack
//                 pushToHistory({
//                     actionType: 'ADD',
//                     data: { codeBookTitle: response.data.codeBookTitle } // Chỉ cần lưu lại ID để có thể xóa
//                 });
//             }
//             setIsModalVisible(false);
//             fetchBookTitles();
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
//             message.error(errorMessage, DURATION);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // --- HANDLER CHO NÚT UNDO ---
//     const handleUndo = async () => {
//         if (historyStack.length === 0) {
//             message.info('Không có hành động nào để hoàn tác.' , DURATION);
//             return;
//         }
//
//         const lastAction = historyStack[historyStack.length - 1];
//
//         setLoading(true);
//         try {
//             await undoBookTitleAction(lastAction);
//             message.success('Hoàn tác thành công!',DURATION);
//
//             // Xóa hành động đã hoàn tác khỏi stack
//             setHistoryStack(prev => prev.slice(0, prev.length - 1));
//
//             fetchBookTitles(); // Tải lại dữ liệu
//         } catch (error) {
//             const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
//             message.error(errorMessage, DURATION);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//
//     const columns = [
//         {
//             title: 'Ảnh bìa',
//             dataIndex: 'picturePath',
//             key: 'picturePath',
//             width: 100,
//             render: (path) => (
//                 <Image
//                     width={80}
//                     src={`http://localhost:8080/dausach/${path}`} // Giả định server public folder resource/images
//                     fallback="/images/fallback.png" // Ảnh dự phòng nếu lỗi
//                 />
//             ),
//         },
//         {
//             title: 'ISBN',
//             dataIndex: 'codeBookTitle',
//             key: 'codeBookTitle',
//             width: 150,
//             sorter: (a, b) => a.codeBookTitle.localeCompare(b.codeBookTitle),
//         },
//         {
//             title: 'Tên Sách',
//             dataIndex: 'nameBook',
//             key: 'nameBook',
//             sorter: (a, b) => a.nameBook.localeCompare(b.nameBook),
//         },
//         {
//             title: 'Tác Giả',
//             dataIndex: 'nameAuthor',
//             key: 'nameAuthor',
//         },
//         {
//             title: 'Ngày XB',
//             dataIndex: 'dateRelease',
//             key: 'dateRelease',
//             render: (text) => formatDate(text),
//             sorter: (a, b) => new Date(a.dateRelease) - new Date(b.dateRelease),
//         },
//         {
//             title: 'Thể loại',
//             dataIndex: 'nameCodeType',
//             key: 'nameCodeType',
//             render: (type) => <Tag color="blue">{type}</Tag>,
//             filters: [
//                 // Filter sẽ được thêm động sau khi có dữ liệu
//             ],
//             onFilter: (value, record) => record.nameCodeType.includes(value),
//         },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Tooltip title="Sửa">
//                         <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//                     </Tooltip>
//                     <Tooltip title="Xóa">
//                         <Popconfirm
//                             title={`Bạn chắc chắn muốn xóa "${record.nameBook}"?`}
//                             onConfirm={() => handleDelete(record)} // Truyền cả record để lưu vào history
//                         >
//                             <Button danger icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                     </Tooltip>
//                 </Space>
//             ),
//         },
//     ];
//
//     return (
//         <div>
//             <Space style={{ marginBottom: 16 }}>
//                 <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Mới</Button>
//                 <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
//                     Phục hồi ({historyStack.length})
//                 </Button>
//             </Space>
//             <Spin spinning={loading}>
//                 <Table dataSource={bookTitles} columns={columns} rowKey="codeBookTitle" bordered
//                     // === PHẦN MỚI CHO SUB-TABLE ===
//                        expandable={{
//                            expandedRowRender: (record) => (
//                                <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
//                                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                                        Danh sách Sách của Đầu sách: {record.nameBook} (ISBN: {record.codeBookTitle})
//                                    </p>
//                                    <BookSubTable isbn={record.codeBookTitle} />
//                                </div>
//                            ),
//                            // Chỉ cho phép mở một hàng tại một thời điểm
//                            // expandRowByClick: true,
//                        }}
//                 />
//             </Spin>
//             {isModalVisible && (
//                 <BookTitleModal
//                     visible={isModalVisible}
//                     onCancel={() => setIsModalVisible(false)}
//                     onSave={handleModalSave} // Sẽ truyền cả file và data
//                     initialData={editingBook}
//                 />
//             )}
//         </div>
//     );
// };
//
// export default BookTitlePage;



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
import BookTitleModal from '../components/bookTitle/BookTitleModal';
import BookSubTable from '../components/bookTitle/BookSubTable'; // Import sub-table

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
            const dataWithStatus = response.data.map(item => ({ ...item, status: 'UNCHANGED' }));
            setBookTitles(dataWithStatus);
            setFilteredBookTitles(dataWithStatus);
        } catch (error) {
            // Interceptor đã hiển thị lỗi
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
            const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
            message.error(errorMessage, DURATION);
        } finally {
            setLoading(false);
        }
    };

    // Hàm này được gọi khi form trong Modal được submit
    const handleModalSave = async (formData, imageFile) => {
        setLoading(true);

        const postData = new FormData();
        postData.append('bookTitleData', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
        if (imageFile) {
            postData.append('imageFile', imageFile);
        }

        try {
            if (editingBook) { // --- Sửa ---
                const response = await updateBookTitle(editingBook.codeBookTitle, postData);
                message.success("Cập nhật thành công!" , DURATION);

                // Đẩy hành động UPDATE vào stack
                pushToHistory({
                    actionType: 'UPDATE',
                    data: {
                        oldData: editingBook, // Dữ liệu trước khi sửa
                        newData: response.data // Dữ liệu sau khi sửa từ API trả về
                    }
                });

            } else { // --- Thêm mới ---
                const response = await createBookTitle(postData);
                message.success("Thêm mới thành công!" , DURATION);

                // Đẩy hành động ADD vào stack
                pushToHistory({
                    actionType: 'ADD',
                    data: { codeBookTitle: response.data.codeBookTitle } // Chỉ cần lưu lại ID để có thể xóa
                });
            }
            setIsModalVisible(false);
            fetchBookTitles();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
            message.error(errorMessage, DURATION);
        } finally {
            setLoading(false);
        }
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
            const errorMessage = error.response?.data?.error || 'Đã có lỗi không xác định xảy ra.';
            message.error(errorMessage, DURATION);
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
                    src={`http://localhost:8080/dausach/${path}`} // Giả định server public folder resource/images
                    fallback="/images/fallback.png" // Ảnh dự phòng nếu lỗi
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
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleModalSave} // Sẽ truyền cả file và data
                    initialData={editingBook}
                />
            )}
        </div>
    );
};

export default BookTitlePage;