import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Popover, Typography } from 'antd';
import {
    BookOutlined,
    TeamOutlined,
    UserOutlined,
    LogoutOutlined,
    DatabaseOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    UserSwitchOutlined,
    SolutionOutlined,
    TagsOutlined,
    IdcardOutlined,
    KeyOutlined
} from '@ant-design/icons';

import { useAuth } from '../../contexts/AuthContext';
import './MainLayout.css'; // Sẽ tạo file CSS này

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     logout();
    //     navigate('/login');
    // };

    // Nội dung của Popover khi click vào Avatar
    // const userPopoverContent = (
    //     <div>
    //         <Button
    //             type="text"
    //             icon={<LogoutOutlined />}
    //             onClick={handleLogout}
    //             style={{ width: '100%', textAlign: 'left' }}
    //         >
    //             Đăng xuất
    //         </Button>
    //     </div>
    // );


    const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
    const handleCloseChangePasswordModal = (shouldLogout) => {
        setIsChangePasswordModalVisible(false);
        if (shouldLogout) {
            logout(); // Gọi hàm logout từ AuthContext
        }
    };

    const userPopoverContent = (
        <div>
            <Button
                type="text"
                icon={<IdcardOutlined />}
                onClick={() => setIsChangePasswordModalVisible(true)}
                style={{ width: '100%', textAlign: 'left' }}
            >
                Đổi mật khẩu
            </Button>
            <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={logout}
                style={{ width: '100%', textAlign: 'left' }}
            >
                Đăng xuất
            </Button>
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                trigger={null} // Ẩn trigger mặc định
            >
                <div className="logo">
                    <BookOutlined style={{ fontSize: '24px', color: '#fff' }} />
                    {!collapsed && <span className="logo-text">Thư Viện</span>}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    {/* Sử dụng NavLink để link tự động có class 'active' */}
                    <Menu.Item key="1" icon={<BookOutlined />}>
                        <NavLink to="/">Quản lý Đầu sách</NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />}>
                        <NavLink to="/readers">Quản lý Độc giả</NavLink>
                    </Menu.Item>
                    <Menu.Item key="7" icon={<TagsOutlined />}> {/* Thay đổi key và icon */}
                        <NavLink to="/book-types">Quản lý Thể loại</NavLink>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<SolutionOutlined />}>
                        <NavLink to="/staffs">Quản lý Nhân viên</NavLink>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ArrowRightOutlined />}>
                        <NavLink to="/rentals">Mượn Sách & Trả Sách</NavLink>
                    </Menu.Item>

                    <Menu.Item key="/reset-password" icon={<KeyOutlined />}>
                        <NavLink to="/reset-password">Đổi MK Người dùng</NavLink>
                    </Menu.Item>


                    <Menu.Item key="/accounts" icon={<UserSwitchOutlined />}>
                        <NavLink to="/accounts">Quản lý Tài khoản</NavLink>
                    </Menu.Item>


                    <Menu.Item key="6" icon={<DatabaseOutlined />}>
                        <NavLink to="/backup">Sao lưu & Phục hồi</NavLink>
                    </Menu.Item>
                    {/* Thêm các Menu.Item khác ở đây */}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', color: '#000' }}
                    />
                    <div className="header-right">
                        <Popover
                            content={userPopoverContent}
                            trigger="click"
                            placement="bottomRight"
                        >
                            <Button type="text" style={{ height: 'auto' }}>
                                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                                <Text>{user?.hoTenDayDu  || 'User'}</Text>
                            </Button>
                        </Popover>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
                    {/* Nội dung của các trang con sẽ được render ở đây */}
                    <Outlet />
                </Content>
            </Layout>
            {isChangePasswordModalVisible && (
                <ChangePasswordModal
                    visible={isChangePasswordModalVisible}
                    onCancel={handleCloseChangePasswordModal}
                />
            )}
        </Layout>
    );
};

// Cần import 2 icon này
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ChangePasswordModal from "../../pages/ChangePasswordModal.jsx";
export default MainLayout;