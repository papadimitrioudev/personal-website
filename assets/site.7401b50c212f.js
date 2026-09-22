'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu({ restoreFocus = false } = {}) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('span').textContent = menuButton.dataset.openLabel;
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', opening);
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.querySelector('span').textContent = opening ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel;
});

navigation.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  closeMenu();
  const destination = document.querySelector(link.getAttribute('href'));
  if (destination) {
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu({ restoreFocus: true });
  }
});

document.addEventListener('click', event => {
  if (!event.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
});

const mobile = window.matchMedia('(max-width: 620px)');
mobile.addEventListener('change', () => closeMenu());

if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-12% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main section[id], .hero').forEach(section => observer.observe(section));
}

const copyButton = document.querySelector('.copy-email');
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  let feedbackTimer;
  copyButton.addEventListener('click', async () => {
    const label = copyButton.querySelector('span');
    const original = copyButton.dataset.originalLabel || label.textContent;
    copyButton.dataset.originalLabel = original;
    const status = document.querySelector('.copy-status');
    clearTimeout(feedbackTimer);
    try {
      await navigator.clipboard.writeText(copyButton.dataset.email);
      label.textContent = copyButton.dataset.copied;
      status.textContent = copyButton.dataset.toast;
    } catch {
      status.textContent = copyButton.dataset.failed;
    }
    feedbackTimer = setTimeout(() => { label.textContent = original; status.textContent = ''; }, 4500);
  });
}

document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
document.documentElement.classList.add('js');

// The emblem remains visible without JavaScript. Motion is optional and pauses offscreen.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const scene = document.querySelector('.identity-art');
const tilt = document.querySelector('.scene-tilt');
const core = document.querySelector('.core');
const rotateButton = document.querySelector('.rotate-button');
const canvas = document.querySelector('.starfield');
const context = canvas.getContext('2d');
let motionEnabled = !motionPreference.matches;
let sceneVisible = true;
let spin = 0;
let animationFrame = 0;
let lastFrame = 0;
let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;
try { if (localStorage.getItem('pdm-motion') === 'off') motionEnabled = false; } catch { /* Storage can be unavailable. */ }

function drawStars(time = 0) {
  if (!context) return;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  for (const star of stars) {
    const drift = motionEnabled ? time * star.speed : 0;
    const y = (star.y + drift) % canvasHeight;
    context.fillStyle = star.accent ? '#f5d547' : '#8095b8';
    context.globalAlpha = star.alpha;
    context.fillRect(star.x, y, star.size, star.size);
  }
  context.globalAlpha = 1;
}

function animate(time) {
  if (!motionEnabled || document.hidden || !sceneVisible) { animationFrame = 0; return; }
  if (time - lastFrame > 33) { drawStars(time); lastFrame = time; }
  animationFrame = requestAnimationFrame(animate);
}

function updateAnimation() {
  if (motionPreference.matches) motionEnabled = false;
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  document.documentElement.classList.toggle('motion-off', !motionEnabled);
  document.querySelector('.scene-float').style.animationPlayState = sceneVisible && !document.hidden && motionEnabled ? 'running' : 'paused';
  motionButton.setAttribute('aria-pressed', String(motionEnabled));
  motionButton.disabled = motionPreference.matches;
  motionButton.querySelector('span').textContent = motionEnabled ? motionButton.dataset.on : motionButton.dataset.off;
  rotateButton.hidden = !motionEnabled;
  drawStars();
  if (motionEnabled && !document.hidden && sceneVisible) animationFrame = requestAnimationFrame(animate);
}

function sizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(canvasWidth * ratio);
  canvas.height = Math.round(canvasHeight * ratio);
  if (context) context.setTransform(ratio, 0, 0, ratio, 0, 0);
  // Deterministic distribution avoids visual jumps when changing motion settings.
  stars = Array.from({ length: Math.min(90, Math.floor(canvasWidth * canvasHeight / 15000)) }, (_, i) => ({
    x: ((i * 1619 + 71) % 997) / 997 * canvasWidth,
    y: ((i * 811 + 117) % 991) / 991 * canvasHeight,
    size: i % 5 === 0 ? 1.6 : 1,
    alpha: .25 + (i % 4) * .15,
    accent: i % 9 === 0,
    speed: .0015 + (i % 3) * .0005,
  }));
  drawStars();
}

motionButton.hidden = false;
motionButton.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  try { localStorage.setItem('pdm-motion', motionEnabled ? 'on' : 'off'); } catch { /* Preference is session-only. */ }
  updateAnimation();
});
motionPreference.addEventListener('change', event => { motionEnabled = !event.matches; updateAnimation(); });
scene.addEventListener('pointermove', event => {
  if (!motionEnabled || motionPreference.matches || event.pointerType === 'touch') return;
  const bounds = scene.getBoundingClientRect();
  tilt.style.setProperty('--rx', (12 - ((event.clientY - bounds.top) / bounds.height - .5) * 22) + 'deg');
  tilt.style.setProperty('--ry', (-25 + ((event.clientX - bounds.left) / bounds.width - .5) * 34) + 'deg');
});
scene.addEventListener('pointerleave', () => { tilt.style.removeProperty('--rx'); tilt.style.removeProperty('--ry'); });
rotateButton.addEventListener('click', () => {
  spin += 360;
  core.style.setProperty('--spin', spin + 'deg');
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { sceneVisible = entry.isIntersecting; updateAnimation(); }, { threshold: 0 }).observe(scene);
}
window.addEventListener('resize', sizeCanvas, { passive: true });
document.addEventListener('visibilitychange', updateAnimation);
sizeCanvas();
updateAnimation();
