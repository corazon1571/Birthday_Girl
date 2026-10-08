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
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...window.BIRTHDAY_DATA, ...parsed };
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
        // Romantic Petal Shape
        const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
        if (this.colorType > 0.4) {
          grad.addColorStop(0, '#fbcfe8');
          grad.addColorStop(1, '#f472b6');
        } else {
          grad.addColorStop(0, '#fda4af');
          grad.addColorStop(1, '#fb7185');
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
    const colors = ['#f472b6', '#fb7185', '#e11d48', '#facc15', '#c084fc', '#ffffff'];
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

  // --- COUNTDOWN & CELEBRATION TIMER ---
  function updateCountdown() {
    const targetDateStr = appData.birthdayDate;
    if (!targetDateStr) return;

    const now = new Date();
    // Parse target date as local start of day
    const [y, m, d] = targetDateStr.split('-').map(Number);
    let target = new Date(y, m - 1, d);

    // If birthday date is in the past this year, show anniversary or countdown to next
    const diff = target.getTime() - now.getTime();

    const daysEl = document.getElementById('daysVal');
    const hoursEl = document.getElementById('hoursVal');
    const minsEl = document.getElementById('minsVal');
    const secsEl = document.getElementById('secsVal');
    const labelEl = document.getElementById('countdownLabel');
    const badgeEl = document.getElementById('heroDateBadge');

    if (diff <= 0 && Math.abs(diff) < 24 * 60 * 60 * 1000) {
      // It's today!
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (labelEl) labelEl.textContent = '🎉 TODAY IS YOUR SPECIAL DAY! HAPPY BIRTHDAY! 🌸';
      if (badgeEl) badgeEl.textContent = 'Happy Birthday Today!';
      return;
    }

    if (diff < 0) {
      // Date has passed this year: count from it or celebrate
      const daysPassed = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
      if (labelEl) labelEl.textContent = `Celebrating You Every Day (${daysPassed} days since your birthday)`;
      if (badgeEl) badgeEl.textContent = `A Year Full of Bloom`;
      if (daysEl) daysEl.textContent = String(daysPassed).padStart(2, '0');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    if (badgeEl) badgeEl.textContent = `${days} Days Until Your Birthday`;
  }
  setInterval(updateCountdown, 1000);

  // --- RENDER HERO & METADATA ---
  function renderHero() {
    const heroName = document.getElementById('heroRecipientName');
    const heroSub = document.getElementById('heroSubtitle');
    const partnerFooter = document.getElementById('footerPartnerName');
    const vaseTag = document.getElementById('vaseTag');

    if (heroName) heroName.textContent = appData.recipientName || 'My Love';
    if (heroSub) heroSub.textContent = appData.subtitleMessage || '';
    if (partnerFooter) partnerFooter.textContent = appData.partnerName || 'Yours Always';
    if (vaseTag) vaseTag.textContent = `For ${appData.recipientName || 'You'} ♡`;

    updateCountdown();
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

      cardItem.innerHTML = `
        <div class="envelope-meta-header">
          <span class="envelope-number">NO. ${env.number || String(index + 1).padStart(2, '0')}</span>
          <span class="envelope-tag-pill">${env.tag || 'Love Letter'}</span>
        </div>

        <!-- 3D Physical Envelope -->
        <div class="envelope-physical" id="phys-${env.id}" role="button" tabindex="0" aria-label="Open ${env.title}">
          <div class="envelope-inside"></div>
          
          <!-- Peek Letter inside -->
          <div class="envelope-letter-peek">
            <span style="font-size: 0.8rem; font-weight: 600; color: #db2777;">${env.title}</span>
            <div class="peek-lines">
              <span class="peek-line"></span>
              <span class="peek-line"></span>
              <span class="peek-line"></span>
            </div>
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
          <button class="envelope-open-btn" data-envelope-id="${env.id}">
            <span>Unseal & Read Letter</span>
            <span>💌</span>
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
    if (dateStamp) dateStamp.textContent = `${appData.birthdayDate || 'OCTOBER 2026'}`;
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

    // Case 3: Polaroid memories
    if (env.content.memories) {
      const grid = document.createElement('div');
      grid.className = 'polaroids-grid';
      env.content.memories.forEach(m => {
        const pol = document.createElement('div');
        pol.className = 'polaroid-card';
        pol.innerHTML = `
          <div class="polaroid-photo" style="background: ${m.colorGradient || '#fce7f3'};">
            <span>${m.icon || '🌸'}</span>
          </div>
          <div class="polaroid-title">${m.title}</div>
          <div class="polaroid-caption">${m.caption}</div>
        `;
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
  }

  // Document Ready
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    renderAll();
  });

})();
