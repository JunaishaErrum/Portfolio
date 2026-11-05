document.addEventListener('DOMContentLoaded', () => {
  const envJourney = document.querySelector('.environmental-journey');
  const envSky = document.querySelector('.env-sky');

  if (!envJourney || !envSky) return;

  const hobbiesSection = document.querySelector('.hobbies-section');
  const aboutSection = document.querySelector('.about-section');
  const expSection = document.querySelector('#experience');

  // Palette stops aligned with page scroll:
  // 0.00 - 0.25: Hero & Selected Work (Gentle morning sky / soft sage-sky)
  // 0.25 - 0.45: Publications & Hobbies (Warm linen / soft cream)
  // 0.45 - 0.65: About (Smooth transition into soft sage green #B5CDB8 / #C3DAC6)
  // 0.65 - 0.85: Skills & Experience (Fluid transition into muted dusty almond #DFC5AE)
  // 0.85 - 1.00: Footer (Gentle warm earth & soft grounding sage #C3DAC6)
  // Note: All background colors have high contrast against headings (#293F32) and secondary text (#435A4B).
  const colorStopsTop = [
    { p: 0.00, r: 174, g: 214, b: 232 }, // #aed6e8 (sky blue)
    { p: 0.22, r: 242, g: 232, b: 213 }, // #f2e8d5 (warm beige)
    { p: 0.38, r: 250, g: 246, b: 239 }, // #faf6ef (cream)
    { p: 0.52, r: 181, g: 205, b: 184 }, // #B5CDB8 (sage green)
    { p: 0.72, r: 223, g: 197, b: 174 }, // #DFC5AE (soft dusty almond)
    { p: 0.88, r: 232, g: 213, b: 196 }, // gentle lighter almond blend
    { p: 1.00, r: 195, g: 218, b: 198 }  // #C3DAC6 (soft sage green)
  ];

  const colorStopsBottom = [
    { p: 0.00, r: 226, g: 237, b: 216 }, // #e2edd8 (pale sage-sky)
    { p: 0.22, r: 250, g: 246, b: 239 }, // #faf6ef (cream)
    { p: 0.38, r: 246, g: 238, b: 224 }, // #f6eee0 (warm linen)
    { p: 0.52, r: 195, g: 218, b: 198 }, // #C3DAC6 (sage green)
    { p: 0.72, r: 223, g: 197, b: 174 }, // #DFC5AE (dusty almond)
    { p: 0.88, r: 214, g: 188, b: 167 }, // warm dusty almond depth
    { p: 1.00, r: 181, g: 205, b: 184 }  // #B5CDB8 (soft sage green)
  ];

  function interpolateColor(stops, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    for (let i = 0; i < stops.length - 1; i++) {
      const start = stops[i];
      const end = stops[i + 1];
      if (clamped >= start.p && clamped <= end.p) {
        const factor = (clamped - start.p) / (end.p - start.p);
        const r = Math.round(start.r + (end.r - start.r) * factor);
        const g = Math.round(start.g + (end.g - start.g) * factor);
        const b = Math.round(start.b + (end.b - start.b) * factor);
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    const last = stops[stops.length - 1];
    return `rgb(${last.r}, ${last.g}, ${last.b})`;
  }

  function updateScroll() {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollP = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    envJourney.style.setProperty('--scroll-p', scrollP);

    // Continuous smooth gradient interpolation across scroll
    const topColor = interpolateColor(colorStopsTop, scrollP);
    const bottomColor = interpolateColor(colorStopsBottom, scrollP);
    envSky.style.background = `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`;

    // Sun animation: enters smoothly from top and settles inside the semicircular opening of scWheel
    const scWheel = document.getElementById('scWheel');
    let sunP = 0;
    if (scWheel) {
      const rect = scWheel.getBoundingClientRect();
      // Target position: inside the semicircular arch above the hub (center of the opening)
      const targetY = rect.top + (rect.height * 0.18);

      // Settle progress: as the hobbies section approaches viewport center
      const viewCenter = window.innerHeight * 0.5;
      const approachDistance = window.innerHeight * 0.85;
      const distFromSettle = targetY - viewCenter;

      if (distFromSettle > 0) {
        // Sun is descending from above toward target position
        const descentProgress = Math.max(0, Math.min(1, 1 - (distFromSettle / approachDistance)));
        // Start above viewport (-150px) and smoothly descend into targetY
        const currentY = -150 + (targetY - (-150)) * Math.sin(descentProgress * (Math.PI / 2));
        envJourney.style.setProperty('--sun-y', `${Math.round(currentY)}px`);
        sunP = Math.min(1, descentProgress * 1.2);
      } else {
        // Target position reached or scrolled past: sun remains stationary inside the wheel's center
        envJourney.style.setProperty('--sun-y', `${Math.round(targetY)}px`);
        sunP = 1;
      }
    } else if (hobbiesSection) {
      const hobbiesTop = hobbiesSection.offsetTop;
      const hobbiesHeight = hobbiesSection.offsetHeight;
      const hobbiesMid = hobbiesTop + hobbiesHeight / 2;
      const scrollMid = scrollY + window.innerHeight / 2;
      const distFromMid = scrollMid - hobbiesMid;
      const viewRange = window.innerHeight * 0.9;
      if (Math.abs(distFromMid) < viewRange) {
        sunP = Math.cos((distFromMid / viewRange) * (Math.PI / 2));
        sunP = Math.max(0, Math.min(1, sunP));
      }
    }
    envJourney.style.setProperty('--sun-p', sunP);

    // Subtle ground animation
    let groundP = 0;
    if (aboutSection) {
      const aboutTop = aboutSection.offsetTop;
      const startGround = aboutTop - window.innerHeight;
      if (scrollY > startGround) {
        groundP = Math.min(Math.max((scrollY - startGround) / window.innerHeight, 0), 1);
      }
    }
    envJourney.style.setProperty('--ground-p', groundP);

    // Greenery progress
    let greeneryP = 0;
    if (expSection) {
      const expTop = expSection.offsetTop;
      const startGreen = expTop - window.innerHeight / 2;
      if (scrollY > startGreen && expSection.offsetHeight > 0) {
        greeneryP = Math.min(Math.max((scrollY - startGreen) / expSection.offsetHeight, 0), 1);
      }
    }
    envJourney.style.setProperty('--greenery-p', greeneryP);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateScroll);

  updateScroll();

  // ----------------------------------------------------
  // Interactive Anthill & Continuous Ant Skill Procession
  // ----------------------------------------------------
  const anthillContainer = document.getElementById('anthillInteractive');
  const rebuildWrap = document.getElementById('rebuildWrap');
  const rebuildBtn = document.getElementById('rebuildColonyBtn');
  const antProcessionContainer = document.getElementById('antProcessionContainer');
  const antMarchTrack = document.getElementById('antMarchTrack');

  // Existing skills to display on carried candy fragments
  const skillsList = [
    'UX Design',
    'UI Design',
    'Information Architecture',
    'User Research',
    'Usability Testing',
    'Interaction Design',
    'Design Systems',
    'Wireframing',
    'Prototyping',
    'Task Flows',
    'Competitive Analysis',
    'AI Product Thinking',
    'Illustration',
    'Figma',
    'Adobe XD',
    'Framer',
    'Generative AI Tools',
    'Miro',
    'Notion',
    'Sketchbook',
    'IBIS Paint X'
  ];

  const candyColors = ['candy-cream', 'candy-peach', 'candy-sage', 'candy-yellow'];

  // Helper: Generates a charming hand-drawn 2D cartoon ant carrying a skill above its head
  function createAntElement(skillName, index) {
    const candyClass = candyColors[index % candyColors.length];
    const isWink = index % 5 === 2;
    const isBigSmile = index % 3 === 0;

    const unit = document.createElement('div');
    unit.className = 'ant-unit';

    // Skill candy / sugar cube container held above head
    const candyDiv = document.createElement('div');
    candyDiv.className = `skill-carried-object ${candyClass}`;
    candyDiv.textContent = skillName;
    candyDiv.style.animationDelay = `${(index * 0.18) % 1.2}s`;

    // Ant Character SVG (96x96 viewBox="0 0 100 100")
    // Direction: facing right (ants walk from left to right)
    const svgWrap = document.createElement('div');
    svgWrap.className = 'ant-unit-svg-wrap';
    svgWrap.style.animationDelay = `${(index * 0.12) % 0.4}s`;

    svgWrap.innerHTML = `
      <svg class="ant-character-svg" viewBox="0 0 100 100" aria-hidden="true">
        <!-- Back Legs (Grounded walking cycle) -->
        <g class="ant-leg-back-walk">
          <path d="M 32 68 C 26 75, 18 82, 14 88" stroke="#3d2614" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <path d="M 14 88 L 11 89" stroke="#3d2614" stroke-width="3" stroke-linecap="round" />
        </g>
        <g class="ant-leg-mid-walk">
          <path d="M 44 67 C 40 76, 36 84, 34 89" stroke="#3d2614" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <path d="M 34 89 L 32 90" stroke="#3d2614" stroke-width="3" stroke-linecap="round" />
        </g>
        <g class="ant-leg-front-walk">
          <path d="M 54 66 C 54 75, 56 83, 60 88" stroke="#3d2614" stroke-width="3.2" stroke-linecap="round" fill="none" />
          <path d="M 60 88 L 63 89" stroke="#3d2614" stroke-width="3" stroke-linecap="round" />
        </g>

        <!-- Rounded Abdomen (Rear body segment) -->
        <ellipse cx="28" cy="62" rx="14" ry="11" fill="#a8582b" stroke="#3d2614" stroke-width="3.2" />
        <ellipse cx="26" cy="59" rx="11" ry="8" fill="#c9733b" />
        <path d="M 23 55 C 27 53, 31 53, 34 55" stroke="#f3a977" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />
        <!-- Abdomen texture stripes -->
        <path d="M 23 57 Q 27 65 24 71" stroke="#8b421a" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
        <path d="M 29 55 Q 33 63 30 71" stroke="#8b421a" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />

        <!-- Compact Thorax (Middle segment) -->
        <ellipse cx="44" cy="62" rx="7.5" ry="6.5" fill="#c9733b" stroke="#3d2614" stroke-width="3" />
        <ellipse cx="43" cy="61" rx="5.5" ry="4.5" fill="#e0864c" />

        <!-- Two Raised Front Arms / Legs Holding the Skill Container -->
        <path d="M 46 58 C 48 44, 46 32, 44 20" stroke="#3d2614" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M 52 56 C 56 42, 57 30, 56 18" stroke="#3d2614" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <!-- Cute little paws/tips supporting container -->
        <circle cx="44" cy="19" r="2.8" fill="#c9733b" stroke="#3d2614" stroke-width="2.2" />
        <circle cx="56" cy="17" r="2.8" fill="#c9733b" stroke="#3d2614" stroke-width="2.2" />

        <!-- Neck connection -->
        <path d="M 50 60 L 56 56" stroke="#3d2614" stroke-width="3.2" stroke-linecap="round" />

        <!-- Oversized Cute Rounded Head -->
        <ellipse cx="66" cy="50" rx="12.5" ry="11.5" fill="#c9733b" stroke="#3d2614" stroke-width="3.2" />
        <ellipse cx="65" cy="48" rx="10" ry="9" fill="#e0864c" />
        <path d="M 61 43 C 65 41, 70 42, 73 45" stroke="#f3a977" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.8" />

        <!-- Two Curved Playful Antennae -->
        <g class="ant-antenna">
          <path d="M 67 40 C 69 30, 74 24, 80 22" stroke="#3d2614" stroke-width="2.6" stroke-linecap="round" fill="none" />
          <circle cx="80" cy="22" r="2.6" fill="#8b421a" stroke="#3d2614" stroke-width="1.8" />
          <path d="M 64 39 C 63 29, 66 22, 71 18" stroke="#3d2614" stroke-width="2.4" stroke-linecap="round" fill="none" />
          <circle cx="71" cy="18" r="2.4" fill="#8b421a" stroke="#3d2614" stroke-width="1.8" />
        </g>

        <!-- Big Expressive Storybook Eyes with highlights -->
        ${isWink ? `
          <!-- Playful Wink Eye -->
          <path d="M 63 46 Q 67 50 71 46" stroke="#3d2614" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <!-- Right open eye -->
          <ellipse cx="73" cy="46" rx="3.5" ry="4.2" fill="#241407" />
          <circle cx="74.2" cy="44.5" r="1.3" fill="#ffffff" />
        ` : `
          <!-- Left Eye -->
          <ellipse cx="65" cy="46" rx="3.2" ry="4" fill="#241407" />
          <circle cx="66" cy="44.8" r="1.2" fill="#ffffff" />
          <!-- Right Eye -->
          <ellipse cx="72.5" cy="46" rx="3.5" ry="4.3" fill="#241407" />
          <circle cx="73.8" cy="44.6" r="1.4" fill="#ffffff" />
        `}

        <!-- Subtle Rosy Cheeks -->
        <ellipse cx="63" cy="53" rx="2.8" ry="1.8" fill="#e88975" opacity="0.65" />
        <ellipse cx="73" cy="53" rx="3" ry="1.9" fill="#e88975" opacity="0.65" />

        <!-- Sweet Smiling Mouth -->
        ${isBigSmile ? `
          <path d="M 68 53 Q 71 57 74 53" stroke="#3d2614" stroke-width="2.2" stroke-linecap="round" fill="#8b421a" />
        ` : `
          <path d="M 68 53 Q 71 56 73 53" stroke="#3d2614" stroke-width="2" stroke-linecap="round" fill="none" />
        `}
      </svg>
    `;

    unit.appendChild(candyDiv);
    unit.appendChild(svgWrap);
    return unit;
  }

  // Populate identical sets of ants into the track for a seamless marquee loop
  function populateAntTrack() {
    if (!antMarchTrack) return;
    antMarchTrack.innerHTML = '';

    // Create Group 1 (Track A) inside a dedicated flex wrapper
    const group1 = document.createElement('div');
    group1.className = 'ant-group-sequence';
    group1.style.display = 'inline-flex';
    group1.style.flexShrink = '0';
    skillsList.forEach((skill, idx) => {
      group1.appendChild(createAntElement(skill, idx));
    });
    antMarchTrack.appendChild(group1);

    // Create Group 2 (Track B) clone for seamless repetition
    const group2 = document.createElement('div');
    group2.className = 'ant-group-sequence';
    group2.style.display = 'inline-flex';
    group2.style.flexShrink = '0';
    group2.setAttribute('aria-hidden', 'true');
    skillsList.forEach((skill, idx) => {
      const clone = createAntElement(skill, idx);
      clone.setAttribute('aria-hidden', 'true');
      group2.appendChild(clone);
    });
    antMarchTrack.appendChild(group2);

    // Calculate exact width of one group and set the CSS variable for pixel-perfect loop
    function updateAntTrackMetrics() {
      if (!group1 || !antMarchTrack) return;
      const groupWidth = group1.getBoundingClientRect().width;
      if (groupWidth > 0) {
        antMarchTrack.style.setProperty('--single-group-width', `${groupWidth}px`);
        // Constant walking speed regardless of viewport/text width (~75px per second)
        const duration = groupWidth / 75;
        antMarchTrack.style.setProperty('--march-duration', `${duration}s`);
      }
    }

    requestAnimationFrame(updateAntTrackMetrics);
    window.addEventListener('resize', updateAntTrackMetrics);
  }

  // -----------------------------------------------------------------
  // State Management:
  // State A: Initial (Heading + Intact Anthill + CTA)
  // State B: Breaking animation (Quake + Cracks + Dust puff + short fade)
  // State C: Active colony (Ants full-width L to R + Rebuild Button below)
  // State D: Rebuilding (Ants fade out -> Anthill returns intact -> State A)
  // -----------------------------------------------------------------
  let isExplored = false;
  let isAnimating = false;

  function exploreColony() {
    if (isExplored || isAnimating || !anthillContainer) return;
    isAnimating = true;

    // --- State B: Breaking animation ---
    // 1. Anthill shakes gently, cracks draw across surface, dust puffs appear
    anthillContainer.classList.add('is-cracking');
    anthillContainer.setAttribute('aria-expanded', 'true');

    // 2. Short fade-out of the anthill illustration
    setTimeout(() => {
      anthillContainer.classList.add('is-fading-out');
    }, 650);

    // 3. --- State C: Active Colony ---
    // Remove the anthill completely from visible layout & show ants + rebuild button
    setTimeout(() => {
      anthillContainer.style.display = 'none';
      anthillContainer.classList.remove('is-cracking');
      anthillContainer.classList.remove('is-fading-out');

      populateAntTrack();
      if (antProcessionContainer) {
        antProcessionContainer.style.display = 'block';
        antProcessionContainer.style.opacity = '1';
      }
      if (rebuildWrap) {
        rebuildWrap.style.display = 'flex';
      }

      isExplored = true;
      isAnimating = false;
    }, 1000);
  }

  function rebuildColony() {
    if (!isExplored || isAnimating || !anthillContainer) return;
    isAnimating = true;

    // --- State D: Rebuilding ---
    // 1. Stop and fade out the ants and hide the rebuild button
    if (rebuildWrap) {
      rebuildWrap.style.display = 'none';
    }
    if (antProcessionContainer) {
      antProcessionContainer.style.opacity = '0';
      antProcessionContainer.style.transition = 'opacity 0.35s ease';
    }

    // 2. --- Return to State A: Initial ---
    setTimeout(() => {
      if (antProcessionContainer) {
        antProcessionContainer.style.display = 'none';
        antProcessionContainer.style.opacity = '';
        antProcessionContainer.style.transition = '';
        antMarchTrack.innerHTML = '';
      }

      // Restore the intact anthill illustration & centered CTA
      anthillContainer.style.display = 'flex';
      anthillContainer.style.opacity = '0';
      anthillContainer.classList.remove('is-cracking');
      anthillContainer.classList.remove('is-fading-out');
      anthillContainer.setAttribute('aria-expanded', 'false');

      // Smooth fade-in of intact anthill
      requestAnimationFrame(() => {
        anthillContainer.style.transition = 'opacity 0.35s ease';
        anthillContainer.style.opacity = '1';
        setTimeout(() => {
          anthillContainer.style.transition = '';
          anthillContainer.style.opacity = '';
          isExplored = false;
          isAnimating = false;
        }, 350);
      });
    }, 380);
  }

  if (anthillContainer) {
    anthillContainer.addEventListener('click', () => {
      if (!isExplored) exploreColony();
    });

    anthillContainer.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isExplored) {
        e.preventDefault();
        exploreColony();
      }
    });
  }

  if (rebuildBtn) {
    rebuildBtn.addEventListener('click', rebuildColony);
  }
});
