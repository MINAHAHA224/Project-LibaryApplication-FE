import React, { useEffect } from 'react';
import { Modal, Form, Input, Radio, message } from 'antd';

const StaffModal = ({ visible, onCancel, onSave, initialData }) => {
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
            .then(values => {
                onSave(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
            });
    };

    return (
        <Modal
            title={isEditing ? "Cập nhật Nhân viên" : "Thêm Nhân viên mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText={isEditing ? "Cập nhật" : "Thêm"}
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="hoNV" label="Họ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="tenNV" label="Tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email phải có định dạng hợp lệ và thuộc domain @ptithcm.edu.vn', pattern: /^[a-zA-Z0-9._%+-]+@ptithcm\.edu\.vn$/ }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value={true}>Nam</Radio>
                        <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dienThoai" label="Điện thoại" rules={[{ required: true, message: 'Số điện thoại không hợp lệ', pattern: /^(0\d{9}|\+84\d{9})$/ }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StaffModal;