import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Select, DatePicker, Table, Card, Row, Col,
    Space, message, Popconfirm, Divider, Typography, Empty, Tag , Modal
} from 'antd';
import {UserOutlined, BookOutlined, SearchOutlined, WarningOutlined, FileExcelOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    getNewTicketId, getStaffList, getActiveReader, getAvailableBook,
    getRentalHistory, createRental, getRentalDetail
} from '../services/rentalService';
import ReturnBookModal from '../components/rental/ReturnBookModal'; // Component mới
import RentalDetailModal from '../components/rental/RentalDetailModal'; // Component mới
import { formatDate } from '../utils/helpers';
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
import { useNavigate } from 'react-router-dom';
import Search from "antd/es/input/Search.js";
const RentalPage = () => {
    const [form] = Form.useForm();
    const [staffList, setStaffList] = useState([]);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [loading, setLoading] = useState({ form: false, history: true });
    const navigate = useNavigate();
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reportDates, setReportDates] = useState([]);
    const [readerInfo, setReaderInfo] = useState(null);
    const [rentingBooks, setRentingBooks] = useState([]);


    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    // --- EFFECTS ---
    useEffect(() => {
        // Tải dữ liệu ban đầu cho form và lịch sử
        loadInitialData();
    }, []);


    const handleViewDetails = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsDetailModalVisible(true);
    };

    const handleOpenReturnModal = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsReturnModalVisible(true);
    };


    const loadInitialData = async () => {
        setLoading({ form: true, history: true });
        try {
            const [ticketRes, staffRes, historyRes] = await Promise.all([
                getNewTicketId(),
                getStaffList(),
                getRentalHistory()
            ]);
            form.setFieldsValue({
                maphieu: ticketRes.data.newTicketId,
                ngaymuon: dayjs(),
            });
            setStaffList(staffRes.data);
            setRentalHistory(historyRes.data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu ban đầu.");
        } finally {
            setLoading({ form: false, history: false });
        }
    };

    // --- HANDLERS ---
    const handleSearchReader = async () => {
        const readerId = form.getFieldValue('madg');
        if (!readerId) {
            message.warning('Vui lòng nhập mã độc giả.');
            return;
        }
        setLoading(p => ({ ...p, form: true }));
        try {
            const res = await getActiveReader(readerId);
            if (res.data && res.data.hoten) {
                if (res.data.hoatdong === 0) {
                    message.error('Thẻ độc giả này đã bị khóa!');
                    setReaderInfo(null);
                } else if (new Date(res.data.ngayhethan) < new Date()) {
                    message.error('Thẻ độc giả đã hết hạn!');
                    setReaderInfo(null);
                }
                else {
                    setReaderInfo(res.data);
                }
            } else {
                message.error('Không tìm thấy độc giả hoặc thẻ đã bị khóa.');
                setReaderInfo(null);
            }
        } catch (error) {
            message.error('Lỗi khi tìm độc giả.');
            setReaderInfo(null);
        } finally {
            setLoading(p => ({ ...p, form: false }));
        }
    };

    const handleAddBook = async () => {
        const bookId = form.getFieldValue('masach');
        if (!bookId) {
            message.warning('Vui lòng nhập mã sách.');
            return;
        }
        if(rentingBooks.length >= 3){
            message.warning('Chỉ được mượn tối đa 3 cuốn sách.');
            return;
        }
        if (rentingBooks.some(b => b.masach === bookId)) {
            message.warning('Sách này đã có trong danh sách mượn.');
            return;
        }

        setLoading(p => ({...p, form: true}));
        try {
            const res = await getAvailableBook(bookId);
            if(res.data && res.data.masach) {
                if(res.data.tinhtrang === 0) {
                    message.error(`Sách "${res.data.tensach}" đã được thanh lý, không thể mượn.`);
                } else if(res.data.chomuon === 1) {
                    message.error(`Sách "${res.data.tensach}" hiện đang được mượn.`);
                } else {
                    setRentingBooks(prev => [...prev, res.data]);
                    form.setFieldsValue({ masach: '' });
                }
            } else {
                message.error('Không tìm thấy sách hoặc sách không có sẵn.');
            }
        } catch (error) {
            message.error('Lỗi khi tìm sách.');
        } finally {
            setLoading(p => ({...p, form: false}));
        }
    };

    const handleRemoveBook = (bookId) => {
        setRentingBooks(prev => prev.filter(b => b.masach !== bookId));
    };

    const handleResetForm = () => {
        form.resetFields();
        setReaderInfo(null);
        setRentingBooks([]);
        getNewTicketId().then(res => form.setFieldsValue({ maphieu: res.data.newTicketId, ngaymuon: dayjs() }));
    };
    const showMostBorrowedReportModal = () => {
        setIsReportModalVisible(true);
    };

    const handleGenerateMostBorrowedReport = () => {
        if (!reportDates || reportDates.length !== 2) {
            message.warning("Vui lòng chọn khoảng thời gian.");
            return;
        }
        const [tuNgay, denNgay] = reportDates;
        // Chuyển hướng đến trang xem trước với tham số trên URL
        navigate(`/rentals/reports/most-borrowed/preview?tuNgay=${tuNgay.format('YYYY-MM-DD')}&denNgay=${denNgay.format('YYYY-MM-DD')}`);
        setIsReportModalVisible(false);
    };

    const onFinish = async (values) => {
        if(!readerInfo) {
            message.error('Vui lòng chọn độc giả hợp lệ.');
            return;
        }
        if(rentingBooks.length === 0) {
            message.error('Vui lòng thêm ít nhất một cuốn sách để mượn.');
            return;
        }
        const payload = {
            maphieu: values.maphieu,
            madg: values.madg,
            ngaymuon: values.ngaymuon.format('YYYY-MM-DD'),
            hinhthuc: values.hinhthuc,
            manv: values.manv,
            danhSachSach: rentingBooks.map(b => b.masach)
        };

        setLoading({ form: true, history: true });
        try {
            const res = await createRental(payload);
            message.success(res.data.message || 'Lập phiếu mượn thành công!');
            handleResetForm();
            loadInitialData(); // Tải lại toàn bộ
        } catch (error) {
            message.error(error.response?.data?.error || 'Lỗi khi lập phiếu mượn.');
        } finally {
            setLoading({ form: false, history: false });
        }
    };


    const bookColumns = [
        { title: 'Mã Sách', dataIndex: 'masach', key: 'masach' },
        { title: 'Tên Sách', dataIndex: 'tensach', key: 'tensach' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Popconfirm title="Xóa sách này?" onConfirm={() => handleRemoveBook(record.masach)}>
                    <Button type="link" danger>Xóa</Button>
                </Popconfirm>
            ),
        },
    ];

    const historyColumns = [
        { title: 'Mã Phiếu', dataIndex: 'maphieu', key: 'maphieu' },
        { title: 'Độc Giả', dataIndex: 'tendocgia', key: 'tendocgia' },
        { title: 'Ngày Mượn', dataIndex: 'ngaymuon', key: 'ngaymuon', render: (text) => formatDate(text) },
        { title: 'Hình Thức', dataIndex: 'hinhthuc', key: 'hinhthuc', render: (ht) => ht === "1" ? <Tag color="blue">Về nhà</Tag> : <Tag color="green">Tại chỗ</Tag> },
        { title: 'Số Sách', dataIndex: 'sosach', key: 'sosach' },
        { title: 'Nhân Viên', dataIndex: 'tennv', key: 'tennv' },
        // Có thể thêm nút xem chi tiết ở đây nếu cần
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleViewDetails(record.maphieu)}>Xem chi tiết</Button>
                    {!record.trangthaitra && (
                        <Button type="link" danger onClick={() => handleOpenReturnModal(record.maphieu)}>Trả sách</Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <Row gutter={[24, 24]}>
            <Col span={8}>
                <Title level={3}>Lập Phiếu Mượn</Title>
                <Card>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Mã Phiếu" name="maphieu">
                            <Input readOnly />
                        </Form.Item>
                        <Form.Item label="Mã Độc Giả" name="madg" rules={[{ required: true }]}>
                            <Input addonAfter={<Button icon={<SearchOutlined />} onClick={handleSearchReader} />} placeholder="Nhập mã và nhấn tìm" />
                        </Form.Item>
                        {readerInfo && (
                            <Card size="small" style={{ marginBottom: 16 }}>
                                <Text strong>{readerInfo.hoten}</Text><br/>
                                <Text type="secondary">Thẻ hết hạn: {formatDate(readerInfo.ngayhethan)}</Text>
                            </Card>
                        )}
                        <Form.Item label="Mã Sách" name="masach">
                            <Input addonAfter={<Button icon={<SearchOutlined />} onClick={handleAddBook} />} placeholder="Nhập mã sách và nhấn tìm" />
                        </Form.Item>
                        <Table
                            columns={bookColumns}
                            dataSource={rentingBooks}
                            rowKey="masach"
                            pagination={false}
                            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có sách nào" /> }}
                            size="small"
                        />
                        <Divider />
                        <Form.Item label="Hình Thức Mượn" name="hinhthuc" initialValue="1" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="1">Mượn về nhà</Select.Option>
                                <Select.Option value="0">Mượn tại chỗ</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ngày Mượn" name="ngaymuon" rules={[{ required: true }]}>
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Nhân Viên" name="manv" rules={[{ required: true }]}>
                            <Select placeholder="Chọn nhân viên">
                                {staffList.map(nv => <Select.Option key={nv.manv} value={nv.manv}>{nv.tennv}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading.form}>Lập Phiếu</Button>
                            <Button onClick={handleResetForm}>Hủy</Button>
                        </Space>
                    </Form>
                </Card>
            </Col>
            <Col span={16}>
                <Title level={3}>Lịch sử Mượn Sách</Title>
                <Space>
                    <Button icon={<WarningOutlined />} onClick={() => navigate('/rentals/reports/overdue/preview')} danger>BC Sách Quá Hạn</Button>
                    {/* NÚT MỚI */}
                    <Button icon={<FileExcelOutlined />} onClick={showMostBorrowedReportModal}>BC Sách Mượn Nhiều</Button>
                    <Search/>
                </Space>
                <Table
                    columns={historyColumns}
                    dataSource={rentalHistory}
                    rowKey="maphieu"
                    loading={loading.history}
                    bordered
                />
            </Col>
            {isDetailModalVisible && (
                <RentalDetailModal
                    visible={isDetailModalVisible}
                    onCancel={() => setIsDetailModalVisible(false)}
                    ticketId={selectedTicketId}
                />
            )}

            {isReturnModalVisible && (
                <ReturnBookModal
                    visible={isReturnModalVisible}
                    onCancel={() => setIsReturnModalVisible(false)}
                    onSuccess={() => {
                        setIsReturnModalVisible(false);
                        loadInitialData(); // Tải lại lịch sử sau khi trả thành công
                    }}
                    ticketId={selectedTicketId}
                />
            )}
            {/* Modal chọn ngày cho báo cáo */}
            <Modal
                title="Chọn khoảng thời gian cho báo cáo"
                open={isReportModalVisible}
                onOk={handleGenerateMostBorrowedReport}
                onCancel={() => setIsReportModalVisible(false)}
                okText="Xem báo cáo"
                cancelText="Hủy"
            >
                <p>Vui lòng chọn ngày bắt đầu và ngày kết thúc:</p>
                <RangePicker
                    style={{ width: '100%' }}
                    onChange={(dates) => setReportDates(dates)}
                    format="DD/MM/YYYY"
                />
            </Modal>
        </Row>
    );
};

export default RentalPage;