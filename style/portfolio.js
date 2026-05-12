// ─── Theme toggle ───
const themeToggle = document.getElementById('themeToggle');

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

applyTheme(localStorage.getItem('theme') === 'dark');

themeToggle.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

// ─── Canvas particle network ───
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  const header = canvas.parentElement;

  function resize() {
    canvas.width  = header.offsetWidth;
    canvas.height = header.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT    = 55;
  const MAX_DIST = 130;
  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r:  Math.random() * 1.4 + 0.5,
  }));

  function isDark() { return document.body.classList.contains('dark'); }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const dark = isDark();
    const dotColor  = dark ? 'rgba(6, 182, 212, 0.55)'  : 'rgba(124, 58, 237, 0.45)';
    const lineBase  = dark ? '6, 182, 212'               : '124, 58, 237';
    const lineAlpha = dark ? 0.13                        : 0.1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${lineBase}, ${lineAlpha * (1 - d / MAX_DIST)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Typewriter effect ───
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Digital Marketing Executive',
    'Performance Marketing Specialist',
    'Social Media Strategist',
    'Content & AI Creator',
    'Brand Growth Expert',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function loop() {
    const text = phrases[pIdx];
    el.textContent = deleting ? text.slice(0, --cIdx) : text.slice(0, ++cIdx);

    if (!deleting && cIdx === text.length) {
      deleting = true;
      setTimeout(loop, 2000);
    } else if (deleting && cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(loop, 350);
    } else {
      setTimeout(loop, deleting ? 38 : 72);
    }
  }
  loop();
})();

// ─── Section fade-in ───
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
sections.forEach(s => observer.observe(s));

// ─── Navbar scroll tint ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  const dark = document.body.classList.contains('dark');
  navbar.style.background = scrolled
    ? (dark ? 'rgba(8, 13, 26, 0.97)' : 'rgba(245, 243, 255, 0.98)')
    : '';
});

// ─── Mobile nav toggle ───
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ─── Slider ───
let index = 0;
const slides     = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.slide');
const prevBtn    = document.querySelector('.slider-btn.prev');
const nextBtn    = document.querySelector('.slider-btn.next');

function getSlideWidth() {
  if (window.innerWidth <= 480) return 230;
  if (window.innerWidth <= 768) return 260;
  return 280;
}
function updateSlider() {
  slides.style.transform = `translateX(-${index * (getSlideWidth() + 20)}px)`;
}

nextBtn.addEventListener('click', () => { index = (index + 1) % slideItems.length; updateSlider(); });
prevBtn.addEventListener('click', () => { index = (index - 1 + slideItems.length) % slideItems.length; updateSlider(); });

let autoSlide = setInterval(() => { index = (index + 1) % slideItems.length; updateSlider(); }, 5000);
function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => { index = (index + 1) % slideItems.length; updateSlider(); }, 5000);
}
[prevBtn, nextBtn].forEach(b => b.addEventListener('click', resetAuto));
window.addEventListener('resize', () => { clearTimeout(window._rt); window._rt = setTimeout(updateSlider, 250); });

// Touch swipe
let touchStartX = 0;
const sliderWrapper = document.querySelector('.slider-wrapper');
sliderWrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
sliderWrapper.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) {
    index = diff < 0
      ? (index + 1) % slideItems.length
      : (index - 1 + slideItems.length) % slideItems.length;
    updateSlider(); resetAuto();
  }
}, { passive: true });

// ─── Profile image modal ───
const modal      = document.getElementById('imageModal');
const modalImg   = document.getElementById('modalImg');
const profileImg = document.getElementById('profileImg');
profileImg.addEventListener('click', () => { modal.style.display = 'flex'; modalImg.src = profileImg.src; });
modal.addEventListener('click', () => { modal.style.display = 'none'; });
