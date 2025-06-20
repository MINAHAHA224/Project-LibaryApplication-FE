import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Form, Input, Button, Card, Spin, message ,Typography , App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './StaffLoginPage.css'; // Sẽ tạo file CSS này
const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { message } = App.useApp();
    const DURATION = 3;

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await login(values.username, values.password);
            message.success('Đăng nhập thành công!');
            navigate('/'); // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
        } catch (error) {
            // Hiển thị thông báo lỗi từ server hoặc lỗi chung
            console.log("Login error:", error);
            message.error( error.response.data.message || error.response.data.error ||"Login error:", DURATION);


        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card title="Đăng nhập Hệ thống Thư viện" className="login-card">
                <Spin spinning={loading}>
                    <Form
                        name="normal_login"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Tài khoản" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" block>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default LoginPage;