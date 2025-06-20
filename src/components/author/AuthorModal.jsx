import React, { useEffect } from 'react';
import { Modal, Form, Input, App } from 'antd';

const AuthorModal = ({ visible, onCancel, onSave, initialData }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION
    const isEditing = !!initialData;

    useEffect(() => {
        if (visible) {
            if (isEditing) {
                form.setFieldsValue(initialData);
            } else {
                form.resetFields();
            }
        }
    }, [initialData, visible, form, isEditing]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onSave(values);
            })
            .catch(() => {
                message.error('Vui lòng kiểm tra lại  thông tin.' , DURATION);
            });
    };

    return (
        <Modal
            title={isEditing ? "Cập nhật Tác giả" : "Thêm Tác giả mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText={isEditing ? "Cập nhật" : "Thêm"}
            cancelText="Hủy"
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="hoTenTg"
                    label="Họ tên Tác giả"
                    rules={[{ required: true, whitespace :true, message: 'Vui lòng nhập họ tên tác giả!' }
                        ,{
                            max: 50,
                            message: 'Họ tên Tác giả không được vượt quá 50 ký tự',
                        },]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="diaChiTg"
                    label="Địa chỉ"
                    rules={[{ required: true, whitespace :true, message: 'Vui lòng nhập địa chỉ!' }
                        ,{
                            max: 100,
                            message: 'Địa chỉ không được vượt quá 100 ký tự',
                        },]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    name="dienThoaiTg"
                    label="Điện thoại"
                    rules={[
                        { required: true, whitespace :true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^(0\d{9}|\+84\d{9})$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AuthorModal;