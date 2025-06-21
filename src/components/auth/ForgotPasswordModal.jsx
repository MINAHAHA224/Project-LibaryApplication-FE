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
            Modal.info({
                title: 'Vui lòng kiểm tra email',
                content: 'Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu tới email của bạn. Vui lòng kiểm tra trong vài giây...',
                centered: true,
                okButtonProps: { style: { display: 'none' } }, // Ẩn nút OK
            });
            // message.success(response.data.message , DURATION);
            // onCancel(); // Đóng modal sau khi thành công

            // Đợi 3 giây rồi tự đóng modal và gọi onCancel
            setTimeout(() => {
                Modal.destroyAll(); // Đóng modal chờ
                onCancel();         // Đóng modal chính (nếu khác)
            }, 3000);
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