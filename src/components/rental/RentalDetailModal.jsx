import React, { useEffect, useState } from 'react';
import {Modal, Spin, Table, Tag, Typography, Descriptions, Empty, Button , App} from 'antd';
import { getRentalDetail } from '../../services/rentalService';
import { formatDate } from '../../utils/helpers';

const { Title } = Typography;

const RentalDetailModal = ({ visible, onCancel, ticketId }) => {
    const [loading, setLoading] = useState(true);
    const [rentalData, setRentalData] = useState(null);
    const { message } = App.useApp();
    const DURATION = 3;

    useEffect(() => {
        if (visible && ticketId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const response = await getRentalDetail(ticketId);
                    // Backend trả về 2 result set, chúng ta cần gộp lại
                    // Giả định API của bạn trả về một object có dạng: { ticketInfo: {...}, bookList: [...] }
                    // Nếu không, bạn cần điều chỉnh service và controller để trả về cấu trúc này
                    // Tạm thời, tôi sẽ giả định `getRentalDetail` trả về object có đủ thông tin
                    setRentalData(response.data);
                    console.log("date" ,response.data )
                } catch (error) {
                    console.error("fetchDetails error:", error);
                    message.error( error.response.data.message || error.response.data.error ||"fetchDetails error:", DURATION);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [visible, ticketId]);

    const bookColumns = [
        { title: 'Mã Sách', dataIndex: 'masach', key: 'masach' },
        { title: 'Tên Sách', dataIndex: 'tensach', key: 'tensach' },
        {
            title: 'Trạng Thái Trả',
            dataIndex: 'daTra',
            key: 'daTra',
            render: (daTra) => daTra ? <Tag color="success">Đã trả</Tag> : <Tag color="error">Chưa trả</Tag>
        },
        {
            title: 'Ngày Trả',
            dataIndex: 'ngaytra',
            key: 'ngaytra',
            render: (date) => date ? new Date(date).toLocaleString('vi-VN') : 'N/A'
        },
        { title: 'Nhân Viên Nhận', dataIndex: 'nhanVienNhanSach', key: 'nhanVienNhanSach', render: (name) => name || 'N/A' },
    ];

    return (
        <Modal
            title={`Chi tiết Phiếu Mượn #${ticketId}`}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Đóng
                </Button>,
            ]}
            width={800}
        >
            <Spin spinning={loading}>
                {rentalData ? (
                    <div>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Mã Phiếu">{rentalData.maphieu}</Descriptions.Item>
                            <Descriptions.Item label="Độc Giả">{rentalData.tendocgia}</Descriptions.Item>
                            <Descriptions.Item label="Ngày Mượn">{new Date(rentalData.ngaymuon).toLocaleString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Hình Thức">{rentalData.hinhthuc === 1 ? 'Mượn về nhà' : 'Mượn tại chỗ'}</Descriptions.Item>
                            <Descriptions.Item label="Nhân Viên Lập Phiếu" span={2}>{rentalData.tennv}</Descriptions.Item>
                        </Descriptions>

                        <Title level={5} style={{ marginTop: 24 }}>Danh sách sách</Title>
                        <Table
                            columns={bookColumns}
                            dataSource={rentalData.danhSachSach}
                            rowKey="masach"
                            pagination={false}
                            bordered
                            size="small"
                        />
                    </div>
                ) : (
                    !loading && <Empty description="Không thể tải chi tiết phiếu mượn." />
                )}
            </Spin>
        </Modal>
    );
};

export default RentalDetailModal;