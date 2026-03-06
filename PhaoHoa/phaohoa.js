const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const sndPop = document.getElementById('sndPop');
const sndWhiz = document.getElementById('sndWhiz');
const sndXoet = document.getElementById('sndXoet');
const bgMusic = document.getElementById('bgMusic');

let fireworks = [];
let particles = [];
let running = false;

// 1. Kiểm tra thiết bị & Hệ thống Resize hoàn chỉnh
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

function resize() {
    // Sử dụng visualViewport để tính toán chính xác trên Mobile khi có thanh địa chỉ
    canvas.width = window.innerWidth;
    canvas.height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
}
window.addEventListener('resize', resize);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resize);
}
resize();

// 2. Hệ thống Text & Wave
let waveTimer = 0;
let waveActive = false;
let textAlpha = 0;
let textFading = false;
let textTimer = 0;
let textDone = false;

function updateText() {
    if (textDone) return;
    if (!textFading) {
        textAlpha += 0.02;
        if (textAlpha >= 1) {
            textAlpha = 1;
            textFading = true;
            textTimer = 60;
        }
    } else {
        textTimer--;
        if (textTimer <= 0) {
            textAlpha -= 0.02;
            if (textAlpha <= 0) {
                textAlpha = 0;
                textDone = true;
            }
        }
    }
}

function drawText() {
    if (textAlpha <= 0 || textDone) return;
    ctx.save();
    ctx.globalAlpha = textAlpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const fontSize = isMobile ? 28 : 52;
    ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;

    ctx.strokeStyle = 'rgba(255, 77, 121, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText("Happy Women's Day 🌸", canvas.width / 2, canvas.height / 2);

    const gradient = ctx.createLinearGradient(canvas.width / 2 - 200, 0, canvas.width / 2 + 200, 0);
    gradient.addColorStop(0, '#ff4d79');
    gradient.addColorStop(0.5, '#fff');
    gradient.addColorStop(1, '#ff4d79');

    ctx.fillStyle = gradient;
    if (!isMobile) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff4d79';
    }
    ctx.fillText("Happy Women's Day 🌸", canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function updateWave() {
    waveTimer--;
    if (waveTimer <= 0) {
        waveActive = !waveActive;
        waveTimer = waveActive ? 180 + Math.floor(Math.random() * 180) : 120 + Math.floor(Math.random() * 120);
    }
}

function drawWatermarkText() {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("KHU TỰ TRỊ GGD", canvas.width / 2, canvas.height - 30);
    ctx.restore();
}

// 3. Lớp Particle & Firework
class Particle {
    constructor(x, y, hue, angle, speed, type) {
        this.x = x; this.y = y;
        this.hue = hue;
        this.angle = angle;
        this.speed = speed;
        this.friction = type === 'willow' ? 0.98 : 0.95;
        this.gravity = type === 'willow' ? 0.08 : 0.15;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.005;
        this.type = type;
        this.size = isMobile ? (type === 'willow' ? 1.2 : 1.8) : (type === 'willow' ? 1 : 1.5);
    }
    update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
    }
    draw() {
        if (this.alpha <= 0.1) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${isMobile ? '80%' : '70%'})`;
        if (Math.random() > 0.5) ctx.fillStyle = '#fff';
        if (!isMobile) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        }
        ctx.fill();
        ctx.restore();
    }
}

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = canvas.height * 0.1 + Math.random() * (canvas.height * 0.4);
        this.speed = 4 + Math.random() * 4;
        this.hue = Math.random() * 360;
        this.type = ['sphere', 'willow', 'ring', 'heart'][Math.floor(Math.random() * 4)];

        if (running) {
            const w = sndWhiz.cloneNode();
            w.volume = 0.3;
            w.play().catch(() => { });
        }
    }
    update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
            this.explode();
            return false;
        }
        return true;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
    }
    explode() {
        if (running) {
            const p = sndPop.cloneNode();
            p.volume = 0.6;
            p.play().catch(() => { });
        }
        let count = isMobile ? 30 : 80;
        if (this.type === 'heart') count = isMobile ? 40 : 100;

        for (let i = 0; i < count; i++) {
            let angle, speed;
            if (this.type === 'sphere') {
                angle = Math.random() * Math.PI * 2;
                speed = Math.random() * (isMobile ? 6 : 8) + 2;
            } else if (this.type === 'willow') {
                angle = Math.random() * Math.PI * 2;
                speed = Math.random() * 4 + 1;
            } else if (this.type === 'ring') {
                angle = (i / count) * Math.PI * 2;
                speed = isMobile ? 4 : 5;
            } else if (this.type === 'heart') {
                angle = (i / count) * Math.PI * 2;
                const t = angle;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                speed = Math.sqrt(x * x + y * y) / (isMobile ? 3 : 2.5);
                angle = Math.atan2(y, x);
            }
            particles.push(new Particle(this.x, this.y, this.hue, angle, speed, this.type));
        }
    }
}

// 4. Vòng lặp chính Animate
function animate() {
    if (!running) return; // Bảo vệ vòng lặp

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWatermarkText();
    updateText();
    drawText();
    updateWave();

    const spawnRate = isMobile ? 0.03 : 0.07;
    if (waveActive && Math.random() < spawnRate) {
        fireworks.push(new Firework());
    }

    fireworks = fireworks.filter(fw => {
        if (fw.update()) { fw.draw(); return true; }
        return false;
    });

    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.alpha > 0.1;
    });

    const maxParticles = isMobile ? 250 : 800;
    if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
    }

    requestAnimationFrame(animate);
}

// 5. Khởi chạy & Điều hướng Back (Mobile Fix)
function startFireworks() {
    if (running) return;
    running = true;

    waveActive = true;
    waveTimer = 180 + Math.floor(Math.random() * 180);

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';

    bgMusic.volume = 0.6;
    bgMusic.play().catch(e => console.log("Music interaction required"));

    [sndPop, sndWhiz, sndXoet].forEach(s => {
        s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(() => { });
    });

    // Thêm điểm dừng lịch sử để nút Back hoạt động
    if (window.history && window.history.pushState) {
        window.history.pushState({ stage: "fireworks" }, "", window.location.href);
    }

    animate();
}

// Lắng nghe nút Back trên Mobile
window.addEventListener('popstate', () => {
    running = false;
    window.location.replace("../Home/index.html");
});

// Chống nóng máy khi ẩn tab
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        running = false;
    } else {
        if (!running && document.getElementById('overlay').style.display === 'none') {
            running = true;
            animate();
        }
    }
});