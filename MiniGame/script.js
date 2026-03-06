// 🔥 FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCN6zWTlx48eNLKTpqOAnfQkCmTVm0skX0",
    authDomain: "minigametest-52588.firebaseapp.com",
    projectId: "minigametest-52588",
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🎁 QUẢN LÝ QUÀ TẶNG
const rawRewards = [130000, 80000, 50000, 25000, 15000];
const loiChuc = ["Chúc bạn luôn xinh đẹp 💖", "Luôn vui vẻ 🌸", "Hạnh phúc ✨", "Vạn sự như ý 🧧", "Tấn tài lộc 💰"];
let currentUser = "";
let currentBalance = 0;

// 🔐 ĐĂNG NHẬP
async function login() {
    const code = document.getElementById("code").value.trim();
    if (!code) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Thiếu mã rồi!',
            text: 'Vui lòng nhập mã bí mật để tiếp tục.',
            confirmButtonColor: '#ff9a94',
            background: '#fcf5f4',
            color: '#7a5a58'
        });
        return;
    }

    const doc = await db.collection("codes").doc(code).get();
    if (!doc.exists) {
        return Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            title: '<span style="color: #ff4d79; font-family: \'Dancing Script\', cursive; font-size: 2.2rem;">Ôi, có chút nhầm lẫn...</span>',
            html: `
            <div style="font-size: 60px; margin-bottom: 20px; animation: heartBeat 1.5s infinite;">💎</div>
            <p style="font-family: 'Montserrat', sans-serif; font-size: 1.1rem; line-height: 1.6; color: #555;">
                Mã này Admin chưa thấy trong danh sách "nàng thơ" rồi.<br>
                Nàng kiểm tra lại kỹ từng chữ hoặc <b>nhắn tin cho Admin</b> để lấy mã đúng nhé! 🌸
            </p>
        `,
            confirmButtonText: 'Để mình xem lại ngay! ✨',
            confirmButtonColor: '#ff4d79',
            background: '#fff3f5',
            backdrop: `rgba(255, 77, 121, 0.3) blur(8px)`,
            customClass: {
                popup: 'swal-pink-popup'
            }
        });
    }

    currentUser = code;
    const data = doc.data();
    currentBalance = data.money || 0;

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("welcome").innerText = "Code: " + code;

    startListeningStatus(code);
}

// LẮNG NGHE THAY ĐỔI TRONG FIREBASE
function startListeningStatus(code) {
    db.collection("codes").doc(code).onSnapshot((doc) => {
        if (!doc.exists) return;

        const data = doc.data();
        const balance = data.money || 0;
        const resultEl = document.getElementById("result");

        updateBalanceUI(balance);

        if (data.used) {
            if (balance > 0) {
                resultEl.innerHTML = `
                    <div class="status-live pending">
                        <div class="pulse-icon">🧧</div>
                        <p>✨ Chúc mừng! Bạn vừa nhận được phần lộc may mắn trị giá</p> 
                        <span class="money">${balance.toLocaleString()}đ</span> 
                        <p>Vui lòng đợi ít phút để Admin xử lý và chuyển khoản cho bạn nhé! 💖</p>                                     
                    </div>`;
            } else {
                resultEl.innerHTML = `
                    <div class="status-live success">
                         <div class="check-icon">💎</div>
                         <p class="title">Giao dịch thành công!</p>
                         <p class="desc">Món quà nhỏ đã được chuyển đến bạn xinh đẹp.</p>
                         <p class="note">✨ Hãy tận hưởng ngày lễ của riêng mình thật trọn vẹn nhé!</p>
                    </div>`;

                if (currentBalance > 0) {
                    Swal.fire({
                        position: 'center', // ✅ Đã đổi sang center
                        title: 'Ting Ting! 💰',
                        text: 'Lộc đã được Admin chuyển vào tài khoản của bạn rồi nhé!',
                        icon: 'success',
                        confirmButtonColor: '#ff4da6'
                    });

                    if (typeof startFireworks === "function") startFireworks();
                }
            }
        }
        currentBalance = balance;
    });
}

// 🎲 RÚT LỘC
async function rutLoc() {
    if (!currentUser) return;

    const userRef = db.collection("codes").doc(currentUser);
    const statsRef = db.collection("stats").doc("summary");

    if (!document.getElementById('swal-styles')) {
        const s = document.createElement('style');
        s.id = 'swal-styles';
        s.textContent = `
            /* Căn chỉnh lại cho center hợp lý */
            .swal-pink-popup { border-radius: 28px !important; padding: 36px 28px 28px !important; background: #ffffff !important; box-shadow: 0 24px 60px rgba(255,100,160,.18) !important; border: 1.5px solid rgba(255,150,190,.20) !important; font-family: inherit !important; width: 90% !important; max-width: 380px !important; }
            .swal-btn-confirm { background: linear-gradient(135deg, #ff4da6, #ff79c6) !important; border: none !important; color: #fff !important; font-weight: 700 !important; font-size: 14px !important; padding: 12px 32px !important; border-radius: 50px !important; box-shadow: 0 6px 20px rgba(255,77,166,.35) !important; transition: all .25s ease !important; margin: 5px !important; }
            .swal-btn-cancel { background: #f8bbd0 !important; border: none !important; color: #ff4da6 !important; font-weight: 600 !important; font-size: 14px !important; padding: 12px 25px !important; border-radius: 50px !important; transition: all .25s ease !important; margin: 5px !important; }
            .swal-btn-confirm:hover, .swal-btn-cancel:hover { transform: translateY(-2px) !important; opacity: 0.9; }
            .swal2-loader { border-color: #ff79c6 transparent #ff79c6 transparent !important; }
        `;
        document.head.appendChild(s);
    }

    try {
        const checkDoc = await userRef.get();
        if (checkDoc.exists && checkDoc.data().used) {
            throw "used";
        }

        const { value: userName, isDismissed } = await Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            title: '<span style="color: #ff4da6; font-family: \'Dancing Script\', cursive; font-size: 1.8rem;">Nàng tên là gì nhỉ?</span>',
            input: 'text',
            inputPlaceholder: 'Nhập tên hoặc biệt danh của nàng...',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Bốc lộc ngay ✨',
            cancelButtonText: 'Để sau ạ',
            background: '#fff3f5',
            customClass: {
                popup: 'swal-pink-popup',
                confirmButton: 'swal-btn-confirm',
                cancelButton: 'swal-btn-cancel'
            },
            inputAttributes: { maxlength: 20, autofocus: true },
            preConfirm: (value) => {
                if (!value || value.trim() === "") {
                    Swal.showValidationMessage('Cho Admin biết tên để ghi vào bảng vàng nhé! 🌸');
                }
                return value;
            }
        });

        if (isDismissed || !userName) return;

        Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            html: `
                <div style="padding:10px 0 4px;text-align:center;">
                    <div style="font-size:36px;margin-bottom:10px;">🎀</div>
                    <div style="font-size:16px;font-weight:700;color:#e83e8c;margin-bottom:6px;">Đang bốc lộc...</div>
                    <div style="font-size:13px;color:#bbb;font-style:italic;">Vui lòng chờ trong giây lát 🌸</div>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            background: '#fff',
            customClass: { popup: 'swal-pink-popup' },
            didOpen: () => Swal.showLoading(),
        });

        let resultMoney, resultMsg;
        await db.runTransaction(async (t) => {
            const uDoc = await t.get(userRef);
            const sDoc = await t.get(statsRef);
            let stats = sDoc.exists ? sDoc.data() : { winners: 0 };

            if (uDoc.data().used) throw "used";
            if (stats.winners >= 5) throw "empty";

            const money = rawRewards[stats.winners];
            const msg = loiChuc[Math.floor(Math.random() * loiChuc.length)];

            t.update(userRef, {
                used: true,
                money: money,
                reward: money,
                name: userName,
                message: msg,
                time: firebase.firestore.FieldValue.serverTimestamp()
            });
            t.set(statsRef, { winners: stats.winners + 1 }, { merge: true });

            resultMoney = money;
            resultMsg = msg;
            currentBalance = money;
            updateBalanceUI(currentBalance);
        });

        Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            html: `
                <div style="padding:10px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                    <div style="font-size:56px;margin-bottom:8px;line-height:1;">🧧</div>
                    <div style="font-size:22px;font-weight:800;background:linear-gradient(135deg,#ff4da6,#ff79c6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px;">🎉 Chúc mừng ${userName}!</div>
                    <div style="font-size:14px;color:#999;font-style:italic;margin-bottom:20px;">"${resultMsg}"</div>
                    <div style="display:inline-block;background:linear-gradient(135deg,#fff0f7,#ffe4f0);border:2px solid rgba(255,77,166,.18);border-radius:20px;padding:14px 32px;">
                        <div style="font-size:36px;font-weight:800;color:#ff4da6;line-height:1;">${resultMoney.toLocaleString('vi-VN')}<span style="font-size:18px;opacity:.65;">đ</span></div>
                        <div style="font-size:10px;font-weight:600;text-transform:uppercase;color:rgba(255,77,166,.45);margin-top:4px;">Phần thưởng của nàng</div>
                    </div>
                </div>
            `,
            confirmButtonText: '🌸 Tuyệt vời!',
            background: '#fff',
            customClass: { popup: 'swal-pink-popup', confirmButton: 'swal-btn-confirm' },
        });

        const resultEl = document.getElementById("result");
        if (resultEl) {
            resultEl.innerHTML = `<h3>Chúc mừng ${userName}! Bạn nhận được ${resultMoney.toLocaleString('vi-VN')}đ</h3>`;
        }

    } catch (e) {
        const isUsed = e === "used";
        const isEmpty = e === "empty";

        Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            html: `
                <div style="padding:8px 0 4px; text-align:center;">
                    <div style="font-size:52px; margin-bottom:15px;">${isUsed ? '🌹' : isEmpty ? '🪷' : '⚠️'}</div>
                    <div style="font-size:20px; font-weight:800; color:#ff4da6; margin-bottom:12px; font-family:'Dancing Script', cursive;">
                        ${isUsed ? 'Nàng ơi, quà đã nhận rồi...' : isEmpty ? 'Hết lộc mất rồi!' : 'Lỗi nhỏ'}
                    </div>
                    <div style="font-size:14px; color:#666; line-height:1.7;">
                        ${isUsed
                    ? 'Hic hic, nàng tham lam một xíu là Admin "dỗi" đó nha! 🥺<br>Lộc may mắn chỉ dành tặng nàng duy nhất một lần thôi.'
                    : isEmpty ? 'Tiếc quá, các phong bao đã hết sạch rồi! 💐' : e}
                    </div>
                </div>`,
            confirmButtonText: 'Đã hiểu',
            customClass: { popup: 'swal-pink-popup', confirmButton: 'swal-btn-confirm' }
        });
    }
}

// 💳 LOGIC RÚT TIỀN
async function showWithdrawForm() {
    const docSnap = await db.collection("codes").doc(currentUser).get();
    const userData = docSnap.data();

    if (userData.used && (userData.money === 0 || userData.isWithdrawn)) {
        return Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            title: '<span style="color: #ff4d79; font-family: \'Dancing Script\', cursive; font-size: 2.2rem;">Nàng ơi...</span>',
            html: `
                <div style="text-align: center; padding: 10px;">
                    <div style="font-size: 60px; margin-bottom: 15px;">💎</div>
                    <p style="font-family: 'Montserrat', sans-serif; font-size: 1.1rem; color: #555;">
                        Yêu cầu rút lộc của nàng <b>đã hoàn tất</b> rồi nhé!<br>
                        Hy vọng món quà nhỏ này làm nàng thêm vui trong ngày đặc biệt! ✨
                    </p>
                </div>
            `,
            confirmButtonText: 'Yêu Admin quá! ❤️',
            confirmButtonColor: '#ff4d79',
            background: '#fff3f5',
            backdrop: `rgba(255, 77, 121, 0.3) blur(8px)`
        });
    }

    if (currentBalance <= 0) {
        Swal.fire({
            position: 'center', // ✅ Đã đổi sang center
            title: '<span style="color: #ff4d79; font-family: \'Dancing Script\', cursive; font-size: 2.2rem;">Nàng ơi, chờ chút...</span>',
            html: `
                <div style="text-align: center; padding: 10px;">
                    <div style="font-size: 65px; margin-bottom: 20px; animation: heartBeat 1.5s infinite;">👛</div>
                    <p style="font-family: 'Montserrat', sans-serif; font-size: 1.1rem; line-height: 1.6; color: #555;">
                        Ví của nàng hiện đang "trống trải" quá nè.<br>
                        Mau mau <b>Bốc Lì Xì</b> để nạp đầy lộc may mắn ngay thôi! 🌸
                    </p>
                </div>
            `,
            confirmButtonText: 'Đi bốc lộc ngay! 🧧',
            confirmButtonColor: '#ff4d79',
            background: '#fff3f5',
            backdrop: `rgba(255, 77, 121, 0.3) blur(8px)`,
            customClass: { popup: 'my-swal-border' }
        });
        return;
    }

    document.getElementById("drawAmount").value = currentBalance.toLocaleString() + " VNĐ";
    document.getElementById("main").style.display = "none";
    document.getElementById("withdrawSection").style.display = "block";
    updateQR();
}

function hideWithdrawForm() {
    document.getElementById("withdrawSection").style.display = "none";
    document.getElementById("main").style.display = "block";
}

async function updateQR() {
    const bank = document.getElementById('bankId').value;
    const acc = document.getElementById('accNumber').value;

    const doc = await db.collection("codes").doc(currentUser).get();
    const name = doc.data().name || currentUser;

    if (bank && acc && currentBalance > 0) {

        const qrUrl = `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?amount=${currentBalance}&addInfo=Loc83_${currentUser}_${name}`;
        document.getElementById('qrImg').src = qrUrl;
        document.getElementById('qrArea').style.display = 'block';

    } else {
        document.getElementById('qrArea').style.display = 'none';
    }
}

async function confirmWithdraw() {
    const bank = document.getElementById('bankId').value;
    const acc = document.getElementById('accNumber').value;

    if (!bank || !acc) {
        return Swal.fire({ position: 'center', icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng chọn ngân hàng và nhập STK!' });
    }

    const result = await Swal.fire({
        position: 'center', // ✅ Đã đổi sang center
        title: 'Xác nhận rút lộc?',
        html: `Bạn muốn rút <b style="color:#d81b60;">${currentBalance.toLocaleString()}đ</b> về tài khoản?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đúng, rút ngay!',
        cancelButtonText: 'Để xem lại'
    });

    if (result.isConfirmed) {
        try {
            await db.collection("withdrawals").add({
                code: currentUser,
                bank: bank,
                account: acc,
                amount: currentBalance,
                status: "pending",
                time: firebase.firestore.FieldValue.serverTimestamp()
            });

            await db.collection("codes").doc(currentUser).update({
                isWithdrawn: true
            });

            await Swal.fire({
                position: 'center', // ✅ Đã đổi sang center
                icon: 'success',
                title: 'Đã gửi yêu cầu!',
                text: 'Hệ thống đang chờ Admin xác nhận và chuyển khoản.',
                timer: 2500,
                showConfirmButton: false
            });

            hideWithdrawForm();

        } catch (e) {
            Swal.fire({ position: 'center', icon: 'error', title: 'Lỗi!', text: e.message });
        }
    }
}

function updateBalanceUI(val) {
    document.getElementById("userBalance").innerText = val.toLocaleString() + " VNĐ";
}

function loadRanking() {
    db.collection("codes").onSnapshot(snap => {
        const list = document.getElementById("ranking");
        if (!list) return;
        list.innerHTML = "";
        let arr = [];

        snap.forEach(doc => {
            const d = doc.data();
            if (d.used) {
                arr.push({
                    name: d.name || doc.id,
                    money: (d.reward !== undefined) ? d.reward : (d.money || 0),
                    time: d.time || 0
                });
            }
        });

        arr.sort((a, b) => {
            const timeA = a.time?.seconds || a.time || 0;
            const timeB = b.time?.seconds || b.time || 0;
            return timeB - timeA;
        });

        const getTag = (m) => {
            if (m >= 130000) return '<small style="color:#ff4da6; font-size: 11px !important;">(Đại Cát ✨)</small>';
            if (m >= 80000) return '<small style="color:#ff79c6; font-size: 11px !important;">(Tài Lộc 🧧)</small>';
            return '<small style="color:#bbb; font-size: 11px !important;">(May Mắn 🎀)</small>';
        };

        arr.forEach((u) => {
            const li = document.createElement("li");
            let timeStr = "--:--";
            if (u.time) {
                const date = u.time.toDate ? u.time.toDate() : new Date(u.time.seconds * 1000 || u.time);
                const hh = String(date.getHours()).padStart(2, '0');
                const mm = String(date.getMinutes()).padStart(2, '0');
                timeStr = `${hh}:${mm}`;
            }

            li.style.cssText = `display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; gap: 10px; list-style: none; border-bottom: 1px solid #fff5f7;`;
            li.innerHTML = `
                <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
                    <span style="display: flex; align-items: center; white-space: nowrap; overflow: hidden;">
                        <span style="margin-right: 6px; font-size: 14px;">🧧</span>
                        <b style="overflow: hidden; text-overflow: ellipsis; font-size: 13px; color: #444;">${u.name}</b>
                    </span>
                    <small style="font-size: 10px; color: #ccc; margin-left: 22px;">🕒 ${timeStr}</small>
                </div>
                <div style="white-space: nowrap; flex-shrink: 0; text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                    <span style="color: #ff4da6; font-weight: 700; font-size: 13px;">💰 ${u.money.toLocaleString()}đ</span>
                    ${getTag(u.money)}
                </div>`;
            list.appendChild(li);
        });

        if (arr.length === 0) {
            list.innerHTML = "<li style='color:#ccc; font-style:italic; text-align:center; padding: 20px 0;'>🌸 Đang chờ nàng thơ đầu tiên...</li>";
        }
    });
}

function logout() { location.reload(); }
function goHome() { window.location.href = "../Home/index.html"; }

loadRanking();

window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    const music = document.getElementById("bgMusic");
    const tryPlay = () => music.play().catch(() => { });
    if (params.get("playMusic") === "true") tryPlay();
    document.addEventListener("touchstart", tryPlay, { once: true });
    document.addEventListener("click", tryPlay, { once: true });
});