//
// import React, { useState, useEffect } from 'react';
// import {
//     Modal,
//     Form,
//     Input,
//     Select,
//     DatePicker,
//     InputNumber,
//     Upload,
//     Button,
//     Spin,
//     Row,
//     Col,
//     Typography,
//     App,
//     Divider
// } from 'antd';
// import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import { getFormData } from '../../services/bookTitleService';
//
// const { Option } = Select;
// const { TextArea } = Input;
//
// const BookTitleModal = ({ visible, onCancel, onSave, initialData }) => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [formDropdownData, setFormDropdownData] = useState({ authors: [], languages: [], bookTypes: [] });
//     const [fileList, setFileList] = useState([]);
//     const { message: message } = App.useApp();
//     const isEditing = !!initialData;
//
//     useEffect(() => {
//         const fetchDropdownData = async () => {
//             setLoading(true);
//             try {
//                 const [authorsRes, languagesRes, bookTypesRes] = await getFormData();
//                 setFormDropdownData({
//                     authors: authorsRes.data,
//                     languages: languagesRes.data,
//                     bookTypes: bookTypesRes.data,
//                 });
//             } catch (error) { message.error("Không thể tải dữ liệu cho form!"); }
//             finally { setLoading(false); }
//         };
//         if (visible) fetchDropdownData();
//     }, [visible, message]);
//
//     useEffect(() => {
//         if (visible) {
//             if (isEditing && initialData) {
//                 console.log("initialData" , initialData);
//                 form.setFieldsValue({
//                     ...initialData,
//                     dateRelease: initialData.dateRelease ? dayjs(initialData.dateRelease) : null,
//                     codeAuthor: initialData.codeAuthor?.map(id => parseInt(id, 10)) || []
//                 });
//                 if (initialData.picturePath) {
//                     setFileList([{
//                         uid: '-1',
//                         name: initialData.picturePath,
//                         status: 'done',
//                         url: `http://localhost:8080/dausach/${initialData.picturePath}`
//                     }]);
//                 } else {
//                     setFileList([]);
//                 }
//             } else {
//                 form.resetFields();
//                 setFileList([]);
//             }
//         }
//     }, [initialData, visible, form, isEditing]);
//
//     const handleOk = () => {
//         form.validateFields()
//             .then(values => {
//                 const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;
//                 onSave(values, imageFile);
//             })
//             .catch(() => message.error('Vui lòng kiểm tra lại thông tin.'));
//     };
//
//     return (
//         <Modal
//             title={isEditing ? `Chỉnh sửa Đầu sách: ${initialData.nameBook}` : "Thêm Đầu sách mới"}
//             open={visible}
//             onOk={handleOk}
//             onCancel={() => onCancel(false)}
//             confirmLoading={loading}
//             width={800}
//             okText={isEditing ? "Lưu thông tin" : "Thêm mới"}
//             cancelText="Hủy"
//             destroyOnClose
//         >
//             <Spin spinning={loading}>
//                 <Form form={form} layout="vertical">
//                     {/* Phần Ảnh bìa chỉ hiển thị khi Sửa */}
//                     {isEditing && (
//                         <>
//                             <Typography.Title level={5}>Ảnh bìa</Typography.Title>
//                             <Upload
//                                 listType="picture-card"
//                                 fileList={fileList}
//                                 onChange={({ fileList: newFileList }) => setFileList(newFileList)}
//                                 onRemove={() => setFileList([])}
//                                 beforeUpload={() => false}
//                                 maxCount={1}
//                             >
//                                 {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Chọn ảnh</div></div>}
//                             </Upload>
//                             <Divider />
//                         </>
//                     )}
//
//                     <Typography.Title level={5}>Thông tin chi tiết</Typography.Title>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item name="codeBookTitle" label="ISBN" rules={[{ required: true }]}>
//                                 {/*<Input disabled={isEditing} />*/}
//                                 <Input />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item name="nameBook" label="Tên Sách" rules={[{ required: true }]}>
//                                 <Input />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Form.Item name="codeAuthor" label="Tác giả" rules={[{ required: true }]}>
//                         <Select mode="multiple" allowClear placeholder="Chọn tác giả">
//                             {formDropdownData.authors.map(author => (
//                                 <Option key={author.id} value={author.id}>{author.name}</Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
//                     <Form.Item name="contentBook" label="Nội dung tóm tắt">
//                         <TextArea rows={3} />
//                     </Form.Item>
//                     <Row gutter={16}>
//                         <Col span={8}>
//                             <Form.Item name="formatBook" label="Khổ Sách" rules={[{ required: true }]}>
//                                 <Input />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="pages" label="Số trang" rules={[{ required: true, type: 'number', min: 1 }]}>
//                                 <InputNumber style={{ width: '100%' }} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="editions" label="Lần xuất bản" rules={[{ required: true, type: 'number', min: 1 }]}>
//                                 <InputNumber style={{ width: '100%' }} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={8}>
//                             <Form.Item name="namePublisher" label="Nhà xuất bản" rules={[{ required: true }]}>
//                                 <Input />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="dateRelease" label="Ngày xuất bản" rules={[
//                                 { required: true, message: 'Ngày xuất bản không được để trống' },
//                                 ({ getFieldValue }) => ({
//                                     validator(_, value) {
//                                         if (!value) return Promise.resolve();
//
//                                         // Chỉ kiểm tra tương lai nếu đang thêm mới
//                                         if (!isEditing && value.isBefore(dayjs(), 'day')) {
//                                             return Promise.reject(new Error('Ngày xuất bản phải là ngày trong tương lai'));
//                                         }
//                                         return Promise.resolve();
//                                     },
//                                 }),
//                             ]}>
//                                 <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, type: 'number', min: 0 }]}>
//                                 <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={16}>
//                         <Col span={8}>
//                             <Form.Item name="codeLanguage" label="Ngôn ngữ" rules={[{ required: true }]}>
//                                 <Select placeholder="Chọn ngôn ngữ">
//                                     {formDropdownData.languages.map(lang => (
//                                         <Option key={lang.id} value={lang.id}>{lang.name}</Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="codeType" label="Thể loại" rules={[{ required: true }]}>
//                                 <Select placeholder="Chọn thể loại">
//                                     {formDropdownData.bookTypes.map(type => (
//                                         <Option key={type.id} value={type.id}>{type.name}</Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//
//                     </Row>
//
//                     {/* Ô Upload ảnh chỉ là một Form.Item khi Thêm mới */}
//                     {!isEditing && (
//                         <Form.Item label="Ảnh bìa (Tùy chọn)" name="imageFile" valuePropName="fileList"
//                                    getValueFromEvent={(e) => {
//                                        if (Array.isArray(e)) return e;
//                                        return e && e.fileList;
//                                    }}
//                         >
//                             <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
//                                 <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
//                             </Upload>
//                         </Form.Item>
//                     )}
//                 </Form>
//             </Spin>
//         </Modal>
//     );
// };
//
// export default BookTitleModal;



import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Upload,
    Button,
    Spin,
    Row,
    Col,
    Typography,
    App,
    Divider
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getFormData } from '../../services/bookTitleService';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const BookTitleModal = ({ visible, onCancel, onSave, initialData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formDropdownData, setFormDropdownData] = useState({ authors: [], languages: [], bookTypes: [] });
    const [fileList, setFileList] = useState([]);
    const { message } = App.useApp();
    const DURATION = 3;
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
            } catch (error) { message.error("Không thể tải dữ liệu cho form!"); }
            finally { setLoading(false); }
        };
        if (visible) fetchDropdownData();
    }, [visible, message]);

    useEffect(() => {
        if (visible) {
            if (isEditing && initialData) {
                console.log("initialData" , initialData);
                form.setFieldsValue({
                    ...initialData,
                    dateRelease: initialData.dateRelease ? dayjs(initialData.dateRelease) : null,
                    codeAuthor: initialData.codeAuthor?.map(id => parseInt(id, 10)) || []
                });
                if (initialData.picturePath) {
                    setFileList([{
                        uid: '-1',
                        name: initialData.picturePath,
                        status: 'done',
                        url: `http://localhost:8080/dausach/${initialData.picturePath}`
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

    // const handleOk = () => {
    //     form.validateFields()
    //         .then(values => {
    //             // Chỉ cần lấy file từ state fileList, không cần lấy từ `values` của form nữa
    //             const imageFile = fileList.length > 0 ? fileList[0] : null;
    //
    //             // // Xóa trường imageFile khỏi object values nếu có, để tránh nhầm lẫn
    //             // const { imageFile: formImageFile, ...otherValues } = values;
    //
    //             // Gọi onSave với dữ liệu form đã được làm sạch và file object
    //             onSave(values, imageFile);
    //         })
    //         .catch(info => {
    //             console.log('Validation Failed:', info);
    //             message.error('Vui lòng kiểm tra lại các trường thông tin bắt buộc.', DURATION);
    //         });
    // };

    // === HÀM OK ĐƯỢC SỬA LẠI HOÀN CHỈNH ===
    const handleOk = () => {
        form.validateFields()
            .then(values => {


                // 1. Lấy file trực tiếp từ state `fileList`, đây là cách an toàn nhất
                // `originFileObj` là file thật sự mà Javascript có thể gửi đi
                const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

                // // 2. Lấy dữ liệu chữ từ `values`
                // const formattedValues = {
                //     ...values,
                //     dateRelease: values.dateRelease ? values.dateRelease.format('YYYY-MM-DD') : null,
                // };

                // 3. Gọi hàm onSave của component cha với 2 tham số rõ ràng
                onSave(values, imageFile);
            })
            .catch(info => {
                console.log('Validation Failed:', info);
                message.error('Vui lòng kiểm tra lại các trường thông tin bắt buộc.', DURATION);
            });
    };
    // Hàm onChange cho Upload sẽ cập nhật `fileList` state
    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <Modal
            title={isEditing ? `Chỉnh sửa Đầu sách: ${initialData.nameBook}` : "Thêm Đầu sách mới"}
            open={visible}
            onOk={handleOk}
            onCancel={() => onCancel(false)}
            confirmLoading={loading}
            width={800}
            okText={isEditing ? "Lưu thông tin" : "Thêm mới"}
            cancelText="Hủy"
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    {/* Phần Ảnh bìa chỉ hiển thị khi Sửa */}
                    {/* === KHÔI PHỤC LẠI KHỐI HIỂN THỊ ẢNH KHI SỬA === */}
                    {isEditing && (
                        <>
                            <Title level={5}>Ảnh bìa</Title>
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                onRemove={() => setFileList([])}
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                {fileList.length >= 1 ? null : <div><PlusOutlined /><div style={{ marginTop: 8 }}>Chọn/Thay đổi</div></div>}
                            </Upload>
                            <Divider />
                        </>
                    )}

                    <Typography.Title level={5}>Thông tin chi tiết</Typography.Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="codeBookTitle" label="ISBN" rules={[{ required: true }]}>
                                {/*<Input disabled={isEditing} />*/}
                                <Input />
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
                            <Form.Item name="dateRelease" label="Ngày xuất bản" rules={[
                                { required: true, message: 'Ngày xuất bản không được để trống' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value) return Promise.resolve();

                                        // Chỉ kiểm tra tương lai nếu đang thêm mới
                                        if (!isEditing && value.isBefore(dayjs(), 'day')) {
                                            return Promise.reject(new Error('Ngày xuất bản phải là ngày trong tương lai'));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}>
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

                    </Row>

                    {/* Ô Upload ảnh chỉ hiển thị khi Thêm mới */}
                    {/*{!isEditing && (*/}
                    {/*    <Form.Item*/}
                    {/*        label="Ảnh bìa (Tùy chọn)"*/}
                    {/*        name="imageFile"*/}
                    {/*        valuePropName="fileList"*/}
                    {/*        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}*/}
                    {/*    >*/}
                    {/*        <Upload listType="picture" beforeUpload={() => false} maxCount={1}>*/}
                    {/*            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>*/}
                    {/*        </Upload>*/}
                    {/*    </Form.Item>*/}
                    {/*)}*/}
                    {!isEditing && (
                        <Form.Item label="Ảnh bìa (Tùy chọn)">
                            {/* Bỏ thuộc tính `name` và các thuộc tính liên quan đến form */}
                            <Upload
                                listType="picture"
                                fileList={fileList}
                                onChange={handleFileChange}
                                onRemove={() => setFileList([])}
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            </Upload>
                        </Form.Item>
                    )}
                </Form>
            </Spin>
        </Modal>
    );
};

export default BookTitleModal;