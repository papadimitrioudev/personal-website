'use strict';

// Navigation, email copy and optional motion for the personal website.
// Effects adapted from Magic UI (MIT): Scroll Progress, Magic Card and Animated Beam.

const root = document.documentElement;
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const header = document.querySelector('.site-header');
const navigationEntry = performance.getEntriesByType('navigation')[0];
const isReload = navigationEntry?.type === 'reload';

// A refresh starts at the introduction; opening a shared section URL still works.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (isReload) {
  history.replaceState(history.state, '', location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: 'auto' });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) window.scrollTo({ top: 0, behavior: 'auto' });
  }, { once: true });
}

/* ---------- Mobile menu ---------- */
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

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu({ restoreFocus: true });
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header') && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
});
window.matchMedia('(max-width: 620px)').addEventListener('change', () => closeMenu());

/* ---------- In-page links ---------- */
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const fragment = link.getAttribute('href');
  const destination = document.getElementById(fragment.slice(1));
  if (!destination) return;
  event.preventDefault();
  closeMenu();
  requestAnimationFrame(() => {
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
    const offset = header.getBoundingClientRect().height + 14;
    const top = fragment === '#top' ? 0 : Math.max(0, window.scrollY + destination.getBoundingClientRect().top - offset);
    history.replaceState(history.state, '', fragment);
    // Immediate mobile navigation avoids overlapping native focus/fragment scrolling in Safari.
    const instant = window.matchMedia('(max-width: 620px), (prefers-reduced-motion: reduce)').matches || root.classList.contains('motion-off');
    window.scrollTo({ top, behavior: instant ? 'auto' : 'smooth' });
    if (instant) onScroll();
  });
});

/* ---------- Current section and Scroll Progress ---------- */
const sectionLinks = [...navigation.querySelectorAll('a')];
const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1)));
let scrollFrame = 0;

function onScroll() {
  scrollFrame = 0;
  const boundary = header.getBoundingClientRect().height + 30;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  let current = null;
  for (const section of sections) if (section && section.getBoundingClientRect().top <= boundary) current = section;
  if (window.scrollY > 0 && window.scrollY >= maxScroll - 2) current = sections.at(-1);
  sectionLinks.forEach(link => {
    if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  header.style.setProperty('--progress', progress.toFixed(4));
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(onScroll);
}, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

/* ---------- Copy email ---------- */
const copyButton = document.querySelector('.copy-email');
if (copyButton && navigator.clipboard && window.isSecureContext) {
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
root.classList.add('js');

/* ---------- Motion preference ---------- */
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const scene = document.querySelector('.identity-art');
const tilt = document.querySelector('.scene-tilt');
const core = document.querySelector('.core');
const rotateButton = document.querySelector('.rotate-button');
let motionEnabled = !motionPreference.matches;
let sceneVisible = true;
let spin = 0;
try { if (localStorage.getItem('pdm-motion') === 'off') motionEnabled = false; } catch { /* Storage can be unavailable. */ }

function updateMotion() {
  if (motionPreference.matches) motionEnabled = false;
  root.classList.toggle('motion-off', !motionEnabled);
  // The emblem animations pause while the hero is offscreen or the tab is hidden.
  scene.classList.toggle('is-paused', !sceneVisible || document.hidden || !motionEnabled);
  motionButton.setAttribute('aria-pressed', String(motionEnabled));
  motionButton.disabled = motionPreference.matches;
  motionButton.querySelector('span').textContent = motionEnabled ? motionButton.dataset.on : motionButton.dataset.off;
  rotateButton.hidden = !motionEnabled;
}

motionButton.hidden = false;
motionButton.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  try { localStorage.setItem('pdm-motion', motionEnabled ? 'on' : 'off'); } catch { /* Preference is session-only. */ }
  updateMotion();
});
motionPreference.addEventListener('change', event => { motionEnabled = !event.matches; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);

/* ---------- Emblem: pointer tilt and rotate button ---------- */
scene.addEventListener('pointermove', event => {
  if (!motionEnabled || event.pointerType === 'touch') return;
  const bounds = scene.getBoundingClientRect();
  tilt.style.setProperty('--rx', (12 - ((event.clientY - bounds.top) / bounds.height - .5) * 22) + 'deg');
  tilt.style.setProperty('--ry', (-24 + ((event.clientX - bounds.left) / bounds.width - .5) * 34) + 'deg');
});
scene.addEventListener('pointerleave', () => { tilt.style.removeProperty('--rx'); tilt.style.removeProperty('--ry'); });
rotateButton.addEventListener('click', () => {
  spin += 360;
  core.style.setProperty('--spin', spin + 'deg');
});

/* ---------- Magic Card: border and spotlight follow the pointer ---------- */
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--mx', (event.clientX - bounds.left) + 'px');
    card.style.setProperty('--my', (event.clientY - bounds.top) + 'px');
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});

/* ---------- Animated Beam along the experience timeline ---------- */
const timeline = document.querySelector('.timeline');
function measureTimeline() {
  const nodes = timeline.querySelectorAll('.node');
  if (nodes.length < 2) return;
  const base = timeline.getBoundingClientRect().top;
  const centre = node => {
    const box = node.getBoundingClientRect();
    return box.top + box.height / 2 - base;
  };
  timeline.style.setProperty('--rail-start', centre(nodes[0]).toFixed(1) + 'px');
  timeline.style.setProperty('--rail-end', centre(nodes[nodes.length - 1]).toFixed(1) + 'px');
}
measureTimeline();
window.addEventListener('resize', measureTimeline, { passive: true });
if (document.fonts) document.fonts.ready.then(measureTimeline);

/* ---------- Visibility observers ---------- */
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { sceneVisible = entry.isIntersecting; updateMotion(); }, { threshold: 0 }).observe(scene);
  const beamObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    measureTimeline();
    timeline.classList.add('is-lit');
    beamObserver.disconnect();
  }, { threshold: .45 });
  beamObserver.observe(timeline);
} else {
  timeline.classList.add('is-lit');
}
updateMotion();
