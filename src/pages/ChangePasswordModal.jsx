import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import {changePassword} from "../services/authService.js";

const ChangePasswordModal = ({ visible, onCancel }) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await changePassword(values);
            message.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            onCancel(true); // Truyền true để báo hiệu cần logout
        } catch (error) {
            // Lỗi đã được interceptor xử lý và hiển thị
            console.error("Change password failed:", error);
        }
    };

    return (
        <Modal
            title="Đổi mật khẩu"
            open={visible}
            onOk={handleOk}
            onCancel={() => onCancel(false)}
            okText="Lưu thay đổi"
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="oldPassword"
                    label="Mật khẩu cũ"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="Mật khẩu mới"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;