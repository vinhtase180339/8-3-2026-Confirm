/* ============================================================
   FIREBASE CONFIG
============================================================ */
const firebaseConfig = {
    apiKey: "AIzaSyCN6zWTlx48eNLKTpqOAnfQkCmTVm0skX0",
    authDomain: "minigametest-52588.firebaseapp.com",
    projectId: "minigametest-52588",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


/* ============================================================
   PETAL ANIMATION
============================================================ */
(function () {
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    let petals = [];
    let W, H;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function randomBetween(a, b) { return a + Math.random() * (b - a); }
    function spawnPetal() {
        petals.push({
            x: randomBetween(0, W), y: -20,
            size: randomBetween(5, 11), speedY: randomBetween(0.8, 2.2),
            speedX: randomBetween(-0.6, 0.6), angle: randomBetween(0, Math.PI * 2),
            spin: randomBetween(-0.025, 0.025), opacity: randomBetween(0.3, 0.65),
            hue: randomBetween(330, 355),
        });
    }
    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = p.opacity;
        ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 90%, 78%)`; ctx.fill(); ctx.restore();
    }
    let frame = 0;
    function loop() {
        ctx.clearRect(0, 0, W, H); frame++;
        if (frame % 18 === 0 && petals.length < 42) spawnPetal();
        petals = petals.filter(p => p.y < H + 30);
        petals.forEach(p => {
            p.y += p.speedY; p.x += p.speedX + Math.sin(p.y * 0.015) * 0.3; p.angle += p.spin;
            drawPetal(p);
        });
        requestAnimationFrame(loop);
    }
    loop();
})();


/* ============================================================
   STATS
============================================================ */
function updateStats() {
    db.collection("withdrawals").get().then(s => document.getElementById('totalCount').textContent = s.size);
    db.collection("withdrawals").where("status", "==", "completed").get().then(s => document.getElementById('paidCount').textContent = s.size);
    db.collection("withdrawals").where("status", "==", "pending").get().then(s => document.getElementById('pendingCount').textContent = s.size);
}
updateStats();


/* ============================================================
   REALTIME LISTENER — pending
============================================================ */
db.collection("withdrawals").where("status", "==", "pending").onSnapshot(snap => {
    const list = document.getElementById("adminList");
    document.getElementById('pendingCount').textContent = snap.size;
    list.innerHTML = "";

    if (snap.empty) {
        list.innerHTML = `<div class="empty-msg"><h2>🎉 Tuyệt vời!</h2><p>Không còn yêu cầu nào đang chờ xử lý. Nghỉ ngơi thôi!</p></div>`;
        return;
    }

    snap.forEach(doc => {
        const data = doc.data();
        const qrUrl = `https://img.vietqr.io/image/${data.bank}-${data.account}-compact2.png?amount=${data.amount}&addInfo=Chuc_Mung_8_3_${data.code}`;
        list.innerHTML += `
            <div class="card">
                <div class="qr-container">
                    <img src="${qrUrl}" class="qr-img" alt="Quét mã chuyển khoản">
                    <p class="qr-label">Quét mã tại đây</p>
                </div>
                <div class="info">
                    <p>👤 <span class="user-tag">Mã: ${data.code}</span></p>
                    <p>🏦 <span class="bank-tag">${data.bank.toUpperCase()}</span></p>
                    <p><span class="stk">${data.account}</span></p>
                    <p><span class="amount">${Number(data.amount).toLocaleString('vi-VN')} VNĐ</span></p>
                </div>
                <button class="btn-done" onclick="markDone('${doc.id}', '${data.code}')">
                    <span>Đã chuyển</span>
                    <small>(Bấm để ẩn yêu cầu)</small>
                </button>
            </div>`;
    });
});


/* ============================================================
   SEARCH FILTER (pending)
============================================================ */
document.getElementById('searchInput').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
});


/* ============================================================
   MARK DONE
============================================================ */
async function markDone(id, userCode) {
    const result = await Swal.fire({
        position: 'center', title: 'Xác nhận chuyển khoản?',
        text: `Bạn đã thực hiện chuyển tiền thành công cho mã ${userCode} chưa?`,
        icon: 'question', iconColor: '#e8194a', showCancelButton: true,
        confirmButtonColor: '#1db87a', cancelButtonColor: '#e8194a',
        confirmButtonText: 'Đã chuyển xong', cancelButtonText: 'Chưa, quay lại',
        reverseButtons: true, background: '#2a0a14', color: '#fdeaea', backdrop: 'rgba(0,0,0,0.6)',
    });
    if (!result.isConfirmed) return;

    try {
        Swal.fire({ position: 'center', title: 'Đang cập nhật...', allowOutsideClick: false, background: '#2a0a14', color: '#fdeaea', didOpen: () => Swal.showLoading() });

        await db.collection("withdrawals").doc(id).update({
            status: "completed",
            processedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        if (userCode) await db.collection("codes").doc(userCode).update({ money: 0 });

        updateStats();
        Swal.fire({ position: 'center', title: 'Thành công! 🌸', text: 'Lệnh đã được duyệt và thông báo đã gửi tới khách.', icon: 'success', timer: 1500, showConfirmButton: false, background: '#2a0a14', color: '#fdeaea' });
    } catch (error) {
        Swal.fire({ position: 'center', title: 'Lỗi hệ thống!', text: error.message, icon: 'error', background: '#2a0a14', color: '#fdeaea' });
    }
}


/* ============================================================
   HISTORY — state
============================================================ */
let historyAllRows = [];
let historyFiltered = [];
let historyPage = 1;
const HISTORY_PER_PAGE = 10;

// Store raw Firestore data keyed by doc id for PDF generation
const historyRawData = {};


/* ============================================================
   HISTORY — format time
============================================================ */
function formatTime(ts) {
    if (!ts) return '—';
    let date;
    if (ts.toDate) date = ts.toDate();
    else if (ts.seconds) date = new Date(ts.seconds * 1000);
    else date = new Date(ts);
    return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}


/* ============================================================
   HISTORY — render table
============================================================ */
function renderHistoryTable() {
    const tbody = document.getElementById('historyBody');
    const totalEl = document.getElementById('historyTotal');

    if (historyFiltered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="history-empty">🌸 Chưa có giao dịch nào được hoàn thành.</td></tr>`;
        totalEl.innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const totalAmount = historyFiltered.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const totalPages = Math.ceil(historyFiltered.length / HISTORY_PER_PAGE);
    if (historyPage > totalPages) historyPage = totalPages;
    const start = (historyPage - 1) * HISTORY_PER_PAGE;
    const pageRows = historyFiltered.slice(start, start + HISTORY_PER_PAGE);

    tbody.innerHTML = pageRows.map((row, i) => `
        <tr style="animation-delay:${i * 0.04}s">
            <td>${start + i + 1}</td>
            <td><span class="td-code">${row.code || '—'}</span></td>
            <td><span class="td-bank">${(row.bank || '').toUpperCase()}</span></td>
            <td><span class="td-account">${row.account || '—'}</span></td>
            <td><span class="td-amount">${Number(row.amount || 0).toLocaleString('vi-VN')} ₫</span></td>
            <td><span class="td-time">${formatTime(row.processedAt || row.createdAt)}</span></td>
            <td><span class="status paid">✓ Hoàn thành</span></td>
            <td>
                <button class="btn-print-pdf" onclick="triggerPDF('${row.id}')" title="Xuất phiếu xác nhận PDF">
                    <span>🖨 PDF</span>
                </button>
            </td>
        </tr>`).join('');

    totalEl.innerHTML = `Tổng cộng <strong>${historyFiltered.length}</strong> giao dịch &nbsp;|&nbsp; Tổng tiền đã chuyển: <strong>${totalAmount.toLocaleString('vi-VN')} ₫</strong>`;
    renderPagination(totalPages);
}


/* ============================================================
   PDF trigger — lấy raw Firestore data rồi gọi printReceipt
============================================================ */
function triggerPDF(docId) {
    const raw = historyRawData[docId];
    if (!raw) {
        Swal.fire({ position: 'center', title: 'Không tìm thấy dữ liệu', icon: 'error', background: '#2a0a14', color: '#fdeaea' });
        return;
    }
    try {
        printReceipt(raw);
    } catch (e) {
        Swal.fire({ position: 'center', title: 'Lỗi tạo PDF', text: e.message, icon: 'error', background: '#2a0a14', color: '#fdeaea' });
    }
}


/* ============================================================
   PAGINATION
============================================================ */
function renderPagination(totalPages) {
    const pg = document.getElementById('pagination');
    if (totalPages <= 1) { pg.innerHTML = ''; return; }
    let html = `<button class="page-btn" onclick="goPage(${historyPage - 1})" ${historyPage === 1 ? 'disabled' : ''}>‹</button>`;
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= historyPage - 2 && p <= historyPage + 2)) {
            html += `<button class="page-btn ${p === historyPage ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
        } else if (p === historyPage - 3 || p === historyPage + 3) {
            html += `<button class="page-btn" disabled style="border:none;opacity:.4">…</button>`;
        }
    }
    html += `<button class="page-btn" onclick="goPage(${historyPage + 1})" ${historyPage === totalPages ? 'disabled' : ''}>›</button>`;
    pg.innerHTML = html;
}

function goPage(p) {
    historyPage = p;
    renderHistoryTable();
    document.querySelector('.history-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ============================================================
   HISTORY — realtime listener
============================================================ */
db.collection("withdrawals").where("status", "==", "completed")
    .orderBy("processedAt", "desc")
    .onSnapshot(snap => {
        snap.docs.forEach(doc => { historyRawData[doc.id] = { id: doc.id, ...doc.data() }; });
        historyAllRows = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        applyHistorySearch();
    }, () => {
        // Fallback nếu chưa có composite index
        db.collection("withdrawals").where("status", "==", "completed").onSnapshot(snap2 => {
            snap2.docs.forEach(doc => { historyRawData[doc.id] = { id: doc.id, ...doc.data() }; });
            historyAllRows = snap2.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => (b.processedAt?.seconds || 0) - (a.processedAt?.seconds || 0));
            applyHistorySearch();
        });
    });


/* ============================================================
   HISTORY — search
============================================================ */
function applyHistorySearch() {
    const q = (document.getElementById('historySearch')?.value || '').trim().toLowerCase();
    historyFiltered = !q ? [...historyAllRows] : historyAllRows.filter(r =>
        (r.code || '').toLowerCase().includes(q) ||
        (r.bank || '').toLowerCase().includes(q) ||
        (r.account || '').toLowerCase().includes(q) ||
        String(r.amount || '').includes(q)
    );
    historyPage = 1;
    renderHistoryTable();
}

document.getElementById('historySearch').addEventListener('input', applyHistorySearch);


/* ============================================================
   EXPORT CSV
============================================================ */
function exportCSV() {
    if (!historyAllRows.length) {
        Swal.fire({ position: 'center', title: 'Không có dữ liệu', text: 'Chưa có giao dịch nào để xuất.', icon: 'info', background: '#2a0a14', color: '#fdeaea', confirmButtonColor: '#d4a84b' });
        return;
    }
    const header = ['STT', 'Mã', 'Ngân hàng', 'Số tài khoản', 'Số tiền (VNĐ)', 'Thời gian xử lý', 'Trạng thái'];
    const rows = historyAllRows.map((r, i) => [i + 1, r.code || '', (r.bank || '').toUpperCase(), r.account || '', r.amount || 0, formatTime(r.processedAt || r.createdAt), 'Hoàn thành']);
    const csv = [header, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `lich-su-giao-dich-8-3-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv` });
    a.click();
    URL.revokeObjectURL(a.href);
    Swal.fire({ position: 'center', title: 'Xuất thành công! 🌸', text: `Đã xuất ${historyAllRows.length} giao dịch.`, icon: 'success', timer: 1800, showConfirmButton: false, background: '#2a0a14', color: '#fdeaea' });
}


/* ============================================================
   PDF RECEIPT GENERATOR - BRANDED PINK EDITION (#FFB7B2)
   Gọi từ: triggerPDF(docId)
============================================================ */

/**
 * 1. Hàm định dạng thời gian riêng cho PDF (Fix lỗi undefined)
 */
/* ============================================================
   PHẦN CẬP NHẬT: PDF RECEIPT GENERATOR - PINK EDITION
   ============================================================ */

// 1. Hàm bổ trợ định dạng thời gian (Phải có để không lỗi undefined)

function formatTimePDF(ts) {
    if (!ts) return '—';
    let date;
    if (ts.toDate) date = ts.toDate();
    else if (ts.seconds) date = new Date(ts.seconds * 1000);
    else date = new Date(ts);

    return date.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

// 2. Hàm chính tạo PDF
function printReceipt(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

    const W = doc.internal.pageSize.getWidth();   // 148 mm
    const H = doc.internal.pageSize.getHeight();  // 210 mm
    const amount = Number(data.amount || 0);

    // Bảng màu hồng pastel đồng bộ #FFB7B2
    const pinkPastel = [255, 183, 178];
    const pinkDeep = [212, 120, 114];
    const textColor = [80, 60, 60];

    // Helpers vẽ nhanh
    const cx = (text, y, size, style = 'normal', color = textColor) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, W / 2, y, { align: 'center' });
    };
    const lx = (text, x, y, size, style = 'normal', color = textColor) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, x, y);
    };
    const rx = (text, x, y, size, style = 'normal', color = [50, 30, 30]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, x, y, { align: 'right' });
    };

    // --- Bắt đầu vẽ nội dung ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, 'F');

    // Khối Header màu hồng
    doc.setFillColor(...pinkPastel);
    doc.rect(0, 0, W, 45, 'F');

    /// 1. Hình tròn Logo làm nền
    doc.setFillColor(255, 255, 255);
    doc.circle(W / 2, 20, 15, 'F');

    // 2. CHÈN LOGO
    const logoUrl = "../image/logo.png";
    try {
        // Sử dụng định dạng 'PNG' hoặc 'JPEG' tùy theo file của bạn
        // Tọa độ (W/2 - 10, 10) và kích thước 20x20mm để nằm gọn trong vòng tròn
        doc.addImage(logoUrl, 'PNG', W / 2 - 10, 10, 20, 20);
    } catch (e) {
        console.warn("Không thể tải logo từ đường dẫn, đang sử dụng văn bản thay thế.");
        // Thay vì dùng icon 🌸 (dễ bị lỗi Ø<ß8), ta dùng chữ "GGD" hoặc để trống
        doc.setFontSize(10);
        doc.setTextColor(212, 120, 114); // Màu hồng đậm
        doc.setFont('helvetica', 'bold');
        doc.text('Khu Tu Tri GGD', W / 2, 22, { align: 'center' });
    }

    cx('PHIEU XAC NHAN GIAO DICH', 55, 12, 'bold', pinkDeep);
    cx('CHUC MUNG NGAY QUOC TE PHU NU 8/3', 62, 7, 'normal', [150, 100, 100]);

    // Mã giao dịch
    const refNo = `GGD-${(data.code || 'XXX').toUpperCase()}-${Date.now().toString().slice(-4)}`;
    doc.setDrawColor(...pinkPastel);
    doc.setLineWidth(0.5);
    doc.roundedRect(W / 2 - 35, 68, 70, 8, 4, 4, 'S');
    cx(`Ma giao dich: ${refNo}`, 73.5, 7, 'bold', pinkDeep);

    // Bảng dữ liệu
    let rowY = 90;
    const rows = [
        { label: 'Nguoi nhan (Code):', value: (data.code || '—').toUpperCase() },
        { label: 'Ngan hang:', value: (data.bank || '—').toUpperCase() },
        { label: 'So tai khoan:', value: data.account || '—' },
        { label: 'Thoi gian xu ly:', value: formatTimePDF(data.processedAt || data.createdAt) },
    ];

    rows.forEach((r) => {
        doc.setDrawColor(245, 230, 230);
        doc.line(15, rowY + 3, W - 15, rowY + 3);
        lx(r.label, 18, rowY, 8.5, 'normal', [130, 110, 110]);
        rx(r.value, W - 18, rowY, 9, 'bold', [60, 40, 40]);
        rowY += 12;
    });

    // Khối tiền
    const amountY = rowY + 12;
    doc.setFillColor(255, 248, 248);
    doc.roundedRect(15, amountY - 8, W - 30, 20, 3, 3, 'F');
    doc.setDrawColor(...pinkPastel);
    doc.roundedRect(15, amountY - 8, W - 30, 20, 3, 3, 'S');

    lx('TONG SO TIEN:', 22, amountY + 4, 8, 'bold', pinkDeep);
    rx(`${amount.toLocaleString('vi-VN')} VND`, W - 22, amountY + 5, 15, 'bold', pinkDeep);

    // Dấu mộc
    doc.setDrawColor(...pinkPastel);
    doc.setLineWidth(0.8);
    doc.circle(W - 30, H - 42, 14, 'S');
    doc.setFontSize(7);
    doc.setTextColor(...pinkDeep);
    doc.text('DA DUYET', W - 30, H - 44, { align: 'center' });
    doc.text('ADMIN GGD', W - 30, H - 39, { align: 'center' });

    // Chân trang
    doc.setFillColor(...pinkPastel);
    doc.rect(0, H - 15, W, 15, 'F');
    cx('He thong Khu Tu Tri GGD · Chuc ban 8/3 hanh phuc!', H - 6, 7, 'normal', [255, 255, 255]);

    const fileName = `Bill-8M3-${(data.code || 'User').toLowerCase()}.pdf`;
    doc.save(fileName);
}
