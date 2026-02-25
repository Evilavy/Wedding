/* ==========================================
   JAVASCRIPT – Birthday Website
   ========================================== */

// ── PARTICLES ────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#e8729a', '#f5b8d0', '#c9a64c', '#f0d98e', '#c9366e', '#fce8f0'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 10 + 4;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 12}s;
      animation-delay: ${Math.random() * 15}s;
    `;
    container.appendChild(el);
  }
})();

// ── PETALS ───────────────────────────────
(function createPetals() {
  const container = document.getElementById('petals');
  const petals = ['🌸', '🌺', '✨', '🌷', '💮', '🏵️'];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 12}s;
      font-size: ${Math.random() * 1.2 + 0.8}rem;
    `;
    container.appendChild(el);
  }
})();

// ── COUNTDOWN ────────────────────────────
(function countdown() {
  const target = new Date('2026-04-18T18:00:00');

  function update() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<p style="color:#fff;font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-style:italic">🎉 C\'est aujourd\'hui ! Joyeux anniversaire Laureine ! 🎉</p>';
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
  // Add reveal class to eligible elements
  const selectors = [
    '.section-label', '.section-title', '.section-sub',
    '.invite-card', '.gallery__card', '.message__card',
    '.location__info', '.location__map', '.rsvp__form',
    '.detail-row', '.countdown'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
  });

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── RSVP FORM ────────────────────────────
function handleRsvp(e) {
  e.preventDefault();
  const form = e.target;
  form.style.display = 'none';
  const success = document.getElementById('rsvp-success');
  success.style.display = 'flex';
  // Optionally: throw confetti
  launchConfetti();
}

// ── CONFETTI ─────────────────────────────
function launchConfetti() {
  const colors = ['#e8729a', '#c9a64c', '#c9366e', '#f5b8d0', '#f0d98e', '#ffffff'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const confetto = document.createElement('div');
      const size = Math.random() * 10 + 6;
      confetto.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -20px;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > .5 ? '50%' : '2px'};
        z-index: 9999;
        pointer-events: none;
        animation: confettoFall ${Math.random() * 2 + 1.5}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(confetto);
      confetto.addEventListener('animationend', () => confetto.remove());
    }, i * 40);
  }
}

// Inject confetti keyframe
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes confettoFall {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
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
