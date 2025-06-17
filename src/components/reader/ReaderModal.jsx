import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, message } from 'antd';
import dayjs from 'dayjs';

const ReaderModal = ({ visible, onCancel, onSave, initialData }) => {
    const [form] = Form.useForm();
    const isEditing = !!initialData;

    useEffect(() => {
        if (visible) {
            if (isEditing) {
                form.setFieldsValue({
                    ...initialData,
                    gioitinh: initialData.gioitinh === 1, // <<-- SỬA Ở ĐÂY
                    ngaysinh: initialData.ngaysinh ? dayjs(initialData.ngaysinh) : null,
                    ngaylamthe: initialData.ngaylamthe ? dayjs(initialData.ngaylamthe) : null,
                    ngayhethan: initialData.ngayhethan ? dayjs(initialData.ngayhethan) : null,
                });
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
            title={isEditing ? "Cập nhật Độc giả" : "Thêm Độc giả mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText={isEditing ? "Cập nhật" : "Thêm"}
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="hodg" label="Họ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="tendg" label="Tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="emaildg" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="socmnd" label="Số CMND/CCCD" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="gioitinh" label="Giới tính" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value={true}>Nam</Radio>
                        <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="ngaysinh" label="Ngày sinh" rules={[{ required: true }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="diachi" label="Địa chỉ" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dienthoai" label="Điện thoại" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="ngaylamthe" label="Ngày làm thẻ" rules={[{ required: true }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="ngayhethan" label="Ngày hết hạn" rules={[{ required: true }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="hoatdong" label="Trạng thái" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value={true}>Hoạt động</Select.Option>
                        <Select.Option value={false}>Khóa</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReaderModal;