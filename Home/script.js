// ── Custom cursor ──────────────────────────────────
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ── Petals falling ─────────────────────────────────
const emojis = ['🌸', '🌺', '🌷', '💮', '🌹'];
const petalContainer = document.getElementById('petals');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (5 + Math.random() * 8) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  petalContainer.appendChild(p);
}

// ── Hearts burst on click ──────────────────────────
document.addEventListener('click', e => {
  if (e.target.closest('.modal-box') || e.target.closest('.game-area')) return;
  const hearts = ['❤️', '💕', '💗', '💖', '🌸'];
  const h = document.createElement('div');
  h.className = 'heart-burst';
  h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  h.style.left = e.clientX + 'px';
  h.style.top = e.clientY + 'px';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 800);
});

// ── Scroll reveal ──────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
reveals.forEach(r => io.observe(r));

// ══════════════════════════════════════════════════
// WISH GENERATOR — Random Pool
// ══════════════════════════════════════════════════
const wishPool = [
  {
    text: "Chúc mừng ngày 8/3! \nHôm nay là ngày của bạn — hãy để mình được nhắc bạn rằng bạn tuyệt vời hơn bạn nghĩ rất nhiều. Cảm ơn vì đã luôn tỏa sáng và truyền năng lượng tích cực cho những người xung quanh.",
    author: "— Tri ân ngày Phụ Nữ —",
    tags: ["💖 Trân trọng", "🌸 Ngày của bạn"]
  },
  {
    text: "Phụ nữ không cần phải hoàn hảo để trở nên phi thường. \nChúc bạn luôn dịu dàng với chính mình, mạnh mẽ khi cần, và hạnh phúc mỗi ngày theo cách riêng của mình.",
    author: "— Chúc mừng 8/3 —",
    tags: ["💪 Mạnh mẽ", "🌷 Dịu dàng"]
  },
  {
    text: "Bạn là người phụ nữ đặc biệt nhất. \nKhông phải vì bạn hoàn hảo — mà vì bạn thật, bạn chân thành, và bạn yêu thương bằng cả trái tim. Chúc bạn luôn được yêu thương xứng đáng như thế.",
    author: "— Từ trái tim đến trái tim —",
    tags: ["❤️ Yêu thương", "✨ Chân thành"]
  },
  {
    text: "Chúc người phụ nữ xinh đẹp của chúng ta \nluôn mạnh khỏe, hạnh phúc và rạng rỡ như bông hoa mùa xuân. Mong mọi điều tốt đẹp nhất sẽ đến với bạn trong năm nay và mãi mãi.",
    author: "— Ngày Quốc Tế Phụ Nữ 8/3 —",
    tags: ["🌺 Rực rỡ", "🌟 Hạnh phúc"]
  },
  {
    text: "Có những người phụ nữ làm cuộc sống này đẹp hơn chỉ bằng sự hiện diện của họ. \nBạn là một trong số đó. Cảm ơn vì đã là chính mình — điều đó đã là món quà tuyệt vời nhất.",
    author: "— Lời chúc chân thành —",
    tags: ["💐 Món quà", "🌸 Hiện diện"]
  },
  {
    text: "Ngày 8/3 không chỉ là một ngày — \nđó là lời nhắc nhở rằng người phụ nữ xứng đáng được trân trọng mỗi ngày trong năm. Chúc bạn luôn nhận được tình yêu thương mà bạn xứng đáng được nhận.",
    author: "— Trân trọng mỗi ngày —",
    tags: ["💝 Trân trọng", "🗓️ Mỗi ngày"]
  },
  {
    text: "Phụ nữ — dịu dàng như hoa, \nmạnh mẽ như thép, ấm áp như nắng. Chúc bạn luôn giữ được vẻ đẹp đó trong cuộc sống đầy bận rộn và thử thách.",
    author: "— Kính tặng người phụ nữ —",
    tags: ["🌸 Dịu dàng", "⚡ Mạnh mẽ", "☀️ Ấm áp"]
  },
  {
    text: "Chúc bạn một ngày 8/3 tràn đầy nụ cười! \nMong bạn được nghỉ ngơi, được chăm sóc, và được nhắc nhở rằng những gì bạn làm mỗi ngày — dù nhỏ hay lớn — đều có ý nghĩa và đáng trân trọng.",
    author: "— Với tất cả yêu thương —",
    tags: ["😊 Nụ cười", "🫶 Trân trọng"]
  },
  {
    text: "Bạn đã vượt qua rất nhiều thứ \nvà vẫn đứng vững — điều đó không phải ai cũng làm được. Chúc mừng ngày 8/3, chúc bạn tiếp tục tỏa sáng theo cách chỉ bạn mới có thể làm được.",
    author: "— Ngưỡng mộ và trân trọng —",
    tags: ["💪 Kiên cường", "✨ Tỏa sáng"]
  },
  {
    text: "Hoa nở vì xuân, xuân đến vì bạn. \nNhân ngày 8 tháng 3, xin gửi đến bạn những điều đẹp đẽ nhất: sức khỏe, hạnh phúc, tình yêu và những ước mơ sẽ thành sự thật.",
    author: "— Mùa xuân yêu thương —",
    tags: ["🌸 Hoa nở", "🌷 Mùa xuân", "💫 Ước mơ"]
  },
  {
    text: "Cảm ơn bạn vì đã luôn cố gắng, \nluôn yêu thương, và luôn cho đi dù đôi khi bạn cũng cần được nhận lại. Hôm nay, hãy để chúng tôi trao cho bạn tất cả những yêu thương đó.",
    author: "— Ngày của bạn 8/3 —",
    tags: ["🙏 Biết ơn", "💕 Yêu thương"]
  },
  {
    text: "Người phụ nữ đẹp nhất \nkhông phải người có khuôn mặt hoàn hảo — mà là người có trái tim nhân hậu, nụ cười chân thành và ánh mắt ấm áp. Bạn đẹp theo cách đó. Chúc mừng 8/3!",
    author: "— Vẻ đẹp từ bên trong —",
    tags: ["💛 Nhân hậu", "😊 Chân thành"]
  },
];

let currentWishIdx = -1;

function openWish() {
  shuffleWish();
  document.getElementById('wishModal').classList.add('open');
}

function shuffleWish() {
  let newIdx;
  do { newIdx = Math.floor(Math.random() * wishPool.length); }
  while (newIdx === currentWishIdx && wishPool.length > 1);
  currentWishIdx = newIdx;

  const wish = wishPool[currentWishIdx];
  const textEl = document.getElementById('wishRandomText');
  const authorEl = document.getElementById('wishAuthor');
  const tagRow = document.getElementById('wishTagRow');

  textEl.style.opacity = '0';
  setTimeout(() => {
    textEl.textContent = wish.text;
    authorEl.textContent = wish.author;
    tagRow.innerHTML = wish.tags.map(t => `<span class="wish-tag">${t}</span>`).join('');
    textEl.style.animation = 'none';
    textEl.offsetHeight;
    textEl.style.animation = '';
    textEl.style.opacity = '1';
  }, 200);
}

function copyRandomWish() {
  const text = document.getElementById('wishRandomText').textContent;
  navigator.clipboard.writeText(text).catch(() => { });
  const toast = document.getElementById('copyToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ══════════════════════════════════════════════════
// GALLERY — 3D CAROUSEL + LIGHTBOX
// ══════════════════════════════════════════════════

const galleryPhotos = [
  { url: '../image/bong.jpg', caption: 'Bông' },
  { url: '../image/cam.jpg', caption: 'Cam' },
  { url: '../image/choc.jpg', caption: 'Chốc' },
  { url: '../image/ebe.jpg', caption: 'E Bé' },
  { url: '../image/hoai.jpg', caption: 'Hoài' },
  { url: '../image/lui.jpg', caption: 'Lu i' },
  { url: '../image/yu.jpg', caption: 'Yuu' },
  { url: '../image/linh.jpg', caption: 'Linh' },
  { url: '../image/lamdandan.jpg', caption: 'Lâm Đan Đan' },
  { url: '../image/nga.jpg', caption: 'Nga' },
  { url: '../image/enen.jpg', caption: 'Én Én' },
  { url: '../image/cun.jpg', caption: 'Cún' },
  { url: '../image/phuonghoahong.jpg', caption: 'Phượng Hoa Hồng' },
  { url: '../image/shujin.jpg', caption: 'Shujin' },
  { url: '../image/meo.jpg', caption: 'Mèo' },
  { url: '../image/ngoclinh.jpg', caption: 'Ngọc Linh' },
  { url: '../image/lamsy.jpg', caption: 'Lam Sy' },
  { url: '../image/hanie.jpg', caption: 'Hannie' },
  { url: '../image/emmoc.jpg', caption: 'Em Mốc' },
];

let lightboxIndex = 0;
let carouselAngle = 0;
let carouselSpeed = 0;
let targetSpeed = 1;
let carouselRunning = false;
let carouselRAF = null;
let isDragging = false;
let dragStartX = 0;
let dragStartAngle = 0;

const speedLevels = [
  { val: 0.1, label: 'Rất chậm 🐢' },
  { val: 0.2, label: 'Bình thường 🙂' },
  { val: 0.3, label: 'Nhanh 🐇' },
  { val: 0.5, label: 'Rất nhanh 🚀' },
];
let speedIdx = 1;

function buildCarousel() {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = '';
  const n = galleryPhotos.length;
  const radius = 360;

  galleryPhotos.forEach((photo, i) => {
    const angle = (360 / n) * i;
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    card.innerHTML = `<img src="${photo.url}" alt="${photo.caption}" loading="lazy"><div class="card-shine"></div>`;
    card.addEventListener('click', () => openLightbox(i));
    track.appendChild(card);
  });
}

function init3DGallery() {
  const container = document.querySelector('.gallery-container');
  if (!container) return;

  container.innerHTML = galleryPhotos.map((photo, index) => `
    <div class="gallery-item" style="--i: ${index}">
      <img src="${photo.url}" alt="${photo.caption}">
    </div>
  `).join('');

  const items = document.querySelectorAll('.gallery-item');
  const total = items.length;
  const angleStep = 360 / total;

  items.forEach((item, i) => {
    const radius = 600;
    const angle = i * angleStep;
    item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
}

function animateCarousel() {
  if (!carouselRunning) return;
  carouselSpeed += (targetSpeed - carouselSpeed) * 0.05;
  if (!isDragging) carouselAngle -= carouselSpeed;
  const track = document.getElementById('carouselTrack');
  if (track) track.style.transform = `rotateY(${carouselAngle}deg)`;
  carouselRAF = requestAnimationFrame(animateCarousel);
}

function openSlideshow() {
  buildCarousel();
  document.getElementById('slideshowModal').classList.add('open');
  carouselRunning = true;
  carouselAngle = 0;
  carouselSpeed = 0;
  speedIdx = 1;
  targetSpeed = speedLevels[speedIdx].val;
  document.getElementById('speedLabel').textContent = speedLevels[speedIdx].label;
  document.getElementById('playBtn').textContent = '⏸';
  cancelAnimationFrame(carouselRAF);
  animateCarousel();
  setupCarouselDrag();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (id === 'slideshowModal') {
    carouselRunning = false;
    cancelAnimationFrame(carouselRAF);
  }
  if (id === 'gameModal') stopGame();
}

function toggleCarousel() {
  if (carouselRunning) {
    carouselRunning = false;
    cancelAnimationFrame(carouselRAF);
    document.getElementById('playBtn').textContent = '▶';
  } else {
    carouselRunning = true;
    document.getElementById('playBtn').textContent = '⏸';
    animateCarousel();
  }
}

function carouselFaster() {
  if (speedIdx < speedLevels.length - 1) {
    speedIdx++;
    targetSpeed = speedLevels[speedIdx].val;
    document.getElementById('speedLabel').textContent = speedLevels[speedIdx].label;
  }
}

function carouselSlower() {
  if (speedIdx > 0) {
    speedIdx--;
    targetSpeed = speedLevels[speedIdx].val;
    document.getElementById('speedLabel').textContent = speedLevels[speedIdx].label;
  }
}

function setupCarouselDrag() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const newTrack = track.cloneNode(true);
  track.parentNode.replaceChild(newTrack, track);

  newTrack.querySelectorAll('.carousel-card').forEach((card, i) => {
    card.addEventListener('click', () => openLightbox(i));
  });

  const onDown = e => {
    isDragging = true;
    dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartAngle = carouselAngle;
  };
  const onMove = e => {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = (x - dragStartX) * 0.4;
    carouselAngle = dragStartAngle + delta;
    newTrack.style.transform = `rotateY(${carouselAngle}deg)`;
  };
  const onUp = () => { isDragging = false; };

  newTrack.addEventListener('mousedown', onDown);
  newTrack.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}

// ── Lightbox ───────────────────────────────────────
function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
}

function renderLightbox() {
  const photo = galleryPhotos[lightboxIndex];
  const img = document.getElementById('lightboxImg');
  img.style.opacity = '0';
  img.src = photo.url;
  img.onload = () => { img.style.transition = 'opacity 0.3s'; img.style.opacity = '1'; };
  document.getElementById('lightboxCounter').textContent =
    `${lightboxIndex + 1} / ${galleryPhotos.length}  ·  ${photo.caption}`;
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + galleryPhotos.length) % galleryPhotos.length;
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'Escape') closeLightbox();
});

// ══════════════════════════════════════════════════
// MUSIC PLAYER — Web Audio API (mobile volume fix)
// ══════════════════════════════════════════════════

const playlist = [
  { title: '🌸 Say Yes - OgeNus và PiaLinh', src: '../mp3/sayyes.mp3' },
  { title: '💐 Duongg - Nắng Ấm Trong Tim', src: '../mp3/nangamtrongtim.mp3' },
];

let trackIdx = 0;
let isPlaying = false;
let panelOpen = false;

const audio = document.getElementById('bgMusic');

// ── Web Audio API setup ────────────────────────────
// Được khởi tạo lần đầu khi người dùng chạm/click (enterSite)
// để tránh bị trình duyệt mobile chặn autoplay.
let audioCtx = null;
let gainNode = null;
let sourceNode = null;

function initAudioContext() {
  if (audioCtx) return; // chỉ khởi tạo một lần

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();

  // Lấy giá trị volume hiện tại từ slider
  const slider = document.getElementById('volumeSlider');
  gainNode.gain.value = parseInt(slider.value) / 100;

  // Kết nối: <audio> → GainNode → loa
  sourceNode = audioCtx.createMediaElementSource(audio);
  sourceNode.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

function resumeAudioContext() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// ── Track loading ──────────────────────────────────
function initMusic() {
  loadTrack(trackIdx);
}

function loadTrack(idx) {
  const track = playlist[idx];
  audio.src = track.src;
  document.getElementById('musicTitle').textContent = track.title;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('currentTime').textContent = '0:00';
  document.getElementById('totalTime').textContent = '0:00';

  // Đồng bộ audio.volume với gainNode nếu chưa dùng Web Audio API
  if (!audioCtx) {
    const slider = document.getElementById('volumeSlider');
    audio.volume = parseInt(slider.value) / 100;
  }
}

function playMusic() {
  resumeAudioContext();
  audio.play().then(() => {
    isPlaying = true;
    document.getElementById('musicBtn').textContent = '⏸';
    document.getElementById('musicDisc').classList.add('playing');
    document.getElementById('musicDiscBtn').classList.add('playing');
    if (!panelOpen) togglePanel();
  }).catch(e => console.log('Autoplay blocked:', e));
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  document.getElementById('musicBtn').textContent = '▶';
  document.getElementById('musicDisc').classList.remove('playing');
  document.getElementById('musicDiscBtn').classList.remove('playing');
}

function toggleMusic() {
  if (isPlaying) pauseMusic();
  else playMusic();
}

function nextTrack() {
  trackIdx = (trackIdx + 1) % playlist.length;
  loadTrack(trackIdx);
  if (isPlaying) playMusic();
}

function prevTrack() {
  trackIdx = (trackIdx - 1 + playlist.length) % playlist.length;
  loadTrack(trackIdx);
  if (isPlaying) playMusic();
}

// ── Volume control — hoạt động trên cả mobile ─────
function setVolume(val) {
  const v = parseInt(val);

  if (gainNode) {
    // Dùng GainNode khi Web Audio API đã khởi tạo (mobile & PC)
    gainNode.gain.value = v / 100;
  } else {
    // Fallback cho PC khi chưa tương tác lần đầu
    audio.volume = v / 100;
  }

  // Cập nhật UI
  const pct = document.getElementById('volumePct');
  if (pct) pct.textContent = v + '%';

  const icon = document.getElementById('volumeIcon');
  if (icon) {
    if (v === 0) icon.textContent = '🔇';
    else if (v < 40) icon.textContent = '🔈';
    else if (v < 75) icon.textContent = '🔉';
    else icon.textContent = '🔊';
  }
}

function seekMusic(e) {
  const bar = document.getElementById('progressBar');
  const ratio = e.offsetX / bar.offsetWidth;
  audio.currentTime = ratio * audio.duration;
}

function togglePanel() {
  panelOpen = !panelOpen;
  document.getElementById('musicInfo').classList.toggle('visible', panelOpen);
}

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
  document.getElementById('totalTime').textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  nextTrack();
  setTimeout(playMusic, 300);
});

// ══════════════════════════════════════════════════
// SPLASH SCREEN
// ══════════════════════════════════════════════════
function spawnSplashPetals() {
  const container = document.getElementById('splashPetals');
  if (!container) return;
  const emojis = ['🌸', '🌺', '🌷', '💮', '🌹', '💗'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'splash-petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 7) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    container.appendChild(p);
  }
}

function enterSite() {
  // Giữ nguyên phần khởi tạo âm thanh của bạn
  initAudioContext();
  playMusic();

  const splash = document.getElementById('splash');
  splash.classList.add('hidden');

  // THÊM: Logic hiện nút Khám phá đúng lúc
  const scrollBtn = document.getElementById('scrollDown');
  if (scrollBtn) {
    // Đợi Splash mờ đi một chút rồi mới hiện nút
    setTimeout(() => {
      scrollBtn.style.display = 'flex'; // Hiện lại cấu trúc nút
      // Dùng requestAnimationFrame hoặc setTimeout nhỏ để ép trình duyệt nhận diện thay đổi display trước khi chạy transition
      setTimeout(() => {
        scrollBtn.style.opacity = '1';
      }, 50);
    }, 900);
  }

  // Thêm đoạn này vào bên dưới phần hiện nút scrollDown
  const footer = document.getElementById('mainFooter');
  if (footer) {
    setTimeout(() => {
      footer.style.display = 'block';
      setTimeout(() => { footer.style.opacity = '1'; }, 50);
    }, 900);
  }

  // Giữ nguyên các hiệu ứng panel và ẩn splash của bạn
  setTimeout(() => {
    if (!panelOpen) togglePanel();
  }, 900);

  setTimeout(() => {
    splash.style.display = 'none';
  }, 900);

  const centralHint = document.getElementById('central-hint');

  setTimeout(() => {
    // Hiện thông báo ở giữa
    if (centralHint) {
      centralHint.classList.add('active');
      centralHint.style.display = 'block';
      centralHint.style.opacity = '1';

      // Tự động biến mất sau 4 giây
      setTimeout(() => {
        centralHint.style.opacity = '0';
        setTimeout(() => {
          centralHint.style.display = 'none';
        }, 500);
      }, 4000);
    }
  }, 2000); // Hiện ra sau khi site mở được 2 giây
}

window.addEventListener('DOMContentLoaded', () => {
  loadTrack(trackIdx);
  spawnSplashPetals();
});

// ══════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════
function goToGift() {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = "../MiniGame/index.html?playMusic=true";
  }, 600);
}

async function checkAdminPassword(event) {
  event.preventDefault();

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  if (isMobile) {
    Swal.fire({
      icon: 'warning',
      title: 'Không hỗ trợ trên điện thoại',
      text: 'Trang quản trị chỉ có thể truy cập bằng máy tính (PC).',
      confirmButtonColor: '#d81b60'
    });
    return;
  }

  const { value: password } = await Swal.fire({
    title: 'Xác nhận quyền truy cập',
    input: 'password',
    inputLabel: 'Vui lòng nhập mật khẩu Admin',
    inputPlaceholder: 'Nhập mật khẩu tại đây...',
    inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
    showCancelButton: true,
    confirmButtonText: 'Đăng nhập',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#d81b60',
    borderRadius: '20px'
  });

  if (password === 'khututriggd') {
    Swal.fire({
      icon: 'success',
      title: 'Chính xác!',
      text: 'Đang chuyển hướng đến trang quản trị...',
      timer: 1500,
      showConfirmButton: false
    });
    setTimeout(() => { window.location.href = "../Admin/admin.html"; }, 1500);
  } else if (password) {
    Swal.fire({
      icon: 'error',
      title: 'Sai mật khẩu!',
      text: 'Bạn không có quyền truy cập khu vực này.',
      confirmButtonColor: '#d81b60'
    });
  }
}

function goToGiftPage() {

  document.body.style.transition = "opacity 0.5s";
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "../PhaoHoa/phaohoa.html";
  }, 500);
}


