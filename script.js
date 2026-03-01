/* ==========================================
   JAVASCRIPT — Hollywood Birthday Website
   ========================================== */

// ── MARQUEE BARS (smooth scrolling dots) ─
(function buildMarquees() {
  // Colors: gold, red, white in sequence
  const dotColors = [
    { bg: '#c9a030', glow: 'rgba(201,160,48,.8)' },   // gold
    { bg: '#f5d878', glow: 'rgba(245,216,120,.8)' },  // gold light
    { bg: '#bf1020', glow: 'rgba(191,16,32,.8)' },    // red
    { bg: '#f5d878', glow: 'rgba(245,216,120,.8)' },  // gold light
    { bg: '#ffffff', glow: 'rgba(255,255,255,.9)' },   // white
    { bg: '#c9a030', glow: 'rgba(201,160,48,.8)' },   // gold
  ];

  function buildBar(bar, speed) {
    if (!bar) return;
    // Build one set of dots (enough to fill viewport × 2)
    const dotCount = Math.ceil((window.innerWidth * 2) / 17) + 4;

    // Create a track with the dots duplicated for seamless loop
    const track = document.createElement('div');
    track.className = 'marquee-track';
    if (speed) track.style.animationDuration = speed;

    // Build 2× the dots so translateX(-50%) loops perfectly
    for (let repeat = 0; repeat < 2; repeat++) {
      for (let i = 0; i < dotCount; i++) {
        const c = dotColors[i % dotColors.length];
        const d = document.createElement('span');
        d.className = 'marquee-dot';
        d.style.background = c.bg;
        d.style.boxShadow = `0 0 6px ${c.glow}, 0 0 12px ${c.glow.replace('.8', '.4')}`;
        track.appendChild(d);
      }
    }

    bar.appendChild(track);
  }

  buildBar(document.getElementById('marquee-top'), '20s');
  buildBar(document.getElementById('marquee-footer'), '20s');

  // Message card lights (smaller, faster)
  document.querySelectorAll('.message__lights').forEach((bar, idx) => {
    const msgColors = [
      { bg: '#c9a030', glow: 'rgba(201,160,48,.8)' },
      { bg: '#bf1020', glow: 'rgba(191,16,32,.8)' },
      { bg: '#f5d878', glow: 'rgba(245,216,120,.8)' },
      { bg: '#ffffff', glow: 'rgba(255,255,255,.9)' },
    ];
    const count = Math.ceil((800 * 2) / 20) + 4; // enough for max card width
    const track = document.createElement('div');
    track.className = 'marquee-track';
    track.style.animationDuration = '10s';
    if (idx % 2 === 1) track.style.animationDirection = 'reverse';

    for (let repeat = 0; repeat < 2; repeat++) {
      for (let i = 0; i < count; i++) {
        const c = msgColors[i % msgColors.length];
        const d = document.createElement('span');
        d.style.background = c.bg;
        d.style.boxShadow = `0 0 6px ${c.glow}`;
        track.appendChild(d);
      }
    }
    bar.appendChild(track);
  });
})();

// ── GLITTER CANVAS ──────────────────────
(function initGlitter() {
  const canvas = document.getElementById('glitter');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const GOLD_COLORS = [
    'rgba(201,160,48,',
    'rgba(245,216,120,',
    'rgba(255,230,120,',
    'rgba(255,255,255,',
    'rgba(200,200,200,',
    'rgba(139,0,0,',
  ];

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2.2 + 0.4,
    vx: (Math.random() - .5) * 0.35,
    vy: Math.random() * -0.5 - 0.1,
    alpha: Math.random(),
    da: (Math.random() * 0.012 + 0.004) * (Math.random() > .5 ? 1 : -1),
    color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
    shape: Math.random() > 0.65 ? 'star' : 'circle',
  }));

  function drawStar(ctx, x, y, r, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color + alpha + ')';
    ctx.shadowColor = color + '0.8)';
    ctx.shadowBlur = r * 4;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const ir = (Math.PI * 2) / 5 * i - Math.PI / 2 + Math.PI / 5;
      if (i === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
      else ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
      ctx.lineTo(
        (r * 0.4) * Math.cos(ir),
        (r * 0.4) * Math.sin(ir)
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.da;

      if (p.alpha <= 0 || p.alpha >= 1) p.da *= -1;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

      p.alpha = Math.max(0, Math.min(1, p.alpha));

      if (p.shape === 'star') {
        drawStar(ctx, p.x, p.y, p.r * 2.5, p.alpha * 0.8, p.color);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * 0.7) + ')';
        ctx.shadowColor = p.color + '0.6)';
        ctx.shadowBlur = p.r * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    requestAnimationFrame(tick);
  }
  tick();
})();

// ── COUNTDOWN ────────────────────────────
(function countdown() {
  const target = new Date('2026-04-18T18:00:00');

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        `<p style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:.15em;color:#c9a030;text-shadow:0 0 20px rgba(201,160,48,.7)">
          ⭐ C'EST AUJOURD'HUI ! JOYEUX ANNIVERSAIRE LAUREINE ! ⭐
        </p>`;
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

// ── REVEAL ON SCROLL ──────────────────────
(function revealOnScroll() {
  const selectors = [
    '.section-label', '.section-title', '.section-sub',
    '.ticket', '.gallery__card',
    '.message__card', '.location__info', '.location__map',
    '.countdown', '.wof-star',
  ];
  selectors.forEach(sel =>
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'))
  );

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── GOLD STAR CONFETTI ────────────────────
function launchConfetti() {
  const shapes = ['⭐', '★', '✨', '🌟', '💫'];
  const colors = ['#c9a030', '#f5d878', '#ffffff', '#8b0000', '#e8c060'];

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      const useEmoji = Math.random() > 0.5;
      const size = Math.random() * 14 + 8;

      if (useEmoji) {
        el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.cssText = `
          position:fixed; left:${Math.random() * 100}vw; top:-30px;
          font-size:${Math.random() * 1.4 + .8}rem;
          z-index:9999; pointer-events:none;
          animation: confettoFall ${Math.random() * 2.5 + 1.5}s linear forwards;
          filter: drop-shadow(0 0 4px rgba(201,160,48,.8));
        `;
      } else {
        el.style.cssText = `
          position:fixed; left:${Math.random() * 100}vw; top:-20px;
          width:${size}px; height:${size * (Math.random() > .5 ? 1 : .35)}px;
          background:${colors[Math.floor(Math.random() * colors.length)]};
          border-radius:${Math.random() > .5 ? '50%' : '2px'};
          z-index:9999; pointer-events:none;
          animation: confettoFall ${Math.random() * 2 + 1.5}s linear forwards;
          transform:rotate(${Math.random() * 360}deg);
          box-shadow: 0 0 6px rgba(201,160,48,.6);
        `;
      }

      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 40);
  }
}

// Confetti keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes confettoFall {
    0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);

// ── SMOOTH NAV ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
