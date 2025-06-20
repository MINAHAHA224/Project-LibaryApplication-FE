// src/pages/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space } from 'antd';
import { LoginOutlined, ReadOutlined } from '@ant-design/icons';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <Card className="portal-card">
                <Title level={2} style={{ textAlign: 'center' }}>Chào mừng đến với Thư viện</Title>
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 30 }}>
                    Vui lòng chọn vai trò của bạn để tiếp tục.
                </Text>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<LoginOutlined />}
                        onClick={() => navigate('/login/staff')}
                    >
                        Đăng nhập cho Thủ thư
                    </Button>
                    <Button
                        size="large"
                        block
                        icon={<ReadOutlined />}
                        onClick={() => navigate('/guest/search')}
                    >
                        Tra cứu sách (Dành cho Độc giả)
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default LoginPage;