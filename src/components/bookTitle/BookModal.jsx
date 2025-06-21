import React, { useEffect } from 'react';
import {Modal, Form, Input, Select, Checkbox, message, App} from 'antd';

const { Option } = Select;

const BookModal = ({ visible, onCancel, onSave, initialData, drawers }) => {
    const [form] = Form.useForm();
    const isEditing = !!initialData;
    const isRented = isEditing && initialData?.choMuon; // Kiểm tra sách có đang được mượn không
    const { message } = App.useApp();
    const DURATION = 3;


    useEffect(() => {
        if (visible) {
            if (isEditing) {
                form.setFieldsValue(initialData);
            } else {
                // Đặt giá trị mặc định cho form thêm mới
                form.setFieldsValue({
                    tinhTrang: true,
                    choMuon: false,
                });
            }
        } else {
            form.resetFields();
        }
    }, [initialData, visible, form, isEditing]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                onSave(values);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('Vui lòng điền đầy đủ thông tin bắt buộc.' , DURATION);
            });
    };

    return (
        <Modal
            title={isEditing ? "Cập nhật thông tin Sách" : "Thêm Sách mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            okText={isEditing ? "Cập nhật" : "Thêm"}
            cancelText="Hủy"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="maSach"
                    label="Mã Sách"
                    rules={[{ required: true, message: 'Vui lòng nhập Mã Sách!' }]}
                >
                    <Input disabled={isRented} />
                </Form.Item>
                <Form.Item
                    name="maNganTu"
                    label="Ngăn Tủ"
                    rules={[{ required: true, message: 'Vui lòng chọn Ngăn Tủ!' }]}
                >
                    <Select placeholder="Chọn ngăn tủ">
                        {drawers.map(d => (
                            <Option key={d.maNganTu} value={d.maNganTu}>
                                {d.tenNganTu}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="tinhTrang" label="Tình Trạng" valuePropName="checked">
                    <Checkbox disabled={isRented} >Tốt (sẵn sàng sử dụng)</Checkbox>
                </Form.Item>
                <Form.Item name="choMuon" label="Trạng thái mượn" valuePropName="checked">
                    <Checkbox disabled={true}>
                        Đang cho mượn (Sách đang được mượn sẽ không thể sửa trạng thái này)
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookModal;