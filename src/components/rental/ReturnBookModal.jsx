// import React, { useEffect, useState, useCallback } from 'react';
// import {Modal, Spin, Table, Select, Button, message, App as AntdApp, Popconfirm, Empty, Form, Descriptions} from 'antd';
// import { getRentalDetail } from '../../services/rentalService'; // Dùng để lấy danh sách sách
// import { returnBook } from '../../services/rentalService';     // Dùng để gọi API trả sách
// import { getStaffList } from '../../services/rentalService';
// import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
//
// const ReturnBookModal = ({ visible, onCancel, onSuccess, ticketId }) => {
//     const { user } = useAuth(); // Lấy thông tin user
//
//
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(true);
//     const [staffList, setStaffList] = useState([]);
//     const [unreturnedBooks, setUnreturnedBooks] = useState([]);
//     const { message: message } = AntdApp.useApp();
//
//     const fetchUnreturnedBooks = useCallback(async () => {
//         if (!ticketId) return;
//         setLoading(true);
//         try {
//             const [detailRes, staffRes] = await Promise.all([
//                 getRentalDetail(ticketId),
//                 getStaffList()
//             ]);
//
//             // Lọc ra những sách chưa trả (DaTra = false hoặc null)
//             console.log("Danh sach sach",detailRes.data.danhSachSach)
//             const booksToReturn = detailRes.data.danhSachSach.filter(book => !book.daTra);
//             setUnreturnedBooks(booksToReturn);
//             setStaffList(staffRes.data);
//         } catch (error) {
//             message.error("Lỗi khi tải danh sách sách cần trả.");
//         } finally {
//             setLoading(false);
//         }
//     }, [ticketId, message]);
//
//     useEffect(() => {
//         if (visible) {
//             fetchUnreturnedBooks();
//         }
//         if(user) {
//             form.setFieldsValue({ maNV: user.maNV });
//         }
//     }, [visible, fetchUnreturnedBooks, user, form]);
//
//     const handleReturn = async (bookToReturn) => {
//         try {
//             // Validate form để lấy mã nhân viên
//             const values = await form.validateFields();
//
//             setLoading(true);
//             const payload = {
//                 maphieu: ticketId,
//                 masach: bookToReturn.masach,
//                 tinhTrang: bookToReturn.tinhTrangTra || 'Tốt', // Lấy tình trạng từ state của sách, mặc định là Tốt
//                 maNV: user.maNV,// <<-- Lấy thẳng maNV từ context
//             };
//
//             await returnBook(payload);
//                 const ngayMuon = new Date(ticketData.ngaymuon); // ticketData từ props
//             const ngayTra = new Date();
//             const soNgayMuon = (ngayTra - ngayMuon) / (1000 * 60 * 60 * 24);
//
//             if (soNgayMuon > 15) {
//                 message.warning(`Trả sách muộn! Thẻ của độc giả có thể đã bị khóa.`, DURATION + 2);
//             }
//
//             message.success(`Trả sách "${bookToReturn.tensach}" thành công!`, DURATION);
//
//             // Sau khi trả thành công, tải lại danh sách sách chưa trả
//             fetchUnreturnedBooks();
//
//             // Nếu đây là sách cuối cùng, tự động đóng modal và gọi onSuccess
//             if (unreturnedBooks.length === 1) {
//                 onSuccess();
//             }
//
//         } catch (error) {
//             // Lỗi validation hoặc lỗi API đã được xử lý
//             console.error("Return book failed", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Hàm cập nhật trạng thái trả của sách trong state tạm thời
//     const handleStatusChange = (masach, newStatus) => {
//         setUnreturnedBooks(currentBooks =>
//             currentBooks.map(book =>
//                 book.masach === masach ? { ...book, tinhTrangTra: newStatus } : book
//             )
//         );
//     };
//
//     const columns = [
//         { title: 'Mã Sách', dataIndex: 'masach', key: 'masach' },
//         { title: 'Tên Sách', dataIndex: 'tensach', key: 'tensach' },
//         {
//             title: 'Tình trạng khi trả',
//             key: 'status',
//             render: (_, record) => (
//                 <Select defaultValue="Tốt" style={{ width: 120 }} onChange={(value) => handleStatusChange(record.masach, value)}>
//                     <Select.Option value="Tốt">Tốt</Select.Option>
//                     <Select.Option value="Hỏng">Hỏng</Select.Option>
//                     <Select.Option value="Mất">Mất</Select.Option>
//                 </Select>
//             )
//         },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             render: (_, record) => (
//                 <Popconfirm
//                     title={`Bạn chắc chắn muốn trả sách này?`}
//                     onConfirm={() => handleReturn(record)}
//                     okText="Đồng ý"
//                     cancelText="Hủy"
//                 >
//                     <Button type="primary">Trả sách này</Button>
//                 </Popconfirm>
//             )
//         }
//     ];
//
//     return (
//         <Modal
//             title={`Trả sách cho Phiếu Mượn #${ticketId}`}
//             open={visible}
//             onCancel={onCancel}
//             footer={[
//                 <Button key="close" onClick={onCancel}>
//                     Đóng
//                 </Button>,
//             ]}
//             width={800}
//         >
//             <Spin spinning={loading}>
//                 {/* Bỏ Form đi nếu không còn trường nào cho người dùng nhập */}
//                 <Descriptions column={1} bordered style={{ marginBottom: 16 }}>
//                     <Descriptions.Item label="Nhân viên nhận sách">
//                         {user?.hoTenDayDu}
//                     </Descriptions.Item>
//                 </Descriptions>
//                 <Table
//                     columns={columns}
//                     dataSource={unreturnedBooks}
//                     rowKey="masach"
//                     pagination={false}
//                     bordered
//                     size="small"
//                     locale={{ emptyText: <Empty description="Tất cả sách trong phiếu này đã được trả." /> }}
//                 />
//             </Spin>
//         </Modal>
//     );
// };
//
// export default ReturnBookModal;

import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Spin, Table, Select, Button, App as AntdApp, Popconfirm, Empty, Form, Descriptions } from 'antd';
import { getRentalDetail } from '../../services/rentalService';
import { returnBook } from '../../services/rentalService'; // Đổi lại service cho đúng
import { useAuth } from '../../contexts/AuthContext';

const ReturnBookModal = ({ visible, onCancel, onSuccess, ticketId }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [rentalInfo, setRentalInfo] = useState(null); // Lưu thông tin phiếu mượn
    const [unreturnedBooks, setUnreturnedBooks] = useState([]);
    const { message } = AntdApp.useApp();
    const DURATION = 3;

    const fetchUnreturnedBooks = useCallback(async () => {
        if (!ticketId) return;
        setLoading(true);
        try {
            const detailRes = await getRentalDetail(ticketId);

            setRentalInfo(detailRes.data); // Lưu thông tin chung của phiếu

            const booksToReturn = detailRes.data.danhSachSach.filter(book => !book.daTra);
            setUnreturnedBooks(booksToReturn.map(b => ({ ...b, tinhTrangTra: 'Tốt' }))); // Gán tình trạng trả mặc định
        } catch (error) {
           console.error("fetchUnreturnedBooks error:", error);
            message.error( error.response.data.message || error.response.data.error ||"fetchUnreturnedBooks error:", DURATION);
        } finally {
            setLoading(false);
        }
    }, [ticketId, message]);

    useEffect(() => {
        if (visible) {
            fetchUnreturnedBooks();
        }
    }, [visible, fetchUnreturnedBooks]);

    const handleReturn = async (bookToReturn) => {
        // Không cần form.validateFields nữa

        setLoading(true);
        try {
            const payload = {
                maphieu: ticketId,
                masach: bookToReturn.masach,
                tinhTrang: bookToReturn.tinhTrangTra, // Lấy tình trạng từ state của sách
                maNV: user.maNV,
            };

            await returnBook(payload);

            // Kiểm tra trả muộn và thông báo
            const ngayMuon = new Date(rentalInfo.ngaymuon);
            const ngayTra = new Date();
            const soNgayMuon = Math.floor((ngayTra - ngayMuon) / (1000 * 60 * 60 * 24));

            if (soNgayMuon > 15) {
                message.warning(`Trả sách muộn ${soNgayMuon - 15} ngày! Thẻ của độc giả có thể đã bị khóa.`, DURATION + 2);
            }

            message.success(`Trả sách "${bookToReturn.tensach}" thành công!`, DURATION);

            // Tải lại danh sách sách chưa trả bên trong modal
            fetchUnreturnedBooks();

            // Nếu đây là sách cuối cùng, tự động đóng modal và gọi onSuccess để trang cha tải lại
            if (unreturnedBooks.length === 1) {
                onSuccess();
            }

        } catch (error) {
            // Lỗi API đã được interceptor xử lý
            console.error("Return book failed", error);
            message.error( error.response.data.message || error.response.data.error ||"Return book failed", DURATION);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (masach, newStatus) => {
        setUnreturnedBooks(currentBooks =>
            currentBooks.map(book =>
                book.masach === masach ? { ...book, tinhTrangTra: newStatus } : book
            )
        );
    };

    const columns = [
        { title: 'Mã Sách', dataIndex: 'masach', key: 'masach' },
        { title: 'Tên Sách', dataIndex: 'tensach', key: 'tensach' },
        {
            title: 'Tình trạng khi trả',
            key: 'status',
            render: (_, record) => (
                <Select defaultValue="Tốt" style={{ width: 120 }} onChange={(value) => handleStatusChange(record.masach, value)}>
                    <Select.Option value="Tốt">Tốt</Select.Option>
                    <Select.Option value="Hỏng">Hỏng</Select.Option>
                    <Select.Option value="Mất">Mất</Select.Option>
                </Select>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title={`Bạn chắc chắn muốn trả cuốn sách "${record.tensach}"?`}
                    onConfirm={() => handleReturn(record)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button type="primary">Trả sách này</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <Modal
            title={`Trả sách cho Phiếu Mượn #${ticketId}`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onSuccess}>
                    Hoàn tất
                </Button>,
            ]}
            width={800}
        >
            <Spin spinning={loading}>
                <Descriptions column={1} bordered style={{ marginBottom: 16 }}>
                    <Descriptions.Item label="Nhân viên nhận sách">
                        {user?.hoTenDayDu}
                    </Descriptions.Item>
                </Descriptions>

                <Table
                    columns={columns}
                    dataSource={unreturnedBooks}
                    rowKey="masach"
                    pagination={false}
                    bordered
                    size="small"
                    locale={{ emptyText: <Empty description="Tất cả sách trong phiếu này đã được trả." /> }}
                />
            </Spin>
        </Modal>
    );
};

export default ReturnBookModal;