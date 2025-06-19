// import React, { useState, useEffect } from 'react';
// import { Image, Spin } from 'antd';
// import apiClient from '../../services/api';
//
// const AuthenticatedImage = ({ src, ...props }) => {
//     // const [imageUrl, setImageUrl] = useState(null);
//     // const [loading, setLoading] = useState(true);
//     // const [error, setError] = useState(false);
//     //
//     // useEffect(() => {
//     //     // Biến để kiểm tra component còn được mount không, tránh set state sau khi unmount
//     //     let isMounted = true;
//     //
//     //     const fetchImage = async () => {
//     //         if (!src) {
//     //             setLoading(false);
//     //             setError(true);
//     //             return;
//     //         }
//     //
//     //         setLoading(true);
//     //         setError(false);
//     //
//     //         try {
//     //             // Dùng apiClient để gọi API với responseType là 'blob'
//     //             const response = await apiClient.get(src, {
//     //                 responseType: 'blob',
//     //             });
//     //
//     //             if (isMounted) {
//     //                 // Tạo object URL từ blob data
//     //                 const url = URL.createObjectURL(response.data);
//     //                 setImageUrl(url);
//     //             }
//     //         } catch (err) {
//     //             if (isMounted) {
//     //                 console.error('Failed to fetch authenticated image:', err);
//     //                 setError(true);
//     //             }
//     //         } finally {
//     //             if (isMounted) {
//     //                 setLoading(false);
//     //             }
//     //         }
//     //     };
//     //
//     //     fetchImage();
//     //
//     //     // Cleanup function
//     //     return () => {
//     //         isMounted = false;
//     //         // Thu hồi object URL để giải phóng bộ nhớ khi component unmount hoặc src thay đổi
//     //         if (imageUrl) {
//     //             URL.revokeObjectURL(imageUrl);
//     //         }
//     //     };
//     // }, [src]); // Chạy lại hiệu ứng mỗi khi `src` thay đổi
//     //
//     // if (loading) {
//     //     return <Spin size="small" />;
//     // }
//     //
//     // if (error || !imageUrl) {
//     //     // Dùng fallback từ props hoặc ảnh mặc định
//     //     return <Image src={props.fallback || "/images/fallback.png"} {...props} />;
//     // }
//     //
//     // // Truyền các props còn lại (width, height, ...) vào component Image
//     // return <Image src={imageUrl} {...props} />;
// };
//
// export default AuthenticatedImage;