// // src/pages/AccountManagementPage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Row, Col, List, Button, Spin, Modal, Form, Input, message, App as AntdApp } from 'antd';
// import { UserAddOutlined } from '@ant-design/icons';
// import { getStaffsWithoutLogin, getReadersWithoutLogin, createAccount } from '../services/accountService';
//
// const AccountManagementPage = () => {
//     const [staffs, setStaffs] = useState([]);
//     const [readers, setReaders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null); // { id, name, type: 'NHANVIEN' | 'DOCGIA' }
//     const [form] = Form.useForm();
//     const { message: message } = AntdApp.useApp();
//
//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             const [staffsRes, readersRes] = await Promise.all([
//                 getStaffsWithoutLogin(),
//                 getReadersWithoutLogin(),
//             ]);
//             console.log("Danh sach nhan vien",staffsRes.data);
//             console.log("Danh sach doc gia",readersRes.data);
//             setStaffs(staffsRes.data);
//             setReaders(readersRes.data);
//         } catch (error) { /* handled */ }
//         finally { setLoading(false); }
//     }, []);
//
//     useEffect(() => { fetchData(); }, [fetchData]);
//
//     const showCreateModal = (user, type) => {
//         const id = type === 'NHANVIEN' ? user.maNV : user.madg;
//         const name = `${user.hoNV || user.hodg} ${user.tenNV || user.tendg}`;
//         setSelectedUser({ id, name, type });
//         setIsModalVisible(true);
//     };
//
//     const handleCreateAccount = async () => {
//         try {
//             const values = await form.validateFields();
//             const payload = {
//                 loginName: values.loginName,
//                 password: values.password,
//                 userType: selectedUser.type,
//                 userId: selectedUser.id.toString(),
//             };
//             await createAccount(payload);
//             message.success(`Tạo tài khoản ${values.loginName} thành công!`);
//             setIsModalVisible(false);
//             form.resetFields();
//             fetchData(); // Tải lại danh sách
//         } catch (error) {
//             // Lỗi đã được interceptor xử lý và hiển thị
//         }
//     };
//
//     return (
//         <div>
//             <h1>Quản lý Tài khoản Đăng nhập</h1>
//             <Spin spinning={loading}>
//                 <Row gutter={24}>
//                     <Col span={12}>
//                         <h2>Nhân viên chưa có tài khoản</h2>
//                         <List
//                             bordered
//                             dataSource={staffs}
//                             renderItem={(item) => (
//                                 <List.Item
//                                     actions={[<Button type="primary" icon={<UserAddOutlined />} onClick={() => showCreateModal(item, 'NHANVIEN')}>Tạo TK</Button>]}
//                                 >
//                                     <List.Item.Meta
//                                         title={`${item.hoNV} ${item.tenNV}`}
//                                         description={`Mã NV: ${item.maNV} - Email: ${item.email}`}
//                                     />
//                                 </List.Item>
//                             )}
//                         />
//                     </Col>
//                     <Col span={12}>
//                         <h2>Độc giả chưa có tài khoản</h2>
//                         <List
//                             bordered
//                             dataSource={readers}
//                             renderItem={(item) => (
//                                 <List.Item
//                                     actions={[<Button icon={<UserAddOutlined />} onClick={() => showCreateModal(item, 'DOCGIA')}>Tạo TK</Button>]}
//                                 >
//                                     <List.Item.Meta
//                                         title={`${item.hodg} ${item.tendg}`}
//                                         description={`Mã ĐG: ${item.madg} - Email: ${item.emaildg}`}
//                                     />
//                                 </List.Item>
//                             )}
//                         />
//                     </Col>
//                 </Row>
//             </Spin>
//
//             <Modal
//                 title={`Tạo tài khoản cho: ${selectedUser?.name}`}
//                 open={isModalVisible}
//                 onOk={handleCreateAccount}
//                 onCancel={() => setIsModalVisible(false)}
//                 okText="Tạo"
//                 cancelText="Hủy"
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item label="Tên đăng nhập (Login Name)" name="loginName" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
//                         <Input.Password />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };
//
// export default AccountManagementPage;



// src/pages/AccountManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {Row, Col, List, Button, Spin, Modal, Form, Input, App as AntdApp, App} from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { getStaffsWithoutLogin, getReadersWithoutLogin, createAccount } from '../services/accountService';

const AccountManagementPage = () => {
    const [staffs, setStaffs] = useState([]);
    const [readers, setReaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();

    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [staffsRes, readersRes] = await Promise.all([
                getStaffsWithoutLogin(),
                getReadersWithoutLogin(),
            ]);
            setStaffs(staffsRes.data);
            setReaders(readersRes.data);
        } catch (error) {
            console.log("fetchData",error);
            message.error( error.response.data.message || error.response.data.error ||"fetchData error:", DURATION);

        }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const showCreateModal = (user, type) => {
        // Dùng đúng tên thuộc tính 'ho' và 'ten'
        const name = `${user.ho} ${user.ten}`;
        setSelectedUser({ id: user.id, name, type });
        setIsModalVisible(true);
    };

    const handleCreateAccount = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                loginName: values.loginName,
                password: values.password,
                userType: selectedUser.type,
                userId: selectedUser.id.toString(),
            };
            await createAccount(payload);
            message.success(`Tạo tài khoản ${values.loginName} thành công!` , DURATION);
            setIsModalVisible(false);
            form.resetFields();
            fetchData();
        } catch (error) {
            console.log("handleCreateAccount",error);
            message.error( error.response.data.message || error.response.data.error ||"handleCreateAccount error:", DURATION);
        }
    };

    return (
        <div>
            <h1>Quản lý Tài khoản Đăng nhập</h1>
            <Spin spinning={loading}>
                <Row gutter={24}>
                    <Col span={12}>
                        <h2>Nhân viên chưa có tài khoản</h2>
                        <List
                            bordered
                            dataSource={staffs}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[<Button type="primary" icon={<UserAddOutlined />} onClick={() => showCreateModal(item, 'NHANVIEN')}>Tạo TK</Button>]}
                                >
                                    <List.Item.Meta
                                        // === SỬA Ở ĐÂY ===
                                        title={`${item.ho} ${item.ten}`}
                                        description={`Mã NV: ${item.id} - Email: ${item.email}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={12}>
                        <h2>Độc giả chưa có tài khoản</h2>
                        <List
                            bordered
                            dataSource={readers}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[<Button icon={<UserAddOutlined />} onClick={() => showCreateModal(item, 'DOCGIA')}>Tạo TK</Button>]}
                                >
                                    <List.Item.Meta
                                        // === SỬA Ở ĐÂY ===
                                        title={`${item.ho} ${item.ten}`}
                                        description={`Mã ĐG: ${item.id} - Email: ${item.email}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Spin>

            <Modal
                title={`Tạo tài khoản cho: ${selectedUser?.name}`}
                open={isModalVisible}
                onOk={handleCreateAccount}
                onCancel={() => setIsModalVisible(false)}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên đăng nhập (Login Name)" name="loginName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountManagementPage;