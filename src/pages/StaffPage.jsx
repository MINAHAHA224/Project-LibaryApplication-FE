// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Button, Space, message, Spin, Popconfirm, App, Tooltip } from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
// import { getStaffs, createStaff, updateStaff, deleteStaff, undoStaffAction } from '../services/staffService';
// import StaffModal from '../components/staff/StaffModal';
//
// const StaffPage = () => {
//     const [staffs, setStaffs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editingStaff, setEditingStaff] = useState(null);
//     const [historyStack, setHistoryStack] = useState([]);
//     const { message: message } = App.useApp();
//     const DURATION = 3;
//
//     const fetchStaffs = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await getStaffs();
//             setStaffs(res.data);
//         } catch (error) {
//             // Lỗi đã được interceptor xử lý và hiển thị thông báo
//             console.error("Failed to fetch staff list:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         fetchStaffs();
//     }, [fetchStaffs]);
//
//     const pushToHistory = (action) => {
//         setHistoryStack(prev => [...prev, action]);
//     };
//
//     const handleAdd = () => {
//         setEditingStaff(null);
//         setIsModalVisible(true);
//     };
//
//     const handleEdit = (record) => {
//         setEditingStaff(record);
//         setIsModalVisible(true);
//     };
//
//     const handleSave = async (values) => {
//         setLoading(true);
//         try {
//             if (editingStaff) {
//                 const response = await updateStaff(editingStaff.maNV, values);
//                 message.success('Cập nhật nhân viên thành công!', DURATION);
//                 pushToHistory({ actionType: 'UPDATE', data: { oldData: editingStaff, newData: response.data } });
//             } else {
//                 const response = await createStaff(values);
//                 message.success('Thêm nhân viên thành công!', DURATION);
//                 pushToHistory({ actionType: 'ADD', data: { maNV: response.data.maNV } });
//             }
//             setIsModalVisible(false);
//             fetchStaffs();
//         } catch (error) {
//             // Lỗi đã được interceptor xử lý
//             console.error("Failed to save staff:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleDelete = async (recordToDelete) => {
//         setLoading(true);
//         try {
//             await deleteStaff(recordToDelete.maNV);
//             message.success('Xóa nhân viên thành công!', DURATION);
//             pushToHistory({ actionType: 'DELETE', data: { originalData: recordToDelete } });
//             fetchStaffs();
//         } catch (error) {
//             // Lỗi đã được interceptor xử lý
//             console.error("Failed to delete staff:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleUndo = async () => {
//         if (historyStack.length === 0) {
//             message.info('Không có hành động nào để hoàn tác.', DURATION);
//             return;
//         }
//
//         // Lấy và xóa hành động cuối cùng khỏi stack
//         const lastAction = historyStack[historyStack.length - 1];
//         const newHistoryStack = historyStack.slice(0, historyStack.length - 1);
//
//         setLoading(true);
//         try {
//             await undoStaffAction(lastAction);
//             message.success('Hoàn tác thành công!', DURATION);
//             setHistoryStack(newHistoryStack); // Cập nhật state của stack
//             fetchStaffs(); // Tải lại dữ liệu từ server
//         } catch (error) {
//             // Lỗi đã được interceptor xử lý
//             console.error("Failed to undo action:", error);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const columns = [
//         {
//             title: 'Mã NV',
//             dataIndex: 'maNV',
//             key: 'maNV',
//             sorter: (a, b) => a.maNV - b.maNV
//         },
//         {
//             title: 'Họ Tên',
//             key: 'hoTen',
//             render: (_, record) => `${record.hoNV} ${record.tenNV}`,
//             sorter: (a, b) => `${a.hoNV} ${a.tenNV}`.localeCompare(`${b.hoNV} ${b.tenNV}`)
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email'
//         },
//         {
//             title: 'Giới Tính',
//             dataIndex: 'gioiTinh',
//             key: 'gioiTinh',
//             render: (isMale) => (isMale ? 'Nam' : 'Nữ')
//         },
//         {
//             title: 'Địa chỉ',
//             dataIndex: 'diaChi',
//             key: 'diaChi'
//         },
//         {
//             title: 'Điện thoại',
//             dataIndex: 'dienThoai',
//             key: 'dienThoai'
//         },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             align: 'center',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Tooltip title="Sửa">
//                         <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//                     </Tooltip>
//                     <Tooltip title="Xóa">
//                         <Popconfirm
//                             title={`Bạn chắc chắn muốn xóa nhân viên "${record.hoNV} ${record.tenNV}"?`}
//                             onConfirm={() => handleDelete(record)}
//                             okText="Đồng ý"
//                             cancelText="Hủy"
//                         >
//                             <Button danger icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                     </Tooltip>
//                 </Space>
//             ),
//         },
//     ];
//
//     return (
//         <div>
//             <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Title level={2}>Quản lý Nhân viên</Title>
//                 <Space>
//                     <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
//                         Thêm Nhân viên
//                     </Button>
//                     <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
//                         Phục hồi ({historyStack.length})
//                     </Button>
//                 </Space>
//             </div>
//             <Spin spinning={loading}>
//                 <Table
//                     dataSource={staffs}
//                     columns={columns}
//                     rowKey="maNV"
//                     bordered
//                 />
//             </Spin>
//             {isModalVisible && (
//                 <StaffModal
//                     visible={isModalVisible}
//                     onCancel={() => setIsModalVisible(false)}
//                     onSave={handleSave}
//                     initialData={editingStaff}
//                 />
//             )}
//         </div>
//     );
// };
//
// // Cần thêm import Title để sử dụng
// import { Typography } from 'antd';
// const { Title } = Typography;
//
// export default StaffPage;



import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Spin, Popconfirm, Tooltip, Input, App , Typography   } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { getStaffs, createStaff, updateStaff, deleteStaff, undoStaffAction } from '../services/staffService';
import StaffModal from '../components/staff/StaffModal';
const { Search } = Input;
const { Title } = Typography;

const StaffPage = () => {
    const [staffs, setStaffs] = useState([]);
    const [filteredStaffs, setFilteredStaffs] = useState([]); // Dữ liệu hiển thị


    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [historyStack, setHistoryStack] = useState([]);
    const { message } = App.useApp(); // Khởi tạo message instance
    const DURATION = 3; // Định nghĩa DURATION

    const fetchStaffs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getStaffs();
            setStaffs(res.data);
            setFilteredStaffs(res.data);
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"fetchStaffs error:", DURATION);
            console.error("Failed to fetch staff list:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (!lowercasedValue) {
            setFilteredStaffs(staffs);
            return;
        }
        const filtered = staffs.filter(item =>
            `${item.hoNV} ${item.tenNV}`.toLowerCase().includes(lowercasedValue) ||
            item.email.toLowerCase().includes(lowercasedValue) ||
            item.dienThoai.includes(lowercasedValue)
        );
        setFilteredStaffs(filtered);
    };

    useEffect(() => {
        fetchStaffs();
    }, [fetchStaffs]);

    const pushToHistory = (action) => {
        setHistoryStack(prev => [...prev, action]);
    };

    const handleAdd = () => {
        setEditingStaff(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingStaff(record);
        setIsModalVisible(true);
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            if (editingStaff) {
                const response = await updateStaff(editingStaff.maNV, values);
                message.success('Cập nhật nhân viên thành công!', DURATION);
                pushToHistory({ actionType: 'UPDATE', data: { oldData: editingStaff, newData: response.data } });
            } else {
                const response = await createStaff(values);
                message.success('Thêm nhân viên thành công!', DURATION);
                pushToHistory({ actionType: 'ADD', data: { maNV: response.data.maNV } });
            }
            setIsModalVisible(false);
            fetchStaffs();
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handleSave error:", DURATION);
            console.error("Failed to save staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (recordToDelete) => {
        setLoading(true);
        try {
            await deleteStaff(recordToDelete.maNV);
            message.success('Xóa nhân viên thành công!', DURATION);
            pushToHistory({ actionType: 'DELETE', data: { originalData: recordToDelete } });
            fetchStaffs();
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handleDelete error:", DURATION);
            console.error("Failed to delete staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = async () => {
        if (historyStack.length === 0) {
            message.info('Không có hành động nào để hoàn tác.', DURATION);
            return;
        }

        // Lấy và xóa hành động cuối cùng khỏi stack
        const lastAction = historyStack[historyStack.length - 1];
        const newHistoryStack = historyStack.slice(0, historyStack.length - 1);

        setLoading(true);
        try {
            await undoStaffAction(lastAction);
            message.success('Hoàn tác thành công!', DURATION);
            setHistoryStack(newHistoryStack); // Cập nhật state của stack
            fetchStaffs(); // Tải lại dữ liệu từ server
        } catch (error) {
            message.error( error.response.data.message || error.response.data.error ||"handleUndo error:", DURATION);
            console.error("Failed to undo action:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã NV',
            dataIndex: 'maNV',
            key: 'maNV',
            sorter: (a, b) => a.maNV - b.maNV
        },
        {
            title: 'Họ Tên',
            key: 'hoTen',
            render: (_, record) => `${record.hoNV} ${record.tenNV}`,
            sorter: (a, b) => `${a.hoNV} ${a.tenNV}`.localeCompare(`${b.hoNV} ${b.tenNV}`)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Giới Tính',
            dataIndex: 'gioiTinh',
            key: 'gioiTinh',
            render: (isMale) => (isMale ? 'Nam' : 'Nữ')
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'diaChi',
            key: 'diaChi'
        },
        {
            title: 'Điện thoại',
            dataIndex: 'dienThoai',
            key: 'dienThoai'
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Sửa">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        {/*<Popconfirm*/}
                        {/*    title={`Bạn chắc chắn muốn xóa nhân viên "${record.hoNV} ${record.tenNV}"?`}*/}
                        {/*    onConfirm={() => handleDelete(record)}*/}
                        {/*    okText="Đồng ý"*/}
                        {/*    cancelText="Hủy"*/}
                        {/*>*/}
                        {/*    <Button danger icon={<DeleteOutlined />} />*/}
                        {/*</Popconfirm>*/}

                            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>Quản lý Nhân viên</Title>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm Nhân viên
                    </Button>
                    <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={historyStack.length === 0}>
                        Phục hồi ({historyStack.length})
                    </Button>
                    <Search placeholder="Tìm theo tên, email, điện thoại..." onSearch={handleSearch} style={{ width: 300 }} allowClear enterButton />
                </Space>
            </div>
            <Spin spinning={loading}>
                <Table
                    dataSource={filteredStaffs}
                    columns={columns}
                    rowKey="maNV"
                    bordered
                />
            </Spin>
            {isModalVisible && (
                <StaffModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSave={handleSave}
                    initialData={editingStaff}
                />
            )}
        </div>
    );
};

// Cần thêm import Title để sử dụng

export default StaffPage;