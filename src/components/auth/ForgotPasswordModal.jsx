// src/components/auth/ForgotPasswordModal.jsx
import React from 'react';
import {Modal, Form, Input, message, App as AntdApp, App} from 'antd';
import { forgotPassword } from '../../services/authService'; // Tạo hàm này

const ForgotPasswordModal = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const DURATION = 3;

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await forgotPassword(values);
            message.success(response.data.message , DURATION);
            onCancel(); // Đóng modal sau khi thành công
        } catch (error) {
            console.error("Forgot password failed:", error);
            message.error( error.response.data.message || error.response.data.error ||"handleOk error:", DURATION);


        }
    };

    return (
        <Modal title="Quên Mật khẩu" open={visible} onOk={handleOk} onCancel={onCancel} okText="Gửi yêu cầu" cancelText="Hủy">
            <Form form={form} layout="vertical">
                <p>Vui lòng nhập tên đăng nhập của bạn. Mật khẩu mới sẽ được gửi về email đã đăng ký.</p>
                <Form.Item name="loginName" label="Tên đăng nhập" rules={[{ required: true , whitespace : true , message : 'Tên đăng nhập không được để trống' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default ForgotPasswordModal;