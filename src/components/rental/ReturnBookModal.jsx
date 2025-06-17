import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Spin, Table, Select, Button, message, App as AntdApp, Popconfirm, Empty, Form } from 'antd';
import { getRentalDetail } from '../../services/rentalService'; // Dùng để lấy danh sách sách
import { returnBook } from '../../services/rentalService';     // Dùng để gọi API trả sách
import { getStaffList } from '../../services/rentalService';

const ReturnBookModal = ({ visible, onCancel, onSuccess, ticketId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [staffList, setStaffList] = useState([]);
    const [unreturnedBooks, setUnreturnedBooks] = useState([]);
    const { message: messageApi } = AntdApp.useApp();

    const fetchUnreturnedBooks = useCallback(async () => {
        if (!ticketId) return;
        setLoading(true);
        try {
            const [detailRes, staffRes] = await Promise.all([
                getRentalDetail(ticketId),
                getStaffList()
            ]);

            // Lọc ra những sách chưa trả (DaTra = false hoặc null)
            console.log("Danh sach sach",detailRes.data.danhSachSach)
            const booksToReturn = detailRes.data.danhSachSach.filter(book => !book.daTra);
            setUnreturnedBooks(booksToReturn);
            setStaffList(staffRes.data);
        } catch (error) {
            messageApi.error("Lỗi khi tải danh sách sách cần trả.");
        } finally {
            setLoading(false);
        }
    }, [ticketId, messageApi]);

    useEffect(() => {
        if (visible) {
            fetchUnreturnedBooks();
        }
    }, [visible, fetchUnreturnedBooks]);

    const handleReturn = async (bookToReturn) => {
        try {
            // Validate form để lấy mã nhân viên
            const values = await form.validateFields();

            setLoading(true);
            const payload = {
                maphieu: ticketId,
                masach: bookToReturn.masach,
                tinhTrang: bookToReturn.tinhTrangTra || 'Tốt', // Lấy tình trạng từ state của sách, mặc định là Tốt
                maNV: values.maNV,
            };

            await returnBook(payload);
            messageApi.success(`Trả sách "${bookToReturn.tensach}" thành công!`);

            // Sau khi trả thành công, tải lại danh sách sách chưa trả
            fetchUnreturnedBooks();

            // Nếu đây là sách cuối cùng, tự động đóng modal và gọi onSuccess
            if (unreturnedBooks.length === 1) {
                onSuccess();
            }

        } catch (error) {
            // Lỗi validation hoặc lỗi API đã được xử lý
            console.error("Return book failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật trạng thái trả của sách trong state tạm thời
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
                    title={`Bạn chắc chắn muốn trả sách này?`}
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
                <Button key="close" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
            width={800}
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="maNV"
                        label="Nhân viên nhận sách"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
                    >
                        <Select placeholder="Chọn nhân viên thực hiện">
                            {staffList.map(nv => <Select.Option key={nv.manv} value={nv.manv}>{nv.tennv}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
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