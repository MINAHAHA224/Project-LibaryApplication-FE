// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Form, Select, Input, Button, Card, Spin, App as AntdApp, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCreatedLogins, resetPasswordForUser } from '../services/passwordService';

const { Option, OptGroup } = Select;
const { Title } = Typography;

const ResetPasswordPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();

    const DURATION = 3;

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const res = await getCreatedLogins();
                setAccounts(res.data);
            } catch (error) {
                console.log("fetchAccounts" ,error);
                message.error( error.response.data.message || error.response.data.error ||"fetchAccounts error:", DURATION);


            }
            finally { setLoading(false); }
        };
        fetchAccounts();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await resetPasswordForUser(values);
            message.success(`Đổi mật khẩu cho tài khoản ${values.loginName} thành công!`);
            form.resetFields();
        } catch (error) {

            console.log("Đổi mật khẩu cho tài khoản " ,error);
            message.error( error.response.data.message || error.response.data.error ||"Đổi mật khẩu cho tài khoản error:", DURATION);

        }
        finally { setLoading(false); }
    };

    // Gom nhóm tài khoản để hiển thị trong Select
    const groupedAccounts = useMemo(() => {
        const staff = accounts.filter(acc => acc.userType === 'NHANVIEN');
        const reader = accounts.filter(acc => acc.userType === 'DOCGIA');
        return { staff, reader };
    }, [accounts]);

    return (
        <Spin spinning={loading}>
            <Card title={<Title level={3}>Đổi mật khẩu người dùng</Title>} style={{ maxWidth: 600, margin: 'auto' }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="loginName" label="Họ tên nhân viên / độc giả" rules={[{ required: true, message: 'Vui lòng chọn một tài khoản!' }]}>
                        <Select showSearch placeholder="Chọn tài khoản để đổi mật khẩu..." optionFilterProp="label">
                            <OptGroup label="Nhân Viên">
                                {groupedAccounts.staff.map(acc => (
                                    <Option key={acc.loginName} value={acc.loginName} label={acc.fullName}>
                                        {acc.fullName} ({acc.loginName})
                                    </Option>
                                ))}
                            </OptGroup>
                            <OptGroup label="Độc Giả">
                                {groupedAccounts.reader.map(acc => (
                                    <Option key={acc.loginName} value={acc.loginName} label={acc.fullName}>
                                        {acc.fullName} ({acc.loginName})
                                    </Option>
                                ))}
                            </OptGroup>
                        </Select>
                    </Form.Item>
                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" dependencies={['newPassword']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) { return Promise.resolve(); } return Promise.reject(new Error('Mật khẩu xác nhận không khớp!')); } })]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Đồng ý</Button>
                            <Button onClick={() => navigate(-1)}>Thoát</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </Spin>
    );
};

export default ResetPasswordPage;