import React, { useEffect } from 'react';
import {Modal, Form, Input, Radio, message, App} from 'antd';

const StaffModal = ({ visible, onCancel, onSave, initialData }) => {

    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION

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
                // Trim toàn bộ chuỗi
                const trimmedValues = Object.fromEntries(
                    Object.entries(values).map(([key, value]) => {
                        if (typeof value === 'string') {
                            return [key, value.trim()];
                        }
                        return [key, value];
                    })
                );
                onSave(trimmedValues);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('Vui lòng kiểm tra lại thông tin.' , DURATION);
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
                <Form.Item name="hoNV" label="Họ" rules={[{ required: true,whitespace: true, message: 'Họ không được để trống' }
                    ,
                    {
                        max: 50,
                        message: 'Họ không được vượt quá 10 ký tự',
                    },
                ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="tenNV" label="Tên" rules={[{ required: true,whitespace: true, message: 'Tên không được để trống' }
                    ,
                    {
                        max: 10,
                        message: 'Tên không được vượt quá 10 ký tự',
                    },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true,type: 'email' , message: 'Email không được để trống'   },

                    {
                        max: 50,
                        message: 'Email không được vượt quá 50 ký tự',
                    },
                    {
                    type: 'email',
                    pattern: /^[a-zA-Z0-9._%+-]+@ptithcm\.edu\.vn$/,
                     message: 'Email phải có định dạng hợp lệ và thuộc domain @ptithcm.edu.vn'
                    }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true, message: 'Giới tính không được để trống' }]}>
                    <Radio.Group>
                        <Radio value={true}>Nam</Radio>
                        <Radio value={false}>Nữ</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true,whitespace: true, message: 'Địa chỉ không được để trống' }
                    ,
                    {
                        max: 100,
                        message: 'Địa chỉ không được vượt quá 10 ký tự',
                    },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dienThoai" label="Điện thoại" rules={[{ required: true,whitespace: true ,message: 'Điện thoại không được để trống' },

                    {
                        max: 15,
                        message: 'Điện thoại không được vượt quá 10 ký tự',
                    },
                    {
                        pattern: /^(0\d{9}|\+84\d{9})$/,
                        message: 'Số điện thoại không hợp lệ'
                    }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StaffModal;