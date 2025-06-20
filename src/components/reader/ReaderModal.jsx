import React, { useEffect } from 'react';
import {Modal, Form, Input, Select, DatePicker, Radio, message, App} from 'antd';
import dayjs from 'dayjs';

const ReaderModal = ({ visible, onCancel, onSave, initialData }) => {

    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION

    const [form] = Form.useForm();
    const isEditing = !!initialData;

    useEffect(() => {
        if (visible) {
            if (isEditing) {
                form.setFieldsValue({
                    ...initialData,
                    gioitinh: initialData.gioitinh === 1, // <<-- SỬA Ở ĐÂY
                    hoatdong: initialData.hoatdong === 1,
                    ngaysinh: initialData.ngaysinh ? dayjs(initialData.ngaysinh) : null,
                    ngaylamthe: initialData.ngaylamthe ? dayjs(initialData.ngaylamthe) : null,
                    ngayhethan: initialData.ngayhethan ? dayjs(initialData.ngayhethan) : null,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    ngaylamthe: dayjs(), // set mặc định hôm nay
                    ngayhethan: dayjs().add(6, 'month'),     // +3 tháng
                    hoatdong: true,
                });
            }
        }
    }, [initialData, visible, form, isEditing]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                // Trim mọi trường chuỗi
                const trimmedValues = Object.fromEntries(
                    Object.entries(values).map(([key, value]) => [
                        key,
                        typeof value === 'string' ? value.trim() : value
                    ])
                );
                onSave(trimmedValues);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('Vui lòng kiểm tra thông tin.' ,DURATION);
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
                <Form.Item name="hodg" label="Họ" rules={[{ required: true,whitespace: true ,message : 'Họ độc giả không được để trống' },
                    {
                    max: 50,
                    message: 'Họ độc giả không được vượt quá 50 ký tự',
                },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="tendg" label="Tên" rules={[{ required: true ,whitespace: true,message : 'Tên độc giả không được để trống' },
                    {
                    max: 10,
                    message: 'Tên độc giả không được vượt quá 10 ký tự',
                },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="emaildg" label="Email" rules={[{ required: true , type: 'email',message : 'Email không được để trống' },
                    {
                    max: 50,
                    message: 'Email không được vượt quá 50 ký tự',
                },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="socmnd" label="Số CMND/CCCD" rules={[
                    { required: true ,message : 'Số CMND không được để trống'},
                    {
                        max: 15,
                        message: 'Số CMND không được vượt quá 15 ký tự',
                    },
                    {
                        pattern: /^\d{9,12}$/,
                        message: 'CMND/CCCD phải gồm 9 đến 12 chữ số'
                    }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="gioitinh" label="Giới tính" rules={[{ required: true  ,message : 'Giới tính không được để trống'}]}>
                    <Radio.Group>
                        <Radio value={true}>Nam</Radio>
                        <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="ngaysinh" label="Ngày sinh" rules={[
                    { required: true , message : 'Ngày sinh không được để trống' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || value.isBefore(dayjs())) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Ngày sinh phải là ngày trong quá khứ'));
                        },
                    }),
                ]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="diachi" label="Địa chỉ" rules={[{ required: true ,whitespace: true ,message : 'Địa chỉ không được để trống' },
                    {
                    max: 100,
                    message: 'Địa chỉ không được vượt quá 100 ký tự',
                },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dienthoai" label="Điện thoại" rules={[{ required: true  ,whitespace: true ,message : 'Điện thoại không được để trống'},
                    {
                    max: 15,
                    message: 'Điện thoại không được vượt quá 15 ký tự',
                },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="ngaylamthe" label="Ngày làm thẻ" rules={[{ required: true  ,message : 'Ngày làm thẻ không được để trống' }
                ]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }}  disabled  />
                </Form.Item>
                <Form.Item name="ngayhethan" label="Ngày hết hạn" rules={[{ required: true ,message : 'Ngày hết hạn không được để trống' }]}>
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled />

                    {/*<DatePicker*/}
                    {/*    format="DD/MM/YYYY"*/}
                    {/*    style={{ width: '100%' }}*/}
                    {/*    disabledDate={(current) => {*/}
                    {/*        // Chặn những ngày trước hôm nay + 3 tháng*/}
                    {/*        return current && current < dayjs().add(3, 'month').startOf('day');*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Form.Item>

                <Form.Item name="hoatdong" label="Trạng thái" rules={[{ required: true  , message : 'Trạng thái hoạt động không được để trống'}]}>
                    <Select>
                        <Select.Option  value={true}>Hoạt động</Select.Option>
                        <Select.Option value={false}>Khóa</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReaderModal;