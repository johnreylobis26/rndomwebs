// =============================================================
// Tin's Birthday Website — script.js
// =============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
     1. AMBIENT FLOATING DECORATIONS
     Edit FLOAT_ITEMS to change which symbols float around the page.
  ------------------------------------------------------------- */
  const FLOAT_ITEMS = ['♥', '💖', '💕', '✨', '🎂', '🎉', '🎈', '🥳'];
  const floatLayer = document.getElementById('floaters');
  const FLOAT_COUNT = window.innerWidth < 480 ? 16 : 26;

  for (let i = 0; i < FLOAT_COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'floater';
    el.textContent = FLOAT_ITEMS[Math.floor(Math.random() * FLOAT_ITEMS.length)];
    const size = 0.9 + Math.random() * 1.6;
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = Math.random() * 14;
    const drift = (Math.random() * 60 - 30) + 'px';

    el.style.left = left + 'vw';
    el.style.fontSize = size + 'rem';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    el.style.setProperty('--drift', drift);

    floatLayer.appendChild(el);
  }

  /* ------------------------------------------------------------
     2. HERO -> SCROLL TO ENVELOPE
  ------------------------------------------------------------- */
  const openSurpriseBtn = document.getElementById('openSurprise');
  const envelopeScreen = document.getElementById('envelopeScreen');

  openSurpriseBtn.addEventListener('click', () => {
    startMusic(); // first user interaction — safe to start audio
    envelopeScreen.scrollIntoView({ behavior: 'smooth' });
  });

  /* ------------------------------------------------------------
     3. BACKGROUND MUSIC — floating toggle button
     TO REPLACE THE MUSIC: swap assets/background-music.mp3
     for another file with the same name (or update index.html).
  ------------------------------------------------------------- */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  let musicStarted = false;

  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => {
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Pause background music');
    }).catch(() => {
      // Autoplay blocked — user can still tap the button manually
      musicStarted = false;
    });
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      startMusic();
      if (!musicStarted) { bgMusic.play(); musicStarted = true; }
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Pause background music');
    } else {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Play background music');
    }
  });

  /* ------------------------------------------------------------
     4. ENVELOPE INTERACTION
  ------------------------------------------------------------- */
  const envelopeWrap = document.getElementById('envelopeWrap');
  const envelope = document.getElementById('envelope');
  const envelopeCaption = document.getElementById('envelopeCaption');
  const letterScreen = document.getElementById('letterScreen');
  const letterBody = document.querySelector('.letter-body');
  let envelopeOpened = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    startMusic();
    envelope.classList.add('is-open');
    envelopeCaption.style.opacity = '0';

    setTimeout(() => {
      letterScreen.scrollIntoView({ behavior: 'smooth' });
      letterBody.classList.add('reveal');
    }, 850);
  }

  envelopeWrap.addEventListener('click', openEnvelope);
  envelopeWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* ------------------------------------------------------------
     5. SCROLL BUTTONS (letter -> gallery -> closing)
  ------------------------------------------------------------- */
  document.getElementById('toGallery').addEventListener('click', () => {
    document.getElementById('galleryScreen').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('toClosing').addEventListener('click', () => {
    document.getElementById('closingScreen').scrollIntoView({ behavior: 'smooth' });
  });

  /* ------------------------------------------------------------
     6. GALLERY — reveal-on-scroll + lightbox
  ------------------------------------------------------------- */
  const memCards = document.querySelectorAll('.mem-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  memCards.forEach((card) => revealObserver.observe(card));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  memCards.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) return; // placeholders have no image yet
    card.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = card.dataset.caption || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});