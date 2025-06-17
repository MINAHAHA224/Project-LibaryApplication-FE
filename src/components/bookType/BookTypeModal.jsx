// src/components/bookType/BookTypeModal.jsx (Tạo thư mục mới)
import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';

const BookTypeModal = ({ visible, onCancel, onSave, initialData }) => {
    const [form] = Form.useForm();
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
            .then(values => onSave(values))
            .catch(() => message.error('Vui lòng điền đủ thông tin.'));
    };

    return (
        <Modal
            title={isEditing ? "Cập nhật Thể loại" : "Thêm Thể loại mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="id" label="Mã Thể loại" rules={[{ required: true }]}>
                    <Input  />
                </Form.Item>
                <Form.Item name="name" label="Tên Thể loại" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookTypeModal;