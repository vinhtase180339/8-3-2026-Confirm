const logoScreen = document.getElementById("logoScreen");
const video = document.getElementById("video");
const enterScreen = document.getElementById("enterScreen");
const enterBtn = document.querySelector(".enter-btn");

let started = false;

function startVideo() {
    if (started) return;
    started = true;

    video.muted = false;
    logoScreen.style.opacity = "0";

    setTimeout(() => {
        logoScreen.style.display = "none";
    }, 600);

    video.play().catch(err => {
        console.log("Video play error:", err);
    });
}

/* Click hoặc Touch để bắt đầu */
logoScreen.addEventListener("click", startVideo);
logoScreen.addEventListener("touchstart", startVideo);

/* KHI VIDEO KẾT THÚC */
video.addEventListener("ended", () => {
    enterScreen.style.opacity = "1";
    enterScreen.style.pointerEvents = "auto";

    // Tự động chuyển trang sau 5 giây
    setTimeout(() => {
        // ĐÃ FIX: Đường dẫn chính xác vào thư mục Home
        window.location.href = "Home/index.html";
    }, 5000);
});

/* BẤM NÚT VÀO WEBSITE */
enterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // ĐÃ FIX: Đường dẫn chính xác vào thư mục Home
    window.location.href = "Home/index.html";
});