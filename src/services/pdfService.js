import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <<-- IMPORT TƯỜNG MINH
import './../assets/fonts/Roboto-normal.js';

// --- HÀM HELPER: TẠO ĐỐI TƯỢNG PDF CHUNG ---
const createBookTitlePdfDoc = (reportData, username) => {
    const doc = new jsPDF();
    doc.setFont('Roboto', 'normal');

    // === HEADER CỦA BÁO CÁO ===
    doc.setFontSize(18);
    doc.text("DANH MỤC ĐẦU SÁCH", 105, 22, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Nhân viên lập báo cáo: ${username}`, 14, 32);
    doc.text(`Ngày in: ${new Date().toLocaleString('vi-VN')}`, 14, 40);

    // === DỮ LIỆU BẢNG ===
    const head = [['STT', 'ISBN', 'Tên sách', 'Tác giả', 'Thể loại', 'Số cuốn']];
    const body = reportData.map((item, index) => [
        index + 1,
        item.codeBookTitle,
        item.nameBook,
        item.nameAuthor,
        item.nameCodeType,
        item.soCuonThucTe,
    ]);

    // === VẼ BẢNG (CÁCH GỌI MỚI) ===
    autoTable(doc, { // <<-- SỬA Ở ĐÂY: Gọi autoTable như một hàm và truyền `doc` vào
        head: head,
        body: body,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold', halign: 'center' },
        styles: { font: 'Roboto', fontStyle: 'normal', overflow: 'linebreak' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            5: { halign: 'right', cellWidth: 15 },
        }
    });

    return doc;
};


// === HÀM 1: TẢI XUỐNG PDF ===
export const downloadBookTitlePdf = (reportData, username) => {
    const doc = createBookTitlePdfDoc(reportData, username);
    doc.save(`BaoCao_DauSach_${new Date().toISOString().slice(0, 10)}.pdf`);
};


// === HÀM 2: IN PDF ===
export const printBookTitlePdf = (reportData, username) => {
    const doc = createBookTitlePdfDoc(reportData, username);

    // Lấy dữ liệu PDF dưới dạng data URI
    const pdfDataUri = doc.output('datauristring');

    // Tạo một iframe ẩn
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfDataUri;

    document.body.appendChild(iframe);

    // Đợi iframe tải xong rồi gọi lệnh in
    iframe.onload = () => {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch (error) {
            console.error('Không thể tự động mở hộp thoại in.', error);
            alert('Không thể tự động mở hộp thoại in. Vui lòng thử tải xuống và in thủ công.');
        }
    };
};