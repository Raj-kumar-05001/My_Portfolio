/* ─────────────────────────────────────────
   1. THEME TOGGLE (dark / light)
   ───────────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
const htmlEl   = document.documentElement;

// Load saved preference or default to dark
const savedTheme = localStorage.getItem('rk-theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeBtn.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('rk-theme', next);
  showToast(next === 'light' ? 'Switched to light mode ☀️' : 'Switched to dark mode 🌙', 'info', 2000);
});

/* ─────────────────────────────────────────
   2. MOBILE NAV HAMBURGER
   ───────────────────────────────────────── */
const navHam     = document.getElementById('navHam');
const navLinksEl = document.getElementById('navLinks');

navHam.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  navHam.setAttribute('aria-expanded', isOpen);
});

/* ─────────────────────────────────────────
   3. SMOOTH SCROLL + CLOSE MOBILE NAV
   ───────────────────────────────────────── */
function scrollToSection(id) {
  navLinksEl.classList.remove('open');
  navHam.setAttribute('aria-expanded', false);
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─────────────────────────────────────────
   4. ACTIVE NAV LINK ON SCROLL
   ───────────────────────────────────────── */
const sectionEls = document.querySelectorAll('section[id]');
const navAs      = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sectionEls.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navAs.forEach(a => {
    const onclick = a.getAttribute('onclick') || '';
    a.classList.toggle('active', onclick.includes(`'${current}'`));
  });
  // show / hide back-to-top
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ─────────────────────────────────────────
   5. BACK TO TOP BUTTON
   ───────────────────────────────────────── */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─────────────────────────────────────────
   6. SCROLL REVEAL ANIMATION
   ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   7. TOAST NOTIFICATION SYSTEM
   ───────────────────────────────────────── */
function showToast(msg, type = 'info', duration = 3500) {
  const icons = { success: '✅', info: 'ℹ️', error: '❌' };
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span>${msg}</span>
    <button class="toast-close" aria-label="Close notification">✕</button>`;
  container.appendChild(toast);

  // animate in (double rAF ensures transition fires)
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

  const dismiss = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  };
  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  setTimeout(dismiss, duration);
}

/* ─────────────────────────────────────────
   8. CLIPBOARD COPY HELPER
   ───────────────────────────────────────── */
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text)
    .then(() => showToast(`${label} copied to clipboard!`, 'success'))
    .catch(() => showToast(`${label}: ${text}`, 'info', 5000));
}

/* ─────────────────────────────────────────
   9. OPEN GOOGLE MAPS — LUCKNOW
   ───────────────────────────────────────── */
function openMaps() {
  window.open('https://maps.google.com?q=Lucknow,Uttar+Pradesh,India', '_blank');
  showToast('Opening Lucknow on Google Maps…', 'info');
}

/* ─────────────────────────────────────────
   10. CONTACT FORM → PRE-FILLED GMAIL
   ───────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const msg     = document.getElementById('cf-msg').value.trim();

  // Basic validation
  if (!name || !email || !subject || !msg) {
    showToast('Please fill in all fields.', 'error');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // Build Gmail compose URL with pre-filled fields
  const body = `Hi Raj,\n\nMy name is ${name} (${email}).\n\n${msg}\n\nBest regards,\n${name}`;
  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=rajkumarshukla050012@gmail.com` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, '_blank');
  showToast('Opening Gmail with your message pre-filled! ✉', 'success', 5000);
  this.reset();
});

/* ─────────────────────────────────────────
   11. PROJECT CAROUSEL — DYNAMIC BUILD
   ───────────────────────────────────────── */
function buildCarousel() {
  const track = document.getElementById('carouselTrack');

  const renderCard = (p) => {
    // Use screenshot if imgPath provided, otherwise show icon placeholder
    const imageHtml = p.imgPath
      ? `<img class="proj-screenshot" src="${p.imgPath}" alt="${p.title} screenshot" loading="lazy">
         <span class="proj-badge">${p.badge}</span>
         <span class="proj-arrow">↗</span>`
      : `<div class="proj-img-placeholder">
           <span class="proj-badge">${p.badge}</span>
           <span class="proj-arrow">↗</span>
           <span class="icon">${p.icon}</span>
           <span style="font-size:12px;color:var(--text-dim)">Click to view details</span>
         </div>`;

    return `
      <div class="proj-card" data-id="${p.id}" role="button" tabindex="0"
           aria-label="Open ${p.title} project details" style="position:relative;">
        ${imageHtml}
        <div class="proj-body">
          <div class="proj-tag">${p.tag}</div>
          <div class="proj-title">${p.title}</div>
          <div class="proj-desc">${p.desc.substring(0, 90)}…</div>
          <div class="proj-chips">${p.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
        </div>
      </div>`;
  };

  // Duplicate array for seamless infinite scroll
  track.innerHTML = [...PROJECTS, ...PROJECTS].map(renderCard).join('');

  // Attach click & keyboard events
  track.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(card.dataset.id);
      }
    });
  });
}

/* ─────────────────────────────────────────
   12. PROJECT MODAL
   ───────────────────────────────────────── */
function openProjectModal(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalTag').textContent   = p.tag;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent  = p.desc;
  document.getElementById('modalChips').innerHTML   =
    p.chips.map(c => `<span class="chip">${c}</span>`).join('');

  // Build action buttons
  let btns = '';
  if (p.liveUrl) {
    btns += `<a class="btn-primary" href="${p.liveUrl}" target="_blank" rel="noopener"
               onclick="showToast('Opening live site…','info')">↗ Live Site</a>`;
  } else {
    btns += `<button class="btn-primary" style="opacity:.65"
               onclick="showToast('Live URL coming soon — add it in js/data.js','info')">
               ↗ Live Site (soon)</button>`;
  }
  if (p.githubUrl) {
    btns += `<a class="btn-outline" href="${p.githubUrl}" target="_blank" rel="noopener">⌥ View Code</a>`;
  } else {
    btns += `<button class="btn-outline" style="opacity:.65"
               onclick="showToast('GitHub URL coming soon — add it in js/data.js','info')">
               ⌥ View Code (soon)</button>`;
  }
  document.getElementById('modalBtns').innerHTML = btns;

  document.getElementById('projModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('projModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('projModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ─────────────────────────────────────────
   13. SOCIAL LINKS — set from data.js
   ───────────────────────────────────────── */
document.getElementById('githubBtn').href    = SOCIAL.github;
document.getElementById('linkedinBtn').href  = SOCIAL.linkedin;
document.getElementById('footGithub').href   = SOCIAL.github;
document.getElementById('footLinkedin').href = SOCIAL.linkedin;

/* ─────────────────────────────────────────
   14. INIT — run on page load
   ───────────────────────────────────────── */
buildCarousel();
