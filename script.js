/* ==========================================================
   CONFIG — แก้ข้อความ/รูป/เพลงทั้งหมดได้ที่นี่ที่เดียว
   - ใช้ {name} ตรงไหนก็ได้ มันจะถูกแทนด้วย girlfriendName
   - ขึ้นบรรทัดใหม่ใน "..." ใช้ \n   (ใน `...` ขึ้นบรรทัดใหม่ได้เลย)
   ========================================================== */
const CONFIG = {
  girlfriendName: "Cream",

  // เพลง (ต้องมีไฟล์ที่ assets/music.mp3)
  musicSrc: "asset/music.mp3",
  musicVolume: 0.6,

  // PAGE 1
  introTitle: "มีอะไรอยากให้เธอดู...",
  introSub: "ใช้เวลาสักนิดนะ ❤️",
  introButton: "เปิดดูสิ →",

  // PAGE 2
  birthdayTitle: "Happy Birthday 🎂",
  birthdayLine: "วันนี้เป็นวันของเธอนะ",
  birthdayNote: "แต่ก่อนจะไปถึงคำอวยพรสุดท้าย\nเค้ามีอะไรบางอย่างอยากให้เธอดูก่อน",
  birthdayButton: "ไปดูกัน →",

  // PAGE 3
  memoriesTitle: "เรื่องราวเล็ก ๆ ของเรา ❤️",
  memoriesButton: "ไปต่ออีกนิด →",

  // PAGE 4 — จดหมาย
  letterPrompt: "มีอีกอย่างอยากให้เธออ่าน",
  letterOpenButton: "เปิดจดหมาย",
  letterNextButton: "ไปหน้าสุดท้าย →",
  letter: `[เธอไม่จำเป็นต้องเก่งตลอดเวลา ไม่จำเป็นต้องเข้มแข็งตลอดเวลา และไม่จำเป็นต้องทำทุกอย่างให้สมบูรณ์แบบหรอกนะ ถ้าวันไหนเหนื่อยก็พักได้ ถ้าวันไหนไม่ไหวก็ร้องไห้ได้ ถ้าวันไหนอยากระบายก็เล่าให้เค้าฟังได้ เค้าอาจแก้ปัญหาให้เธอไม่ได้ทุกเรื่อง แต่เค้าสัญญาว่าอย่างน้อยจะพยายามอยู่ข้าง ๆ]`,

  // FINAL
  finalTitle: "Happy Birthday, {name} ❤️",
  finalMessage: `ขอให้ปีนี้เป็นปีที่ดีสำหรับเธอ
มีความสุขมาก ๆ
และไม่ว่าจะเจออะไร
เค้าจะอยู่ข้าง ๆ เธอเสมอ`,
  finalPhoto: "asset/all1.mp4", // รูปสุดท้าย (เปลี่ยนเป็นรูปไหนก็ได้)

  // รูปใน Gallery — เพิ่ม/ลบ/สลับลำดับได้เลย
  photos: [
    { src: "asset/1st.jpg", caption: "จำวันนี้ได้ไหม?" },
    { src: "images/hd2.jpg", caption: "ช่วงเวลาที่เรายิ้มด้วยกัน" },
    { src: "images/sea.jpg", caption: "จำวันที่เราไปเที่ยวครั้งแรกได้มั้ย" },
    { src: "asset/sket.mp4", caption: "วันที่เธอไปเล่นIce Sket แล้วเค้านั่งดู" },
    { src: "images/ca2.jpg", caption: "รูปนี้ดูทีไรก็ยิ้ม" },
    { src: "asset/footage1.mp4", caption: "และจะมีอีกเยอะ ๆ ต่อจากนี้" }
  ]
};

/* ==========================================================
   ด้านล่างนี้ไม่ต้องแก้ ถ้าแค่เปลี่ยนข้อความ/รูป
   ========================================================== */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const fill = (t) => String(t).replaceAll("{name}", CONFIG.girlfriendName);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- ใส่ข้อความจาก CONFIG ลง HTML ---------- */
$$("[data-cfg]").forEach((el) => { el.textContent = fill(CONFIG[el.dataset.cfg] ?? ""); });
$("#letter-text").textContent = fill(CONFIG.letter);

/* ---------- การเปลี่ยนหน้า ---------- */
const pages = $$(".page");
const PAGE_MODE = { intro: "dream", birthday: "party", memories: "dream", letter: "dream", final: "party" };
let current = 0;
let busy = false;
let finalVideo = null;

function goTo(i) {
  if (busy || i === current) return;
  busy = true;
  const from = pages[current];
  const to = pages[i];
  from.classList.remove("active");
  from.classList.add("out");
  to.classList.remove("out");
  to.scrollTop = 0;
  to.classList.add("active");
  current = i;
  setMode(PAGE_MODE[to.dataset.page] || "dream");
  if (to.dataset.page === "final") {
    launchConfetti();
    if (finalVideo) finalVideo.play().catch(() => {});
  } else if (finalVideo) {
    finalVideo.pause();
  }
  setTimeout(() => { from.classList.remove("out"); busy = false; }, 750);
}

/* ---------- เพลง ---------- */
const audio = new Audio(CONFIG.musicSrc);
audio.loop = true;
audio.preload = "auto";
audio.volume = CONFIG.musicVolume;

const musicBtn = $("#music");
const musicLabel = $("#music-label");
function setMusicUI(on) {
  musicBtn.classList.toggle("playing", on);
  musicBtn.setAttribute("aria-pressed", String(on));
  musicLabel.textContent = on ? "กำลังเล่น" : "หยุดอยู่";
}
audio.addEventListener("play", () => setMusicUI(true));
audio.addEventListener("pause", () => setMusicUI(false));
audio.addEventListener("error", () => { musicLabel.textContent = "ไม่พบเพลง"; });

// เล่นได้เฉพาะตอนที่ผู้ใช้กดเอง (ไม่ bypass autoplay policy)
function playMusic() { audio.play().catch(() => setMusicUI(false)); }
musicBtn.addEventListener("click", () => (audio.paused ? playMusic() : audio.pause()));

/* ---------- ปุ่มเปลี่ยนหน้า ---------- */
$("#start").addEventListener("click", () => {
  musicBtn.classList.add("show");
  playMusic();
  goTo(1);
});
$("#to-memories").addEventListener("click", () => goTo(2));
$("#to-letter").addEventListener("click", () => goTo(3));
$("#to-final").addEventListener("click", () => goTo(4));

/* ---------- Gallery + Lightbox ---------- */
const isVideo = (src) => /\.(mp4|m4v|mov|webm)(\?|#|$)/i.test(src);

// สร้าง <video> สำหรับไฟล์วิดีโอ / <img> สำหรับรูป (<img> เล่น .mp4 ไม่ได้ใน Chrome/Android — Safari เท่านั้นที่เล่นได้)
function makeVideo({ src, controls = false, autoplay = true }) {
  const v = document.createElement("video");
  v.muted = true;                       // ต้อง muted ถึงจะ autoplay ได้ทุกเบราว์เซอร์
  v.defaultMuted = true;
  v.setAttribute("muted", "");
  v.loop = true;
  v.playsInline = true;                 // iOS ไม่เด้งเต็มจอ
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.controls = controls;
  v.preload = "metadata";
  v.autoplay = autoplay;
  v.src = src + "#t=0.001";             // โชว์เฟรมแรกถ้า autoplay ไม่ทำงาน (เช่น โหมดประหยัดแบตบน iOS)
  return v;
}

const gallery = $("#gallery");
CONFIG.photos.forEach((p, i) => {
  const fig = document.createElement("figure");
  fig.className = "shot";
  fig.dataset.i = i;
  fig.tabIndex = 0;
  fig.setAttribute("role", "button");
  fig.setAttribute("aria-label", "ดูรูป: " + fill(p.caption));

  const frame = document.createElement("div");
  frame.className = "frame";
  if (isVideo(p.src)) {
    const vid = makeVideo({ src: p.src });
    vid.addEventListener("error", () => frame.classList.add("missing"));
    frame.appendChild(vid);
    const badge = document.createElement("span");
    badge.className = "play-badge";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = "▶";
    frame.appendChild(badge);
  } else {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = fill(p.caption);
    img.addEventListener("error", () => frame.classList.add("missing"));
    img.src = p.src;
    frame.appendChild(img);
  }

  const cap = document.createElement("figcaption");
  cap.textContent = fill(p.caption);

  fig.append(frame, cap);
  gallery.appendChild(fig);
});

const lb = $("#lightbox");
const lbImg = $("#lb-img");
const lbCap = $("#lb-cap");
const lbCount = $("#lb-count");
let lbIndex = 0;
let lastFocus = null;

// วิดีโอในหน้าต่าง lightbox (สร้างครั้งเดียว ใช้ซ้ำ)
const lbVideo = document.createElement("video");
lbVideo.id = "lb-video";
lbVideo.controls = true;
lbVideo.playsInline = true;
lbVideo.setAttribute("playsinline", "");
lbVideo.setAttribute("webkit-playsinline", "");
lbVideo.preload = "auto";
lbVideo.loop = true;
lbVideo.hidden = true;
lbImg.before(lbVideo);

// ระหว่างดูวิดีโอ ให้พักเพลงพื้นหลังไว้ แล้วเปิดต่อเมื่อวิดีโอหยุด/ปิดหน้าต่าง
let resumeMusic = false;
lbVideo.addEventListener("play", () => {
  if (!audio.paused) { audio.pause(); resumeMusic = true; }
});
function releaseMusic() {
  if (resumeMusic) { resumeMusic = false; playMusic(); }
}
lbVideo.addEventListener("pause", releaseMusic);
lbVideo.addEventListener("ended", releaseMusic);
lbVideo.addEventListener("error", () => { lbCap.textContent = "เปิดวิดีโอนี้ไม่ได้ ลองรีเฟรชหรือเปลี่ยนเบราว์เซอร์นะ"; });

function stopLbVideo() {
  lbVideo.pause();
  lbVideo.removeAttribute("src");
  lbVideo.load();
  lbVideo.hidden = true;
}

function showPhoto(i) {
  const n = CONFIG.photos.length;
  lbIndex = (i + n) % n;
  const p = CONFIG.photos[lbIndex];
  stopLbVideo();
  if (isVideo(p.src)) {
    lbImg.hidden = true;
    lbImg.removeAttribute("src");
    lbVideo.hidden = false;
    lbVideo.src = p.src;
    lbVideo.muted = false;
    lbVideo.play().catch(() => {});     // ถ้าเบราว์เซอร์บล็อก ผู้ใช้กดปุ่ม play เองได้
  } else {
    lbImg.hidden = false;
    lbImg.src = p.src;
    lbImg.alt = fill(p.caption);
  }
  lbCap.textContent = fill(p.caption);
  lbCount.textContent = `${lbIndex + 1} / ${n}`;
}
function openLightbox(i) {
  lastFocus = document.activeElement;
  showPhoto(i);
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  $(".lb-close", lb).focus();
}
function closeLightbox() {
  stopLbVideo();
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  if (lastFocus) lastFocus.focus();
}

gallery.addEventListener("click", (e) => {
  const fig = e.target.closest(".shot");
  if (fig) openLightbox(+fig.dataset.i);
});
gallery.addEventListener("keydown", (e) => {
  const fig = e.target.closest(".shot");
  if (fig && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLightbox(+fig.dataset.i); }
});
$(".lb-close", lb).addEventListener("click", closeLightbox);
$(".lb-nav.prev", lb).addEventListener("click", () => showPhoto(lbIndex - 1));
$(".lb-nav.next", lb).addEventListener("click", () => showPhoto(lbIndex + 1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
  if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
});
// ปัดซ้าย/ขวาบนมือถือ
let touchX = null;
lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

/* ---------- จดหมาย ---------- */
$("#open-letter").addEventListener("click", (e) => {
  e.currentTarget.disabled = true;
  $("#letter-prompt").style.opacity = 0;
  $("#envelope").classList.add("open");
  setTimeout(() => $("#envelope-wrap").classList.add("fade"), 1900);
  setTimeout(() => {
    $("#envelope-wrap").hidden = true;
    $("#letter-card").hidden = false;
  }, 2450);
});

/* ---------- รูปสุดท้าย ---------- */
(() => {
  const box = $("#final-photo");
  if (isVideo(CONFIG.finalPhoto)) {
    const vid = makeVideo({ src: CONFIG.finalPhoto, controls: true, autoplay: false });
    vid.addEventListener("error", () => box.classList.add("missing"));
    box.appendChild(vid);
    finalVideo = vid;
  } else {
    const img = document.createElement("img");
    img.alt = fill(CONFIG.finalTitle);
    img.addEventListener("error", () => box.classList.add("missing"));
    img.src = CONFIG.finalPhoto;
    box.appendChild(img);
  }
})();

/* ==========================================================
   Particles (หัวใจ/ประกาย/จุดเล็ก ๆ ลอยเบา ๆ) + Confetti
   วาดบน canvas เดียว เบาพอสำหรับมือถือ
   ========================================================== */
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
const PALETTES = {
  dream: ["#f4a6b7", "#c6b3ff", "#ffd3b6", "#fff6ec"],
  party: ["#f4a6b7", "#ffd3b6", "#c6b3ff", "#ffe27a", "#9fe3d0", "#fff6ec"]
};
let W = 0, H = 0, mode = "dream";
let particles = [];
let confetti = [];
let raf = 0;

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(p, anywhere) {
  p.x = rand(0, W);
  p.y = anywhere ? rand(0, H) : H + 20;
  p.size = rand(4, 11);
  p.vy = rand(0.15, 0.5);
  p.phase = rand(0, Math.PI * 2);
  p.alpha = rand(0.25, 0.65);
  p.type = pick(["heart", "star", "dot"]);
  p.color = pick(PALETTES[mode]);
  return p;
}

function initParticles() {
  const count = reduceMotion ? 10 : W < 600 ? 26 : 42;
  particles = Array.from({ length: count }, () => spawn({}, true));
}

function setMode(m) {
  mode = m;
  particles.forEach((p) => { p.color = pick(PALETTES[mode]); });
}

function drawHeart(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.7, x, y + s * 0.85, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.85, x + s * 0.5, y + s * 0.7, x + s * 0.5, y + s * 0.35);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.35);
  ctx.fill();
}
function drawSparkle(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
}

function launchConfetti() {
  if (reduceMotion) return;
  const burst = (n) => {
    for (let i = 0; i < n; i++) {
      confetti.push({
        x: rand(0, W), y: rand(-60, -10),
        vx: rand(-0.6, 0.6), vy: rand(1.2, 2.8),
        w: rand(5, 9), h: rand(8, 14),
        rot: rand(0, Math.PI * 2), vr: rand(-0.1, 0.1),
        phase: rand(0, Math.PI * 2),
        color: pick(PALETTES.party)
      });
    }
  };
  burst(W < 600 ? 45 : 70);
  setTimeout(() => burst(W < 600 ? 30 : 45), 1800);
}

function frame() {
  ctx.clearRect(0, 0, W, H);
  const speed = (mode === "party" ? 1.5 : 1) * (reduceMotion ? 0.4 : 1);

  for (const p of particles) {
    p.y -= p.vy * speed;
    p.phase += 0.012;
    p.x += Math.sin(p.phase) * 0.35;
    if (p.y < -20) spawn(p, false);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    if (p.type === "heart") drawHeart(p.x, p.y, p.size * 1.2);
    else if (p.type === "star") drawSparkle(p.x, p.y, p.size * 0.8);
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.28, 0, Math.PI * 2); ctx.fill(); }
  }

  ctx.globalAlpha = 0.9;
  confetti = confetti.filter((c) => c.y < H + 20);
  for (const c of confetti) {
    c.vy += 0.012;
    c.phase += 0.05;
    c.x += c.vx + Math.sin(c.phase) * 0.5;
    c.y += c.vy;
    c.rot += c.vr;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  raf = requestAnimationFrame(frame);
}

addEventListener("resize", resize);
document.addEventListener("visibilitychange", () => {
  cancelAnimationFrame(raf);
  if (!document.hidden) raf = requestAnimationFrame(frame);
});
resize();
initParticles();
raf = requestAnimationFrame(frame);
