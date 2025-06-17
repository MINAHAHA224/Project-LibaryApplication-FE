// src/utils/helpers.js
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// ...
export const downloadFile = (response, defaultFileName) => {
    // Lấy tên file từ header Content-Disposition nếu có
    const headerLine = response.headers['content-disposition'];
    let fileName = defaultFileName;
    if (headerLine) {
        const start = headerLine.indexOf('filename=') + 10;
        const end = headerLine.lastIndexOf('"');
        if (start > 9 && end > start) {
            fileName = headerLine.substring(start, end);
        }
    }

    // Tạo một URL tạm thời cho file blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Dọn dẹp
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
};