import React, { useState, useEffect } from 'react';
import {
    Form, Input, Button, Select, DatePicker, Table, Card, Row, Col,
    Space, message, Popconfirm, Divider, Typography, Empty, Tag , Modal , App
} from 'antd';
import {UserOutlined, BookOutlined, SearchOutlined, WarningOutlined, FileExcelOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    getNewTicketId, getStaffList, getAllActiveReaders, getAllAvailableBooks,
    getRentalHistory, createRental, getRentalDetail
} from '../services/rentalService';
import ReturnBookModal from '../components/rental/ReturnBookModal'; // Component mới
import RentalDetailModal from '../components/rental/RentalDetailModal'; // Component mới
import { formatDate } from '../utils/helpers';
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
import { useNavigate } from 'react-router-dom';
import Search from "antd/es/input/Search.js";
import { useAuth } from '../contexts/AuthContext'; // Import useAuth để lấy thông tin user

const RentalPage = () => {
    const { user } = useAuth(); // Lấy thông tin user từ context
    const [form] = Form.useForm();
    const [staffList, setStaffList] = useState([]);
    const [rentalHistory, setRentalHistory] = useState([]);
    const navigate = useNavigate();
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reportDates, setReportDates] = useState([]);
    const [readerInfo, setReaderInfo] = useState(null);
    const [rentingBooks, setRentingBooks] = useState([]);

    const [activeReaders, setActiveReaders] = useState([]); // <<-- State mới
    const [availableBooks, setAvailableBooks] = useState([]); // <<-- State mới
    const [loading, setLoading] = useState({ form: true, history: true, books: true , readers: true }); // Thêm books loading

    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const { message } = App.useApp();
    const DURATION = 3;
    const [filteredHistory, setFilteredHistory] = useState([]); // <<-- State mới cho bảng lịch sử

    // --- EFFECTS ---
    useEffect(() => {
        // Tải dữ liệu ban đầu cho form và lịch sử
        loadInitialData();
        if (user) {
            form.setFieldsValue({ manv: user.maNV });
        }
    }, [user, form]);


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
            const [ticketRes, staffRes, historyRes,availableBooksRes ,activeReadersRes] = await Promise.all([
                getNewTicketId(),
                getStaffList(),
                getRentalHistory(),
                getAllAvailableBooks(),
                getAllActiveReaders()
            ]);
            form.setFieldsValue({
                maphieu: ticketRes.data.newTicketId,
                ngaymuon: dayjs(),
            });
            setStaffList(staffRes.data);
            setRentalHistory(historyRes.data);
            setAvailableBooks(availableBooksRes.data); // <<-- Lưu danh sách sách
            setFilteredHistory(historyRes.data); // <<-- Cập nhật state mới

            setActiveReaders(activeReadersRes.data);
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu ban đầu.");
            message.error( error.response.data.message || error.response.data.error ||"loadInitialData error:", DURATION);
        } finally {
            setLoading({ form: false, history: false ,books: false  ,readers: false});
        }
    };

    const handleSearchHistory = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredHistory(rentalHistory);
            return;
        }
        const filtered = rentalHistory.filter(item =>
            item.maphieu.toString().includes(lowercasedValue) ||
            item.tendocgia.toLowerCase().includes(lowercasedValue) ||
            item.tennv.toLowerCase().includes(lowercasedValue)
        );
        setFilteredHistory(filtered);
    };

    // --- HANDLERS ---
// === HÀM CHỌN ĐỘC GIẢ MỚI ===
    const handleSelectReader = async (readerId) => {
        if (!readerId) {
            setReaderInfo(null);
            return;
        }
        // Thông tin chi tiết hơn có thể không cần gọi lại API
        // vì chúng ta có thể đã có đủ từ danh sách, nhưng để chắc chắn, ta vẫn có thể gọi API chi tiết
        // Hoặc đơn giản là hiển thị thông tin đã có
        const selectedReader = activeReaders.find(r => r.madg === readerId);


        if (selectedReader) {
            // Hiển thị thông tin cơ bản
            setReaderInfo({
                madg: selectedReader.madg,
                hoten: `${selectedReader.hodg} ${selectedReader.tendg}`,
                // Thêm các thông tin khác nếu cần, ví dụ ngày hết hạn
            });
        }
    };
    // === HÀM THÊM SÁCH MỚI (DÙNG CHO SELECT) ===
    // const handleSelectBook = (bookId) => {
    //     if (!bookId) return;
    //
    //     // Các kiểm tra logic vẫn giữ nguyên
    //     if (rentingBooks.length >= 3) {
    //         message.warning('Chỉ được mượn tối đa 3 cuốn sách.');
    //
    //         return;
    //     }
    //     if (rentingBooks.some(b => b.masach === bookId)) {
    //         message.warning('Sách này đã có trong danh sách mượn.');
    //         return;
    //     }
    //
    //     // Tìm thông tin sách trong danh sách đã tải về
    //     const selectedBook = availableBooks.find(b => b.masach === bookId);
    //     if (selectedBook) {
    //         setRentingBooks(prev => [...prev, selectedBook]);
    //         // Xóa giá trị đã chọn khỏi ô Select để người dùng có thể chọn tiếp
    //         form.setFieldsValue({ masach: null });
    //     }
    //
    // };

    const handleSelectBook = (bookId) => {
        if (!bookId) {
            return;
        }

        if (rentingBooks.length >= 3) {
            message.warning('Chỉ được mượn tối đa 3 cuốn sách.');
            form.setFieldsValue({ masach: null }); // Reset ô select
            return;
        }

        if (rentingBooks.some(b => b.masach === bookId)) {
            message.warning('Sách này đã có trong danh sách mượn.');
            form.setFieldsValue({ masach: null });
            return;
        }

        // Tìm thông tin đầy đủ của sách đã chọn từ state availableBooks
        const selectedBookInfo = availableBooks.find(b => b.masach === bookId);
        if (!selectedBookInfo) {
            message.error('Không tìm thấy thông tin sách đã chọn.');
            form.setFieldsValue({ masach: null });
            return;
        }

        // === LOGIC KIỂM TRA ĐẦU SÁCH MỚI ===
        // Lấy ra danh sách ISBN của các cuốn sách đã có trong giỏ mượn
        const existingIsbnsInCart = rentingBooks.map(book => book.isbn);

        // Kiểm tra xem ISBN của sách mới chọn đã tồn tại trong giỏ chưa
        if (existingIsbnsInCart.includes(selectedBookInfo.isbn)) {
            message.error('Không được mượn 2 cuốn sách có cùng một đầu sách trong một phiếu mượn.');
            form.setFieldsValue({ masach: null });
            return;
        }
        // === KẾT THÚC LOGIC MỚI ===

        // Nếu tất cả kiểm tra đều qua, thêm sách vào danh sách
        setRentingBooks(prev => [...prev, selectedBookInfo]);

        // Xóa giá trị trong ô Select để người dùng có thể tìm và chọn sách khác
        form.setFieldsValue({ masach: null });
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
            manv: user.maNV.toString(),  // <<-- Lấy thẳng maNV từ context, không lấy từ form nữa
            danhSachSach: rentingBooks.map(b => b.masach)
        };

        setLoading({ form: true, history: true });
        try {
            const res = await createRental(payload);
            message.success(res.data.message || 'Lập phiếu mượn thành công!');
            handleResetForm();
            loadInitialData(); // Tải lại toàn bộ
        } catch (error) {

            message.error( error.response.data.message || error.response.data.error ||"Lỗi khi lập phiếu mượn error:", DURATION);

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
                        {/* === THAY THẾ Ô INPUT ĐỘC GIẢ === */}
                        <Form.Item label="Tìm & Chọn Độc Giả" name="madg" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                placeholder="Gõ mã, tên, hoặc CMND độc giả..."
                                onSelect={handleSelectReader}
                                loading={loading.readers}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={activeReaders.map(reader => ({
                                    value: reader.madg,
                                    label: `${reader.hodg} ${reader.tendg} - (Mã: ${reader.madg} - CMND: ${reader.socmnd})`
                                }))}
                                allowClear
                                onChange={(value) => { if (!value) setReaderInfo(null); }} // Xóa thông tin khi clear
                            />
                        </Form.Item>

                        {readerInfo && (
                            <Card size="small" style={{ marginBottom: 16, borderLeft: '3px solid #1890ff' }}>
                                <Text strong>Đang chọn:</Text> {readerInfo.hoten} (Mã: {readerInfo.madg})
                            </Card>
                        )}
                        <Form.Item label="Tìm & Thêm Sách" name="masach">
                            <Select
                                showSearch
                                placeholder="Gõ mã hoặc tên sách để tìm..."
                                onSelect={handleSelectBook} // Gọi hàm khi người dùng chọn một sách
                                loading={loading.books}
                                filterOption={(input, option) =>
                                    // Logic lọc: tìm trong cả value (mã sách) và children (tên sách)
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                // Chuyển đổi danh sách sách thành định dạng options của AntD
                                options={availableBooks.map(book => ({
                                    value: book.masach,
                                    label: `${book.masach} - ${book.tensach}`
                                }))}
                            />
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
                            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }}   disabled   />
                        </Form.Item>
                        {/* === THAY ĐỔI Ô NHÂN VIÊN === */}
                        <Form.Item label="Nhân Viên Lập Phiếu">
                            {/* Trường ẩn để giữ giá trị maNV cho form, không bắt buộc nhưng có thể hữu ích */}

                            {/* Ô Input chỉ đọc để hiển thị tên */}
                            <Input value={user?.hoTenDayDu} readOnly />
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
                    <Search
                        placeholder="Tìm mã phiếu, độc giả, NV..."
                        onSearch={handleSearchHistory}
                        allowClear
                    />
                </Space>
                <Table
                    columns={historyColumns}
                    dataSource={filteredHistory}
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