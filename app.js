/**
 * ====================================================================
 * 🌸 BIRTHDAY GARDEN APP LOGIC & INTERACTION ENGINE 🌸
 * ====================================================================
 */

(function () {
  'use strict';

  // --- STATE & DATA MANAGEMENT ---
  const STORAGE_KEY = 'birthday_garden_custom_data_v1';
  let appData = loadInitialData();
  let bouquetSelected = [];

  function loadInitialData() {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        if (stored.includes('🪻')) {
          stored = stored.replaceAll('🪻', '🌸');
          localStorage.setItem(STORAGE_KEY, stored);
        }
        const parsed = JSON.parse(stored);
        
        // Deeply preserve fresh memories and media from window.BIRTHDAY_DATA
        let envelopes = (window.BIRTHDAY_DATA && window.BIRTHDAY_DATA.envelopes) ? window.BIRTHDAY_DATA.envelopes : [];
        if (parsed.envelopes && Array.isArray(parsed.envelopes)) {
          envelopes = envelopes.map(defaultEnv => {
            const storedEnv = parsed.envelopes.find(e => e.id === defaultEnv.id);
            if (!storedEnv) return defaultEnv;
            const mergedContent = { ...storedEnv.content, ...defaultEnv.content };
            // If defaultEnv in notes.js has memories defined, always use defaultEnv.content.memories
            if (defaultEnv.content && defaultEnv.content.memories) {
              mergedContent.memories = defaultEnv.content.memories;
            }
            return {
              ...storedEnv,
              ...defaultEnv,
              content: mergedContent
            };
          });
        }

        const effectiveDate = (window.BIRTHDAY_DATA && window.BIRTHDAY_DATA.birthdayDate) ? window.BIRTHDAY_DATA.birthdayDate : "2026-10-09";
        const mergedData = {
          ...window.BIRTHDAY_DATA,
          ...parsed,
          birthdayDate: effectiveDate,
          envelopes: envelopes,
          compliments: (parsed.compliments && parsed.compliments.length) ? parsed.compliments : window.BIRTHDAY_DATA.compliments
        };
        // Update stored cache so stale memories don't linger
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
        } catch (_) {}
        return mergedData;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, using default notes.js data', e);
    }
    return { ...window.BIRTHDAY_DATA };
  }

  function saveCustomData(updatedData) {
    appData = { ...appData, ...updatedData };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
    renderAll();
  }

  // --- AUDIO SYNTHESIS & ROMANTIC MUSIC ENGINE ---
  // Uses Web Audio API for zero-dependency, 100% reliable romantic background music & sound effects
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicGainNode = null;
  let musicTimer = null;
  let externalAudio = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Romantic Chord Progression (Fmaj7 - Am7 - Dm7 - Cmaj7)
  const romanticMelodyNotes = [
    // [frequency, duration in seconds]
    [349.23, 0.8], [440.00, 0.8], [523.25, 0.8], [659.25, 1.2], // Fmaj7
    [329.63, 0.8], [392.00, 0.8], [493.88, 0.8], [587.33, 1.2], // Em7
    [293.66, 0.8], [349.23, 0.8], [440.00, 0.8], [523.25, 1.2], // Dm7
    [261.63, 0.8], [329.63, 0.8], [392.00, 0.8], [523.25, 1.6], // Cmaj7
    [349.23, 0.6], [523.25, 0.6], [659.25, 0.8], [783.99, 1.2], // High Fmaj9
    [392.00, 0.6], [493.88, 0.6], [587.33, 0.8], [659.25, 1.2]  // High G
  ];

  let currentNoteIdx = 0;

  function playSynthMusicStep() {
    if (!isPlayingMusic || !audioCtx) return;

    const [freq, duration] = romanticMelodyNotes[currentNoteIdx];
    currentNoteIdx = (currentNoteIdx + 1) % romanticMelodyNotes.length;

    // Create gentle warm sine oscillator
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const volume = parseFloat(document.getElementById('volumeSlider')?.value || 0.5) * 0.25;

    // Soft attack and decay (bell / music box texture)
    noteGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(noteGain);
    noteGain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);

    // Schedule next note with smooth overlap
    musicTimer = setTimeout(playSynthMusicStep, duration * 650);
  }

  function toggleMusic() {
    initAudioContext();
    const btn = document.getElementById('musicToggleBtn');
    const label = document.getElementById('musicTrackName');

    if (appData.customMusicUrl) {
      // If user supplied external MP3 URL
      if (!externalAudio) {
        externalAudio = new Audio(appData.customMusicUrl);
        externalAudio.loop = true;
      }
      if (externalAudio.paused) {
        externalAudio.volume = parseFloat(document.getElementById('volumeSlider')?.value || 0.5);
        externalAudio.play();
        isPlayingMusic = true;
        btn.classList.add('playing');
        label.textContent = 'Pause Music';
      } else {
        externalAudio.pause();
        isPlayingMusic = false;
        btn.classList.remove('playing');
        label.textContent = 'Play Music';
      }
      return;
    }

    // Procedural Romantic Melody
    if (isPlayingMusic) {
      isPlayingMusic = false;
      if (musicTimer) clearTimeout(musicTimer);
      btn.classList.remove('playing');
      label.textContent = 'Play Romantic Melody';
    } else {
      isPlayingMusic = true;
      btn.classList.add('playing');
      label.textContent = 'Pause Melody';
      playSynthMusicStep();
    }
  }

  // Sound Effects Generator (Paper, Chime, Blow)
  function playSoundEffect(type) {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const masterVol = parseFloat(document.getElementById('volumeSlider')?.value || 0.5);

      if (type === 'paper') {
        // Soft rustle / click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(masterVol * 0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'chime') {
        // Sweet magical bell chime
        [587.33, 880.00, 1174.66].forEach((f, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.001, audioCtx.currentTime + i * 0.08);
          gain.gain.linearRampToValueAtTime(masterVol * 0.15, audioCtx.currentTime + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + i * 0.08);
          osc.stop(audioCtx.currentTime + i * 0.08 + 0.6);
        });
      } else if (type === 'blow') {
        // Wind whoosh + chime celebration
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(masterVol * 0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio effect error', e);
    }
  }

  // --- FLOATING PETALS & SPARKLES CANVAS ---
  const canvas = document.getElementById('petalCanvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  const PETAL_COUNT = 38;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.colorType = Math.random(); // 0 = blush pink, 1 = deep rose, 2 = gold sparkle
      this.swayAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.swayAngle += 0.02;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.7;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 30 || this.x < -30 || this.x > canvas.width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.colorType > 0.85) {
        // Gold fairy sparkle
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Enchanted Lavender & Violet Petal Shape
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        if (this.colorType > 0.6) {
          grad.addColorStop(0, '#e9d5ff'); // Light lilac
          grad.addColorStop(1, '#a855f7'); // Lavender bloom
        } else if (this.colorType > 0.3) {
          grad.addColorStop(0, '#d8b4fe'); // Soft wisteria
          grad.addColorStop(1, '#7e22ce'); // Royal amethyst
        } else {
          grad.addColorStop(0, '#f3e8ff'); // Violet mist
          grad.addColorStop(1, '#c084fc'); // Purple orchid
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.9);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.4, this.size * 0.6, this.size * 0.8, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.8, -this.size * 0.8, -this.size * 0.4, 0, -this.size * 0.9);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(new Petal());
  }

  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of petals) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animatePetals);
  }
  requestAnimationFrame(animatePetals);

  // --- CELEBRATION CONFETTI ENGINE ---
  function triggerCelebrationConfetti() {
    playSoundEffect('chime');
    const colors = ['#a855f7', '#c084fc', '#7e22ce', '#9333ea', '#e9d5ff', '#facc15', '#ffffff'];
    const count = 90;

    for (let i = 0; i < count; i++) {
      const petal = new Petal();
      petal.x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      petal.y = window.innerHeight * 0.4 + (Math.random() - 0.5) * 100;
      petal.speedY = -(Math.random() * 8 + 3);
      petal.speedX = (Math.random() - 0.5) * 14;
      petals.push(petal);
    }

    // Trim excess particles after 4 seconds
    setTimeout(() => {
      while (petals.length > PETAL_COUNT) {
        petals.pop();
      }
    }, 4500);
  }

  // --- BIRTHDAY WHISPERS & COMPLIMENT SLIDESHOW ENGINE ---
  let currentComplimentIdx = 0;
  let complimentTimer = null;

  function getComplimentsList() {
    return (appData.compliments && appData.compliments.length > 0)
      ? appData.compliments
      : [
          "Your laughter is my favorite song in the entire universe. You make every ordinary moment feel like poetry.",
          "The world is softer, kinder, and so much brighter simply because you were born.",
          "You have a soul made of wildflowers and pure grace—delicate, resilient, and breathtakingly beautiful.",
          "Watching your eyes light up when you smile is the sweetest sight I will ever know.",
          "You bring warmth into every single room you enter, effortlessly making people feel loved and safe.",
          "Thank you for being my safest haven, my sweetest comfort, and my greatest adventure.",
          "On your birthday and every single day that follows: you are cherished beyond all words and measure."
        ];
  }

  function showCompliment(index, animate = true) {
    const list = getComplimentsList();
    if (list.length === 0) return;

    currentComplimentIdx = (index + list.length) % list.length;
    const textEl = document.getElementById('complimentText');
    const countEl = document.getElementById('complimentCount');
    const authorEl = document.getElementById('complimentAuthor');
    const dotsHolder = document.getElementById('complimentDots');

    if (countEl) countEl.textContent = `${currentComplimentIdx + 1} of ${list.length}`;
    if (authorEl) authorEl.textContent = `— ${appData.partnerName || 'Yours Always'} ♡`;

    if (dotsHolder) {
      dotsHolder.innerHTML = '';
      list.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `compliment-dot ${i === currentComplimentIdx ? 'active' : ''}`;
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Compliment ${i + 1}`);
        dot.addEventListener('click', () => {
          showCompliment(i);
          resetComplimentAutoplay();
        });
        dotsHolder.appendChild(dot);
      });
    }

    if (!textEl) return;

    if (animate) {
      textEl.classList.add('fade-out');
      setTimeout(() => {
        textEl.textContent = list[currentComplimentIdx];
        textEl.classList.remove('fade-out');
      }, 250);
    } else {
      textEl.textContent = list[currentComplimentIdx];
    }
  }

  function nextCompliment() {
    showCompliment(currentComplimentIdx + 1);
  }

  function prevCompliment() {
    showCompliment(currentComplimentIdx - 1);
  }

  function randomCompliment() {
    playSoundEffect('chime');
    const list = getComplimentsList();
    if (list.length <= 1) return;
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * list.length);
    } while (nextIdx === currentComplimentIdx);
    showCompliment(nextIdx);
    resetComplimentAutoplay();
  }

  function startComplimentAutoplay() {
    stopComplimentAutoplay();
    complimentTimer = setInterval(() => {
      nextCompliment();
    }, 6000);
  }

  function stopComplimentAutoplay() {
    if (complimentTimer) {
      clearInterval(complimentTimer);
      complimentTimer = null;
    }
  }

  function resetComplimentAutoplay() {
    stopComplimentAutoplay();
    startComplimentAutoplay();
  }

  function formatBirthdayDate(dateStr) {
    if (!dateStr) return 'OCTOBER 9, 2026';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
      }
    } catch (_) {}
    return dateStr;
  }

  // --- RENDER HERO & METADATA ---
  function renderHero() {
    const heroName = document.getElementById('heroRecipientName');
    const heroSub = document.getElementById('heroSubtitle');
    const partnerFooter = document.getElementById('footerPartnerName');
    const vaseTag = document.getElementById('vaseTag');
    const badgeEl = document.getElementById('heroDateBadge');

    if (heroName) heroName.textContent = appData.recipientName || 'My Love';
    if (heroSub) heroSub.textContent = appData.subtitleMessage || '';
    if (partnerFooter) partnerFooter.textContent = appData.partnerName || 'Yours Always';
    if (vaseTag) vaseTag.textContent = `For ${appData.recipientName || 'You'} ♡`;
    
    if (badgeEl) {
      const today = new Date();
      const bDate = appData.birthdayDate ? new Date(appData.birthdayDate + 'T00:00:00') : null;
      if (bDate) {
        const isSameDay = today.getFullYear() === bDate.getFullYear() &&
                          today.getMonth() === bDate.getMonth() &&
                          today.getDate() === bDate.getDate();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const isTomorrow = tomorrow.getFullYear() === bDate.getFullYear() &&
                           tomorrow.getMonth() === bDate.getMonth() &&
                           tomorrow.getDate() === bDate.getDate();

        if (isSameDay) {
          badgeEl.textContent = '🎉 Happy Birthday Today! • October 9th 🎂';
        } else if (isTomorrow) {
          badgeEl.textContent = '🌸 Today is all about you • October 9th! ✨';
        } else {
          badgeEl.textContent = `A Special Celebration • October 9, 2026 ✨`;
        }
      } else {
        badgeEl.textContent = '🌸 Today is all about you • October 9th! ✨';
      }
    }

    showCompliment(currentComplimentIdx, false);
  }

  // --- RENDER ENVELOPES GRID ---
  function renderEnvelopes() {
    const grid = document.getElementById('envelopesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    appData.envelopes.forEach((env, index) => {
      const cardItem = document.createElement('article');
      cardItem.className = 'envelope-card-item';
      cardItem.id = `card-item-${env.id}`;

      const hasMemories = env.content && env.content.memories && env.content.memories.length > 0;
      let peekMediaHtml = '';
      if (hasMemories) {
        const firstMem = env.content.memories[0];
        const isVid = firstMem.video || (firstMem.image && /\.(mp4|webm|mov|ogg|m4v)/i.test(firstMem.image));
        const src = isVid ? (firstMem.video || firstMem.image) : firstMem.image;
        if (isVid) {
          peekMediaHtml = `<video src="${src}" autoplay muted loop playsinline></video>`;
        } else if (src) {
          peekMediaHtml = `<img src="${src}" alt="Memory Peek">`;
        } else {
          peekMediaHtml = `<span>${firstMem.icon || '🌸'}</span>`;
        }
      }

      cardItem.innerHTML = `
        <div class="envelope-meta-header">
          <span class="envelope-number">NO. ${env.number || String(index + 1).padStart(2, '0')}</span>
          <span class="envelope-tag-pill">${env.tag || 'Love Letter'}</span>
        </div>

        <!-- 3D Physical Envelope -->
        <div class="envelope-physical" id="phys-${env.id}" role="button" tabindex="0" aria-label="Open ${env.title}">
          <div class="envelope-inside"></div>
          
          <!-- Peek Letter inside -->
          <div class="envelope-letter-peek ${hasMemories ? 'envelope-peek-polaroid-wrap' : ''}">
            ${hasMemories ? `
              <div class="envelope-peek-polaroid">
                <div class="peek-photo-frame">
                  ${peekMediaHtml}
                </div>
                <span class="peek-caption">${env.content.memories[0]?.title || 'Our Memories'}</span>
              </div>
            ` : `
              <span style="font-size: 0.8rem; font-weight: 600; color: #db2777;">${env.title}</span>
              <div class="peek-lines">
                <span class="peek-line"></span>
                <span class="peek-line"></span>
                <span class="peek-line"></span>
              </div>
            `}
          </div>

          <!-- Folded Flap (opens on hover / click) -->
          <div class="envelope-flap"></div>

          <!-- Front Pockets -->
          <div class="envelope-front-pocket">
            <div class="envelope-pocket-left"></div>
            <div class="envelope-pocket-right"></div>
            <div class="envelope-pocket-bottom"></div>
          </div>

          <!-- 3D Wax Seal with monogram / flower -->
          <div class="wax-seal" style="background: radial-gradient(circle at 35% 35%, ${env.sealColor || '#c0264b'} 0%, #881337 100%);">
            <span class="wax-seal-icon">${env.flowerIcon || '🌸'}</span>
          </div>
        </div>

        <div class="envelope-info">
          <h3 class="envelope-card-title">${env.title}</h3>
          <p class="envelope-card-sub">${env.subtitle || ''}</p>
          ${hasMemories ? `
            <div class="envelope-media-preview-strip" title="Click to open full polaroid album">
              ${env.content.memories.map((m, idx) => {
                const isVid = m.video || (m.image && /\.(mp4|webm|mov|ogg|m4v)/i.test(m.image));
                const src = isVid ? (m.video || m.image) : m.image;
                return `
                  <div class="envelope-mini-thumb" title="${m.title || 'Memory ' + (idx + 1)}">
                    ${isVid ? `
                      <video src="${src}" muted playsinline preload="metadata"></video>
                      <span class="mini-vid-badge">▶</span>
                    ` : (src ? `
                      <img src="${src}" alt="${m.title || 'Memory'}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${m.icon || '🌸'}</span>';">
                    ` : `<span>${m.icon || '🌸'}</span>`)}
                  </div>
                `;
              }).join('')}
            </div>
            <div class="envelope-photos-badge">📸 ${env.content.memories.length} Memories Inside • Tap to Open</div>
          ` : ''}
          <button class="envelope-open-btn" data-envelope-id="${env.id}">
            <span>${hasMemories ? 'Unseal & Open Album' : 'Unseal & Read Letter'}</span>
            <span>${hasMemories ? '📸' : '💌'}</span>
          </button>
        </div>
      `;

      // Event listener for opening
      const openAction = () => openEnvelopeModal(env.id);

      const physEnv = cardItem.querySelector('.envelope-physical');
      physEnv.addEventListener('click', openAction);
      physEnv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAction();
        }
      });

      const openBtn = cardItem.querySelector('.envelope-open-btn');
      openBtn.addEventListener('click', openAction);

      const previewStrip = cardItem.querySelector('.envelope-media-preview-strip');
      if (previewStrip) {
        previewStrip.addEventListener('click', openAction);
      }

      grid.appendChild(cardItem);
    });
  }

  // --- OPEN LETTER MODAL & POPULATE CONTENT ---
  const letterModal = document.getElementById('letterModal');

  function openEnvelopeModal(envelopeId) {
    const env = appData.envelopes.find(e => e.id === envelopeId);
    if (!env) return;

    playSoundEffect('paper');
    setTimeout(() => playSoundEffect('chime'), 200);

    // If envelope 6 is the Birthday Cake card, scroll smoothly to the cake section or show in modal
    if (env.content && env.content.isCakeCard) {
      const cakeSection = document.getElementById('cakeSection');
      if (cakeSection) {
        cakeSection.scrollIntoView({ behavior: 'smooth' });
        triggerCelebrationConfetti();
        return;
      }
    }

    // Populate Modal Details
    const stampIcon = document.getElementById('modalStampIcon');
    const stampText = document.getElementById('modalStampText');
    const dateStamp = document.getElementById('modalDateStamp');
    const letterTag = document.getElementById('modalLetterTag');
    const letterTitle = document.getElementById('modalLetterTitle');
    const letterBody = document.getElementById('modalLetterBody');
    const letterClosing = document.getElementById('modalLetterClosing');
    const letterSig = document.getElementById('modalLetterSignature');
    const footerSeal = document.getElementById('modalFooterSealIcon');

    if (stampIcon) stampIcon.textContent = env.flowerIcon || '🌸';
    if (stampText) stampText.textContent = env.stampText || 'SPECIAL';
    if (dateStamp) dateStamp.textContent = formatBirthdayDate(appData.birthdayDate);
    if (letterTag) letterTag.textContent = env.tag || 'Love Letter';
    if (letterTitle) letterTitle.textContent = env.title;
    if (letterClosing) letterClosing.textContent = env.content.closing || 'With all my love,';
    if (letterSig) letterSig.textContent = env.content.signature || `${appData.partnerName || 'Yours Always'} ♡`;
    if (footerSeal) footerSeal.textContent = env.flowerIcon || '💖';

    // Populate dynamic body
    letterBody.innerHTML = '';

    if (env.content.salutation) {
      const salutationEl = document.createElement('p');
      salutationEl.className = 'letter-salutation';
      salutationEl.textContent = env.content.salutation.replace('My Dearest', `${appData.recipientName ? appData.recipientName + ',' : 'My Dearest,'}`);
      letterBody.appendChild(salutationEl);
    }

    // Case 1: Standard Paragraphs
    if (env.content.paragraphs) {
      env.content.paragraphs.forEach(p => {
        const pEl = document.createElement('p');
        pEl.textContent = p;
        letterBody.appendChild(pEl);
      });
    }

    // Case 2: Reasons list
    if (env.content.reasons) {
      const list = document.createElement('div');
      list.className = 'reasons-list';
      env.content.reasons.forEach(r => {
        const item = document.createElement('div');
        item.className = 'reason-item';
        item.innerHTML = `
          <span class="reason-emoji">${r.emoji || '✨'}</span>
          <div class="reason-text">
            <strong>${r.title}</strong>
            <span>${r.desc}</span>
          </div>
        `;
        list.appendChild(item);
      });
      letterBody.appendChild(list);
    }

    // Case 3: Polaroid memories (Supports Photos & Videos!)
    if (env.content.memories) {
      const grid = document.createElement('div');
      grid.className = 'polaroids-grid';
      env.content.memories.forEach(m => {
        const pol = document.createElement('div');
        pol.className = 'polaroid-card';
        const videoSource = m.video || (m.image && /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(m.image) ? m.image : null);
        const imgSource = !videoSource ? (m.image || m.imageUrl) : null;

        let photoContent;
        if (videoSource) {
          photoContent = `
            <video src="${videoSource}" autoplay loop muted playsinline preload="metadata" title="${m.title || 'Video Memory'}"></video>
            <span class="video-indicator-badge" title="Live Video Clip">▶</span>
          `;
        } else if (imgSource) {
          photoContent = `
            <img src="${imgSource}" alt="${m.title || 'Memory'}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline';"><span style="display:none;">${m.icon || '🌸'}</span>
          `;
        } else {
          photoContent = `<span>${m.icon || '🌸'}</span>`;
        }

        pol.innerHTML = `
          <div class="polaroid-photo" style="background: ${m.colorGradient || '#fce7f3'};">
            ${photoContent}
          </div>
          <div class="polaroid-title">${m.title}</div>
          <div class="polaroid-caption">${m.caption}</div>
        `;

        const photoEl = pol.querySelector('.polaroid-photo');
        const vid = photoEl?.querySelector('video');
        if (vid) {
          photoEl.style.cursor = 'pointer';
          photoEl.title = 'Tap to play/pause or unmute video';
          photoEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (vid.muted) vid.muted = false;
            if (vid.paused) {
              vid.play();
            } else {
              vid.pause();
            }
          });
        }

        grid.appendChild(pol);
      });
      letterBody.appendChild(grid);
    }

    // Case 4: Love Coupons / Vouchers
    if (env.content.coupons) {
      const list = document.createElement('div');
      list.className = 'coupons-list';
      env.content.coupons.forEach(c => {
        const ticket = document.createElement('div');
        ticket.className = 'coupon-ticket';
        ticket.innerHTML = `
          <div class="coupon-info">
            <h4>${c.title}</h4>
            <p>${c.desc}</p>
          </div>
          <div class="coupon-badge">${c.code}</div>
        `;
        list.appendChild(ticket);
      });
      letterBody.appendChild(list);
    }

    // Open native dialog modal
    if (typeof letterModal.showModal === 'function') {
      letterModal.showModal();
    } else {
      letterModal.setAttribute('open', '');
    }
  }

  function closeLetterModal() {
    if (typeof letterModal.close === 'function') {
      letterModal.close();
    } else {
      letterModal.removeAttribute('open');
    }
  }

  // --- INTERACTIVE BOUQUET BUILDER ---
  function renderBouquetPalette() {
    const list = document.getElementById('flowerCardsList');
    if (!list) return;
    list.innerHTML = '';

    appData.bouquetFlowers.forEach(flower => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flower-picker-item';
      btn.innerHTML = `
        <span class="flower-item-icon">${flower.icon}</span>
        <span class="flower-item-name">${flower.name}</span>
        <span class="flower-item-meaning">${flower.symbolism}</span>
      `;
      btn.addEventListener('click', () => addFlowerToVase(flower));
      list.appendChild(btn);
    });
  }

  function addFlowerToVase(flower) {
    playSoundEffect('chime');
    bouquetSelected.push(flower);
    updateVaseDisplay();
  }

  function updateVaseDisplay() {
    const holder = document.getElementById('vaseFlowersHolder');
    const hint = document.getElementById('emptyVaseHint');
    const countBadge = document.getElementById('bouquetCount');

    if (!holder) return;

    if (countBadge) countBadge.textContent = bouquetSelected.length;

    if (bouquetSelected.length === 0) {
      holder.innerHTML = '';
      if (hint) hint.style.display = 'block';
      return;
    }

    if (hint) hint.style.display = 'none';
    holder.innerHTML = '';

    // Position flowers with organic natural bouquet angles and offsets
    bouquetSelected.forEach((f, idx) => {
      const bloom = document.createElement('div');
      bloom.className = 'blooming-flower-item';

      // Spread flowers naturally across the vase neck
      const total = bouquetSelected.length;
      const angle = (idx - total / 2) * 12; // degrees
      const xOffset = (idx - total / 2) * 22; // px
      const yOffset = Math.sin((idx / total) * Math.PI) * -18; // arch

      bloom.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`;
      bloom.style.zIndex = idx + 1;
      bloom.title = `${f.name}: ${f.symbolism}`;

      bloom.innerHTML = `
        <div class="blooming-flower-icon">${f.icon}</div>
      `;

      holder.appendChild(bloom);
    });
  }

  function resetBouquet() {
    bouquetSelected = [];
    updateVaseDisplay();
  }

  // Bouquet Modal Presentation
  const bouquetModal = document.getElementById('bouquetModal');
  function openBouquetPresentation() {
    if (bouquetSelected.length === 0) {
      alert('Please tap at least one flower on the left to add to your bouquet!');
      return;
    }

    playSoundEffect('chime');
    const bloomsEl = document.getElementById('presentationBlooms');
    const meaningsEl = document.getElementById('presentationMeanings');

    if (bloomsEl) {
      bloomsEl.textContent = bouquetSelected.map(f => f.icon).join(' ');
    }

    if (meaningsEl) {
      meaningsEl.innerHTML = bouquetSelected.map(f => `
        <div><strong>${f.icon} ${f.name}:</strong> ${f.quote || f.symbolism}</div>
      `).join('');
    }

    if (typeof bouquetModal.showModal === 'function') {
      bouquetModal.showModal();
    } else {
      bouquetModal.setAttribute('open', '');
    }
  }

  function closeBouquetPresentation() {
    if (typeof bouquetModal.close === 'function') {
      bouquetModal.close();
    } else {
      bouquetModal.removeAttribute('open');
    }
  }

  // --- INTERACTIVE CAKE & CANDLE BLOW ENGINE ---
  function initCakeInteractions() {
    const candles = document.querySelectorAll('.candle');
    const blowBtn = document.getElementById('blowCandlesBtn');
    const relightBtn = document.getElementById('relightCandlesBtn');
    const wishCard = document.getElementById('wishRevealCard');

    candles.forEach(candle => {
      candle.addEventListener('click', () => {
        if (candle.getAttribute('data-lit') === 'true') {
          candle.setAttribute('data-lit', 'false');
          playSoundEffect('blow');
          checkAllCandlesBlown();
        }
      });
    });

    if (blowBtn) {
      blowBtn.addEventListener('click', () => {
        playSoundEffect('blow');
        candles.forEach(c => c.setAttribute('data-lit', 'false'));
        checkAllCandlesBlown();
      });
    }

    if (relightBtn) {
      relightBtn.addEventListener('click', () => {
        candles.forEach(c => c.setAttribute('data-lit', 'true'));
        if (wishCard) wishCard.classList.add('hidden');
        playSoundEffect('chime');
      });
    }

    function checkAllCandlesBlown() {
      const allBlown = Array.from(candles).every(c => c.getAttribute('data-lit') === 'false');
      if (allBlown) {
        setTimeout(() => {
          triggerCelebrationConfetti();
          if (wishCard) wishCard.classList.remove('hidden');
        }, 500);
      }
    }
  }

  // --- CUSTOMIZER & NOTE EDITOR ---
  const customizerModal = document.getElementById('customizerModal');

  function openCustomizer() {
    populateCustomizerForm();
    if (typeof customizerModal.showModal === 'function') {
      customizerModal.showModal();
    } else {
      customizerModal.setAttribute('open', '');
    }
  }

  function closeCustomizer() {
    if (typeof customizerModal.close === 'function') {
      customizerModal.close();
    } else {
      customizerModal.removeAttribute('open');
    }
  }

  function populateCustomizerForm() {
    const inRecip = document.getElementById('inputRecipient');
    const inPartner = document.getElementById('inputPartner');
    const inDate = document.getElementById('inputDate');
    const inAudio = document.getElementById('inputAudio');
    const inSub = document.getElementById('inputSubtitle');
    const envList = document.getElementById('envelopeEditorList');

    if (inRecip) inRecip.value = appData.recipientName || '';
    if (inPartner) inPartner.value = appData.partnerName || '';
    if (inDate) inDate.value = appData.birthdayDate || '';
    if (inAudio) inAudio.value = appData.customMusicUrl || '';
    if (inSub) inSub.value = appData.subtitleMessage || '';

    if (envList) {
      envList.innerHTML = '';
      appData.envelopes.forEach((env, i) => {
        const box = document.createElement('div');
        box.className = 'env-edit-box';
        
        // Find existing text representation
        let textVal = '';
        if (env.content.paragraphs) {
          textVal = env.content.paragraphs.join('\n\n');
        } else if (env.content.reasons) {
          textVal = env.content.reasons.map(r => `${r.title}: ${r.desc}`).join('\n');
        } else if (env.content.memories) {
          textVal = env.content.memories.map(m => `${m.title} (${m.date}): ${m.caption}`).join('\n');
        } else if (env.content.coupons) {
          textVal = env.content.coupons.map(c => `${c.title} - ${c.desc}`).join('\n');
        }

        box.innerHTML = `
          <label>Envelope ${i + 1}: ${env.title}</label>
          <textarea id="env-text-${env.id}" placeholder="Enter card content...">${textVal}</textarea>
        `;
        envList.appendChild(box);
      });
    }
  }

  function handleCustomizerSubmit(e) {
    e.preventDefault();

    const inRecip = document.getElementById('inputRecipient').value;
    const inPartner = document.getElementById('inputPartner').value;
    const inDate = document.getElementById('inputDate').value;
    const inAudio = document.getElementById('inputAudio').value;
    const inSub = document.getElementById('inputSubtitle').value;

    const updatedEnvelopes = appData.envelopes.map(env => {
      const textarea = document.getElementById(`env-text-${env.id}`);
      if (!textarea) return env;

      const raw = textarea.value.trim();
      const updated = { ...env, content: { ...env.content } };

      if (env.content.paragraphs) {
        updated.content.paragraphs = raw.split('\n\n').filter(Boolean);
      }
      return updated;
    });

    saveCustomData({
      recipientName: inRecip,
      partnerName: inPartner,
      birthdayDate: inDate,
      customMusicUrl: inAudio,
      subtitleMessage: inSub,
      envelopes: updatedEnvelopes
    });

    closeCustomizer();
    triggerCelebrationConfetti();
    alert('🌸 Changes saved successfully!');
  }

  function exportCleanJson() {
    const code = `// Paste this into notes.js to permanently save your changes!\nwindow.BIRTHDAY_DATA = ${JSON.stringify(appData, null, 2)};`;
    navigator.clipboard.writeText(code).then(() => {
      alert('📋 Code copied to your clipboard! You can paste it into notes.js.');
    }).catch(() => {
      prompt('Copy the code below:', code);
    });
  }

  function resetToDefaults() {
    if (confirm('Are you sure you want to reset all changes back to original default notes?')) {
      localStorage.removeItem(STORAGE_KEY);
      appData = { ...window.BIRTHDAY_DATA };
      renderAll();
      populateCustomizerForm();
      alert('Reset to defaults complete!');
    }
  }

  // --- MASTER RENDER ---
  function renderAll() {
    renderHero();
    renderEnvelopes();
    renderBouquetPalette();
    updateVaseDisplay();
  }

  // --- INITIALIZE EVENT LISTENERS ---
  function initEventListeners() {
    // Top Nav & Actions
    document.getElementById('confettiBtn')?.addEventListener('click', triggerCelebrationConfetti);
    document.getElementById('openCustomizerBtn')?.addEventListener('click', openCustomizer);
    document.getElementById('footerEditBtn')?.addEventListener('click', openCustomizer);
    document.getElementById('musicToggleBtn')?.addEventListener('click', toggleMusic);
    document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
      if (externalAudio) externalAudio.volume = parseFloat(e.target.value);
    });

    // Compliment & Whispers Slideshow Controls
    document.getElementById('prevComplimentBtn')?.addEventListener('click', () => {
      prevCompliment();
      resetComplimentAutoplay();
    });
    document.getElementById('nextComplimentBtn')?.addEventListener('click', () => {
      nextCompliment();
      resetComplimentAutoplay();
    });
    document.getElementById('randomComplimentBtn')?.addEventListener('click', randomCompliment);

    const complimentCardEl = document.getElementById('complimentCard');
    if (complimentCardEl) {
      complimentCardEl.addEventListener('mouseenter', stopComplimentAutoplay);
      complimentCardEl.addEventListener('mouseleave', startComplimentAutoplay);
    }
    startComplimentAutoplay();

    // Letter Modal
    document.getElementById('closeLetterBtn')?.addEventListener('click', closeLetterModal);
    letterModal?.addEventListener('click', (e) => {
      if (e.target === letterModal) closeLetterModal();
    });

    // Bouquet actions
    document.getElementById('resetBouquetBtn')?.addEventListener('click', resetBouquet);
    document.getElementById('bouquetGiftBtn')?.addEventListener('click', openBouquetPresentation);
    document.getElementById('closeBouquetModalBtn')?.addEventListener('click', closeBouquetPresentation);
    document.getElementById('shareBouquetBtn')?.addEventListener('click', () => {
      closeBouquetPresentation();
      triggerCelebrationConfetti();
    });
    bouquetModal?.addEventListener('click', (e) => {
      if (e.target === bouquetModal) closeBouquetPresentation();
    });

    // Customizer Modal
    document.getElementById('closeCustomizerBtn')?.addEventListener('click', closeCustomizer);
    document.getElementById('customizerForm')?.addEventListener('submit', handleCustomizerSubmit);
    document.getElementById('exportJsonBtn')?.addEventListener('click', exportCleanJson);
    document.getElementById('resetDefaultsBtn')?.addEventListener('click', resetToDefaults);
    customizerModal?.addEventListener('click', (e) => {
      if (e.target === customizerModal) closeCustomizer();
    });

    // Scroll to top
    document.getElementById('scrollToTopBtn')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Cake interactions
    initCakeInteractions();

    // --- CREATOR / RECIPIENT PRIVACY MODE ---
    // By default, all "Edit" buttons are 100% HIDDEN so your girlfriend sees a clean, magical gift!
    // To access the editor anytime, either:
    // 1. Add ?edit=true to the URL (e.g. http://localhost:4173/?edit=true)
    // 2. Press Ctrl + Shift + E
    // 3. Tap your signature at the very bottom of the page 5 times!
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true' || urlParams.get('admin') === 'true') {
      document.body.classList.add('edit-mode');
    }

    // Secret keyboard shortcut (Ctrl + Shift + E)
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        document.body.classList.toggle('edit-mode');
        playSoundEffect('chime');
      }
    });

    // Secret tap on partner signature in footer
    let secretTapCount = 0;
    const partnerEl = document.getElementById('footerPartnerName');
    if (partnerEl) {
      partnerEl.style.cursor = 'pointer';
      partnerEl.title = 'Special Birthday Love';
      partnerEl.addEventListener('click', () => {
        secretTapCount++;
        if (secretTapCount >= 5) {
          secretTapCount = 0;
          document.body.classList.toggle('edit-mode');
          playSoundEffect('chime');
          triggerCelebrationConfetti();
        }
      });
    }
  }

  // Document Ready
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    renderAll();
  });

})();
