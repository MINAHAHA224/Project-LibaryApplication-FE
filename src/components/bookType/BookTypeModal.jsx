// src/components/bookType/BookTypeModal.jsx (Tạo thư mục mới)
import React, { useEffect } from 'react';
import {Modal, Form, Input, message, App} from 'antd';

const BookTypeModal = ({ visible, onCancel, onSave, initialData }) => {
    const [form] = Form.useForm();
    const isEditing = !!initialData;
    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION
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
                // Trim tất cả chuỗi trước khi gửi
                const trimmedValues = Object.fromEntries(
                    Object.entries(values).map(([key, value]) => [
                        key,
                        typeof value === 'string' ? value.trim() : value
                    ])
                );
                onSave(trimmedValues);
            })
            .catch(() => message.error('Vui lòng kiểm tra thông tin.' , DURATION));
    };

    return (
        <Modal
            title={isEditing ? "Cập nhật Thể loại" : "Thêm Thể loại mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="id" label="Mã Thể loại" rules={[{ required: true,whitespace: true , message: 'Mã thể loại không được vượt quá 10 ký tự' },
                    {
                        max: 10,
                        message: 'Mã thể loại phải đúng 10 ký tự',
                    },

                ]}>
                    <Input  />
                </Form.Item>
                <Form.Item name="name" label="Tên Thể loại" rules={[
                    { required: true,whitespace: true , message: 'Tên thể loại không được để trống' },
                    {
                        max: 50,
                        message: 'Tên thể loại không được vượt quá 50 ký tự',
                    },
                    ]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookTypeModal;