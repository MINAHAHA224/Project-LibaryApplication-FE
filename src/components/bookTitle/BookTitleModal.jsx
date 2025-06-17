import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Upload, Button, Spin, message, Row, Col , App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getFormData, createBookTitle, updateBookTitle } from '../../services/bookTitleService';

const { Option } = Select;
const { TextArea } = Input;

const BookTitleModal = ({ visible, onCancel, onSave, initialData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formDropdownData, setFormDropdownData] = useState({ authors: [], languages: [], bookTypes: [] });
    const [fileList, setFileList] = useState([]);
    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION

    const isEditing = !!initialData;

    useEffect(() => {
        const fetchDropdownData = async () => {
            setLoading(true);
            try {
                const [authorsRes, languagesRes, bookTypesRes] = await getFormData();
                setFormDropdownData({
                    authors: authorsRes.data,
                    languages: languagesRes.data,
                    bookTypes: bookTypesRes.data,
                });
            } catch (error) {
                message.error("Không thể tải dữ liệu cho form!", DURATION);
            } finally {
                setLoading(false);
            }
        };
        if (visible) {
            fetchDropdownData();
        }
    }, [visible]);

    useEffect(() => {
        if (visible) {
            if (isEditing && initialData) {
                form.setFieldsValue({
                    ...initialData,
                    dateRelease: initialData.dateRelease ? dayjs(initialData.dateRelease) : null,
                    // Chuyển đổi chuỗi ID tác giả "1,2,3" thành mảng số [1, 2, 3] cho Select
                    codeAuthor: initialData.codeAuthor?.map(id => parseInt(id, 10)) || []
                });
                if (initialData.picturePath) {
                    setFileList([{
                        uid: '-1', name: initialData.picturePath, status: 'done',
                        url: `/images/dausach/${initialData.picturePath}`,
                    }]);
                } else {
                    setFileList([]);
                }
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [initialData, visible, form, isEditing]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const formattedValues = {
                    ...values,
                    dateRelease: values.dateRelease ? values.dateRelease.format('YYYY-MM-DD') : null,
                };
                const imageFile = fileList.length > 0 && fileList[0].originFileObj ? fileList[0] : null;
                // Gọi onSave với cả data và file
                onSave(formattedValues, imageFile);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('Vui lòng điền đầy đủ thông tin bắt buộc.' , DURATION);
            });
    };

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: file => {
            setFileList([file]);
            return false;
        },
        fileList,
        listType: "picture",
        maxCount: 1,
    };

    return (
        <Modal
            title={isEditing ? "Cập nhật Đầu sách" : "Thêm Đầu sách mới"}
            open={visible}
            onOk={handleOk}
            onCancel={onCancel}
            confirmLoading={loading}
            width={800}
            okText={isEditing ? "Cập nhật" : "Thêm mới"}
            cancelText="Hủy"
            forceRender // Giữ cho các trường trong form được render để lấy dữ liệu dropdown
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical" name="bookTitleForm">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="codeBookTitle" label="ISBN" rules={[{ required: true }]}>
                                <Input disabled={isEditing} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="nameBook" label="Tên Sách" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="codeAuthor" label="Tác giả" rules={[{ required: true }]}>
                        <Select mode="multiple" allowClear placeholder="Chọn tác giả">
                            {formDropdownData.authors.map(author => (
                                <Option key={author.id} value={author.id}>{author.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="contentBook" label="Nội dung tóm tắt">
                        <TextArea rows={3} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="formatBook" label="Khổ Sách" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="pages" label="Số trang" rules={[{ required: true, type: 'number', min: 1 }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="editions" label="Lần xuất bản" rules={[{ required: true, type: 'number', min: 1 }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="namePublisher" label="Nhà xuất bản" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="dateRelease" label="Ngày xuất bản" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, type: 'number', min: 0 }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="codeLanguage" label="Ngôn ngữ" rules={[{ required: true }]}>
                                <Select placeholder="Chọn ngôn ngữ">
                                    {formDropdownData.languages.map(lang => (
                                        <Option key={lang.id} value={lang.id}>{lang.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="codeType" label="Thể loại" rules={[{ required: true }]}>
                                <Select placeholder="Chọn thể loại">
                                    {formDropdownData.bookTypes.map(type => (
                                        <Option key={type.id} value={type.id}>{type.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Ảnh bìa">
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>Chọn hoặc thay đổi ảnh</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default BookTitleModal;