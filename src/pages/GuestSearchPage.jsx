import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spin, Input, Typography, Image, Tag, App } from 'antd';
import { getPublicBookTitles } from '../services/publicService';
import { formatDate } from '../utils/helpers';
import BookSubTable from '../components/bookTitle/BookSubTable';
import './GuestSearchPage.css'; // Tạo file CSS riêng cho đẹp

const { Search } = Input;
const { Title } = Typography;

const GuestSearchPage = () => {
    const [bookTitles, setBookTitles] = useState([]);
    const [filteredBookTitles, setFilteredBookTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { message } = App.useApp();
    const DURATION = 3;

    const fetchBookTitles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPublicBookTitles();
            setBookTitles(response.data);
            setFilteredBookTitles(response.data);
        } catch (error) {
            message.error("Không thể tải danh sách đầu sách. Vui lòng thử lại sau.", DURATION);
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchBookTitles();
    }, [fetchBookTitles]);

    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredBookTitles(bookTitles);
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

    const columns = [
        {
            title: 'Ảnh bìa', dataIndex: 'picturePath', key: 'picturePath', width: 100,
            render: (path) => <Image width={80} src={`http://localhost:8080/dausach/${path}`} fallback="/images/fallback.png" />
        },
        { title: 'ISBN', dataIndex: 'codeBookTitle', key: 'codeBookTitle', width: 150, sorter: (a, b) => a.codeBookTitle.localeCompare(b.codeBookTitle) },
        { title: 'Tên Sách', dataIndex: 'nameBook', key: 'nameBook', sorter: (a, b) => a.nameBook.localeCompare(b.nameBook) },
        { title: 'Tác Giả', dataIndex: 'nameAuthor', key: 'nameAuthor' },
        { title: 'Ngày XB', dataIndex: 'dateRelease', key: 'dateRelease', render: (text) => formatDate(text), sorter: (a, b) => new Date(a.dateRelease) - new Date(b.dateRelease) },
        { title: 'Thể loại', dataIndex: 'nameCodeType', key: 'nameCodeType', render: (type) => <Tag color="blue">{type}</Tag> },
    ];

    return (
        <div className="guest-page-container">
            <header className="guest-header">
                <Title level={2} style={{ margin: 0, color: '#fff' }}>Hệ thống Tra cứu Thư viện</Title>
            </header>
            <main className="guest-content">
                <div style={{ marginBottom: 16, background: '#fff', padding: '16px 24px', borderRadius: '8px' }}>
                    <Search
                        placeholder="Tìm kiếm theo ISBN, tên sách, tác giả, thể loại..."
                        onSearch={handleSearch}
                        allowClear
                        enterButton="Tìm kiếm"
                        size="large"
                    />
                </div>

                <Spin spinning={loading}>
                    <Table
                        dataSource={filteredBookTitles}
                        columns={columns}
                        rowKey="codeBookTitle"
                        bordered
                        expandable={{
                            expandedRowRender: (record) => (
                                <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                        Danh sách Sách của Đầu sách: {record.nameBook}
                                    </p>
                                    <BookSubTable isbn={record.codeBookTitle} isGuest={true} />
                                </div>
                            ),
                        }}
                    />
                </Spin>
            </main>
        </div>
    );
};

export default GuestSearchPage;