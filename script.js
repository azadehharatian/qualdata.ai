/* ============================================================
   qualdata.ai — JavaScript
   Light Theme, Interactive Life Cycle, Formspree, & Animations
   ============================================================ */

'use strict';

// ── Navbar scroll behavior ───────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  mobileMenu.classList.toggle('open', open);
  hamburgerBtn.setAttribute('aria-expanded', String(open));

  const spans = hamburgerBtn.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => toggleMenu(!menuOpen));
}

mobileMenu?.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    toggleMenu(false);
  }
});

// ── Smooth scroll for nav links ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Hero Canvas — Light Theme Network Graph ──────────────────
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createNodes(count) {
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.2 + 1.2,
        opacity: Math.random() * 0.45 + 0.15,
      });
    }
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDist = 130;

    // Draw lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${node.opacity})`;
      ctx.fill();
    }
  }

  function updateNodes() {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      node.x = Math.max(0, Math.min(canvas.width, node.x));
      node.y = Math.max(0, Math.min(canvas.height, node.y));
    }
  }

  function animateCanvas() {
    updateNodes();
    drawNetwork();
    animationId = requestAnimationFrame(animateCanvas);
  }

  function initCanvas() {
    resizeCanvas();
    const count = Math.min(55, Math.floor((canvas.width * canvas.height) / 16000));
    createNodes(count);
    animateCanvas();
  }

  requestAnimationFrame(initCanvas);

  window.addEventListener('resize', () => {
    resizeCanvas();
    const count = Math.min(55, Math.floor((canvas.width * canvas.height) / 16000));
    createNodes(count);
  }, { passive: true });
}

// ── Floating particles ───────────────────────────────────────
function createParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const colors = ['#2563EB', '#7C3AED', '#059669', '#3B82F6'];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(particle);
  }
}
createParticles();

// ── Stat counter animation ───────────────────────────────────
function animateCounter(el, target, isDecimal = false) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;

    el.textContent = isDecimal
      ? value.toFixed(1)
      : Math.floor(value).toLocaleString();

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.target.includes('.');
        animateCounter(el, target, isDecimal);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}
initCounters();

// ── Platform tabs ────────────────────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.platform-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetPanel = btn.getAttribute('aria-controls');

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(targetPanel)?.classList.add('active');
  });
});

// ── Interactive Data Life Cycle Framework ────────────────────
const stageData = {
  1: {
    num: '01',
    pill: 'Stage 1 of 6',
    clause: 'ISO/IEC 5259-4 Clause 6.1',
    clauseUrl: 'https://www.iso.org/publication/PUB200525.html',
    title: 'Data Sourcing & Ingestion Validation',
    desc: 'Verify ingestion sources, schema compatibility, cryptographic provenance hashes, and licensing rights before records enter pipeline staging.',
    checkpoints: [
      'Provenance & lineage verification against unauthorized manipulation',
      'Automated schema inference with strict type constraint validation',
      'Licensing entitlement and regulatory compliance clearance',
      'Corrupted headers and malformed payload filtration'
    ],
    consoleTitle: 'PIPELINE INSPECTOR // STAGE 1: INGESTION',
    metrics: [
      { label: 'Ingestion Volume', val: '1,480,200 rec', class: '' },
      { label: 'Schema Compliance', val: '99.8%', class: 'text-green' },
      { label: 'Malformed Filtered', val: '0.02%', class: 'text-blue' }
    ],
    feed: [
      { ts: '[10:14:01]', tag: 'info', tagText: 'INFO', text: 'TLS 1.3 ingestion stream connected to primary bucket' },
      { ts: '[10:14:02]', tag: 'ok', tagText: 'PASS', text: 'ISO 5259-4 Cl. 6.1 schema structure validated' },
      { ts: '[10:14:03]', tag: 'ok', tagText: 'PASS', text: 'SHA-256 integrity hash matched canonical record' },
      { ts: '[10:14:04]', tag: 'ok', tagText: 'PASS', text: 'Stage 1 passed all quality gate checks' }
    ],
    runResult: 'Ingestion scan verified: 1.48M records valid. No corrupt records detected.'
  },
  2: {
    num: '02',
    pill: 'Stage 2 of 6',
    clause: 'ISO/IEC 5259-4 Clause 6.2',
    clauseUrl: 'https://www.iso.org/publication/PUB200525.html',
    title: 'Data Profiling & Preprocessing',
    desc: 'Deep structural profiling for null distributions, unexpected categorical cardinatlity, multimodal outliers, and data type discrepancies.',
    checkpoints: [
      'Identification of missing values and null pattern clustering',
      'Outlier detection using robust Mahalanobis and IQR estimators',
      'Fuzzy duplicate record detection and deterministic resolution',
      'Normalization and categorical distribution sanity verification'
    ],
    consoleTitle: 'PIPELINE INSPECTOR // STAGE 2: PROFILING',
    metrics: [
      { label: 'Missing Values', val: '0.14%', class: 'text-green' },
      { label: 'Outliers Flagged', val: '184 rec', class: 'text-blue' },
      { label: 'Duplicate Rate', val: '0.00%', class: 'text-green' }
    ],
    feed: [
      { ts: '[10:15:10]', tag: 'info', tagText: 'INFO', text: 'Running statistical profiling across 142 features' },
      { ts: '[10:15:12]', tag: 'warn', tagText: 'WARN', text: '184 potential distribution anomalies isolated' },
      { ts: '[10:15:14]', tag: 'ok', tagText: 'PASS', text: 'ISO 5259-4 Cl. 6.2 preprocessing limits satisfied' },
      { ts: '[10:15:15]', tag: 'ok', tagText: 'READY', text: 'Clean dataset staged for annotation audit' }
    ],
    runResult: 'Profiling complete: 184 outliers isolated for human review. Zero critical null anomalies.'
  },
  3: {
    num: '03',
    pill: 'Stage 3 of 6',
    clause: 'ISO/IEC 5259-4 Clause 6.3',
    clauseUrl: 'https://www.iso.org/publication/PUB200525.html',
    title: 'Annotation & Labeling Consistency',
    desc: 'Audit human and synthetic annotations for inter-rater reliability, systematic labeling bias, semantic contradictions, and boundary ambiguity.',
    checkpoints: [
      'Cohen’s Kappa and Fleiss’ Kappa inter-annotator agreement tracking',
      'Contradictory label detection in identical feature embeddings',
      'Demographic and sensitive attribute labeling parity checks',
      'Active learning uncertainty ranking for disputed edge cases'
    ],
    consoleTitle: 'PIPELINE INSPECTOR // STAGE 3: LABELS',
    metrics: [
      { label: 'Inter-Rater Kappa', val: '0.942', class: 'text-green' },
      { label: 'Label Ambiguity', val: '1.2%', class: 'text-blue' },
      { label: 'Contradictions', val: '14 resolved', class: 'text-green' }
    ],
    feed: [
      { ts: '[10:16:01]', tag: 'info', tagText: 'INFO', text: 'Evaluating label consensus on 40,000 annotated items' },
      { ts: '[10:16:03]', tag: 'ok', tagText: 'PASS', text: 'Inter-annotator agreement exceeds ISO threshold (0.94 > 0.85)' },
      { ts: '[10:16:05]', tag: 'ok', tagText: 'RESOLV', text: '14 conflicting labels automatically reconciled' },
      { ts: '[10:16:06]', tag: 'ok', tagText: 'CLEARED', text: 'Annotation quality certified for ML use' }
    ],
    runResult: 'Annotation audit passed: Kappa score 0.942. Label integrity validated.'
  },
  4: {
    num: '04',
    pill: 'Stage 4 of 6',
    clause: 'ISO/IEC 5259-2 Measures',
    clauseUrl: 'https://www.iso.org/publication/PUB200525.html',
    title: 'Standardized Quality Measurement',
    desc: 'Formal calculation of ISO/IEC 5259 Part 2 quantitative metrics: Completeness, Accuracy, Consistency, Credibility, and Currentness.',
    checkpoints: [
      'Syntactic and semantic accuracy computation against gold standards',
      'Value and relation completeness across mandatory attributes',
      'Cross-record semantic consistency across temporal intervals',
      'Traceable credibility scoring based on source authority'
    ],
    consoleTitle: 'PIPELINE INSPECTOR // STAGE 4: ISO 5259-2',
    metrics: [
      { label: 'Completeness', val: '99.5%', class: 'text-green' },
      { label: 'Accuracy Index', val: '98.8%', class: 'text-green' },
      { label: 'Consistency', val: '99.1%', class: 'text-blue' }
    ],
    feed: [
      { ts: '[10:17:20]', tag: 'info', tagText: 'INFO', text: 'Calculating ISO/IEC 5259-2 quantitative quality dimensions' },
      { ts: '[10:17:22]', tag: 'ok', tagText: 'METRIC', text: 'Completeness score (§4.2): 99.52%' },
      { ts: '[10:17:23]', tag: 'ok', tagText: 'METRIC', text: 'Semantic Accuracy (§4.3): 98.84%' },
      { ts: '[10:17:25]', tag: 'ok', tagText: 'PASS', text: 'All 6 ISO Part 2 criteria meet Grade-A benchmarks' }
    ],
    runResult: 'ISO 5259-2 metrics calculated: Overall Quality Index 99.1% (Grade A).'
  },
  5: {
    num: '05',
    pill: 'Stage 5 of 6',
    clause: 'ISO/IEC 5259-6 Assessment',
    clauseUrl: 'https://www.iso.org/publication/PUB200525.html',
    title: 'Verification & Automated Error Repair',
    desc: 'Execute ISO 5259 Part 6 assessment methodologies, with AI-driven constraint repair to resolve noise and balance training datasets.',
    checkpoints: [
      'Automated candidate imputation using calibrated probabilistic models',
      'Integrity constraint violation repairs with deterministic audit logs',
      'Synthetic minority oversampling with fair boundary preservation',
      'Pre/post remediation delta scoring with roll-back guarantee'
    ],
    consoleTitle: 'PIPELINE INSPECTOR // STAGE 5: REPAIR',
    metrics: [
      { label: 'Errors Repaired', val: '1,247', class: 'text-green' },
      { label: 'Repair Precision', val: '99.2%', class: 'text-green' },
      { label: 'Manual Flags', val: '12 rec', class: 'text-blue' }
    ],
    feed: [
      { ts: '[10:18:40]', tag: 'info', tagText: 'INFO', text: 'Automated repair engine triggered for 1,259 anomalies' },
      { ts: '[10:18:42]', tag: 'ok', tagText: 'REPAIR', text: '1,247 corrections applied with confidence > 0.98' },
      { ts: '[10:18:43]', tag: 'info', tagText: 'AUDIT', text: 'Immutable modification delta generated and signed' },
      { ts: '[10:18:45]', tag: 'ok', tagText: 'SUCCESS', text: 'Remediation completed with zero dataset distortion' }
    ],
    runResult: 'Verification & repair complete: 1,247 fixes applied. Quality score raised from 91.2% to 99.1%.'
  },
  6: {
    num: '06',
    pill: 'Stage 6 of 6',
    clause: 'ISO/IEC 5259-5 Curated',
    clauseUrl: 'https://www.iso.org/publication/PUB200525.html',
    title: 'Model Training Ingestion & Certification',
    desc: 'Verify cross-split leakage isolation between train, validation, and test partitions, followed by ISO/IEC 5259 compliance certificate issuance.',
    checkpoints: [
      'Strict zero-leakage guarantee between training and test distributions',
      'Stratified class distribution balance across all model partitions',
      'Cryptographically signed ISO/IEC 5259 compliance audit report',
      'Direct export to PyTorch DataLoader, Hugging Face, or Parquet'
    ],
    consoleTitle: 'PIPELINE INSPECTOR // STAGE 6: EXPORT',
    metrics: [
      { label: 'Data Leakage', val: '0.00%', class: 'text-green' },
      { label: 'ISO Certificate', val: 'Issued #5259', class: 'text-green' },
      { label: 'Ready for Model', val: '100% OK', class: 'text-blue' }
    ],
    feed: [
      { ts: '[10:19:50]', tag: 'info', tagText: 'INFO', text: 'Verifying dataset partition isolation (train/val/test)' },
      { ts: '[10:19:52]', tag: 'ok', tagText: 'PASS', text: 'Zero data contamination detected between partitions' },
      { ts: '[10:19:54]', tag: 'ok', tagText: 'CERT', text: 'ISO/IEC 5259 Quality Certificate generated (SHA: 7e2f...b9a)' },
      { ts: '[10:19:55]', tag: 'ok', tagText: 'DEPLOY', text: 'Dataset published and ready for reliable AI training' }
    ],
    runResult: 'Stage 6 complete: Full pipeline certified. Ready for training reliable, compliant AI models!'
  }
};

let currentStage = 1;
let autoPlayInterval = null;
let isAutoPlaying = false;

function updateLifeCycleStage(stageNum) {
  currentStage = stageNum;
  const data = stageData[stageNum];
  if (!data) return;

  // Update progress bar
  const progressBar = document.getElementById('lifecycle-progress-fill');
  if (progressBar) {
    progressBar.style.width = `${(stageNum / 6) * 100}%`;
  }

  // Update stepper buttons
  document.querySelectorAll('.stage-btn').forEach(btn => {
    const s = parseInt(btn.dataset.stage, 10);
    btn.classList.toggle('active', s === stageNum);
    btn.setAttribute('aria-selected', String(s === stageNum));
  });

  // Update stage information
  const pill = document.getElementById('stage-display-pill');
  const isoLink = document.getElementById('stage-display-isolink');
  const title = document.getElementById('stage-display-title');
  const desc = document.getElementById('stage-display-desc');
  const checkpointsList = document.getElementById('stage-checkpoints-list');

  if (pill) pill.textContent = data.pill;
  if (isoLink) {
    isoLink.setAttribute('href', data.clauseUrl);
    isoLink.querySelector('span').textContent = data.clause;
  }
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;

  if (checkpointsList) {
    checkpointsList.innerHTML = data.checkpoints
      .map(cp => `<li><span class="cp-icon">✓</span> ${cp}</li>`)
      .join('');
  }

  // Update Console Box
  const consoleTitle = document.getElementById('console-stage-title');
  if (consoleTitle) consoleTitle.textContent = data.consoleTitle;

  const metricsRow = document.getElementById('console-metrics-row');
  if (metricsRow) {
    metricsRow.innerHTML = data.metrics
      .map(m => `
        <div class="c-metric">
          <span class="c-label">${m.label}</span>
          <strong class="c-value ${m.class}">${m.val}</strong>
        </div>
      `)
      .join('');
  }

  const feed = document.getElementById('console-feed');
  if (feed) {
    feed.innerHTML = data.feed
      .map(f => `
        <div class="feed-line">
          <span class="feed-ts">${f.ts}</span>
          <span class="feed-tag ${f.tag}">${f.tagText}</span>
          ${f.text}
        </div>
      `)
      .join('');
  }

  const latency = document.getElementById('console-latency');
  if (latency) {
    latency.textContent = `Stage ${stageNum} Verified · 0 errors`;
  }
}

// Stage button click handlers
document.querySelectorAll('.stage-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = parseInt(btn.dataset.stage, 10);
    updateLifeCycleStage(s);
    if (isAutoPlaying) toggleAutoPlay();
  });
});

// Stepper next / prev controls
document.getElementById('lifecycle-next-btn')?.addEventListener('click', () => {
  const next = currentStage >= 6 ? 1 : currentStage + 1;
  updateLifeCycleStage(next);
  if (isAutoPlaying) toggleAutoPlay();
});

document.getElementById('lifecycle-prev-btn')?.addEventListener('click', () => {
  const prev = currentStage <= 1 ? 6 : currentStage - 1;
  updateLifeCycleStage(prev);
  if (isAutoPlaying) toggleAutoPlay();
});

// Auto-play stepper
function toggleAutoPlay() {
  const btn = document.getElementById('lifecycle-autoplay-btn');
  const icon = document.getElementById('autoplay-icon');
  const text = document.getElementById('autoplay-text');

  if (isAutoPlaying) {
    clearInterval(autoPlayInterval);
    isAutoPlaying = false;
    if (icon) icon.textContent = '▶';
    if (text) text.textContent = 'Auto Play';
  } else {
    isAutoPlaying = true;
    if (icon) icon.textContent = '⏸';
    if (text) text.textContent = 'Pause';

    autoPlayInterval = setInterval(() => {
      const next = currentStage >= 6 ? 1 : currentStage + 1;
      updateLifeCycleStage(next);
    }, 4500);
  }
}

document.getElementById('lifecycle-autoplay-btn')?.addEventListener('click', toggleAutoPlay);

// Interactive Run Button in console
const consoleRunBtn = document.getElementById('console-run-btn');
if (consoleRunBtn) {
  consoleRunBtn.addEventListener('click', () => {
    const originalText = consoleRunBtn.innerHTML;
    consoleRunBtn.innerHTML = `<span>Scanning Stage ${currentStage}…</span>`;
    consoleRunBtn.style.opacity = '0.7';

    setTimeout(() => {
      const feed = document.getElementById('console-feed');
      const data = stageData[currentStage];
      if (feed && data) {
        const newLine = document.createElement('div');
        newLine.className = 'feed-line highlight';
        newLine.innerHTML = `<span class="feed-ts">[LIVE]</span> <span class="feed-tag ok">VERIFIED</span> ${data.runResult}`;
        feed.appendChild(newLine);
      }
      consoleRunBtn.innerHTML = `<span>✓ Stage ${currentStage} Verified!</span>`;
      consoleRunBtn.style.background = '#10B981';

      setTimeout(() => {
        consoleRunBtn.innerHTML = originalText;
        consoleRunBtn.style.background = '';
        consoleRunBtn.style.opacity = '1';
      }, 2500);
    }, 900);
  });
}

// ── Contact Form (Formspree AJAX Integration) ────────────────
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmitBtn = document.getElementById('contact-submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnText = contactSubmitBtn.innerHTML;

    // Loading state
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.innerHTML = '<span>Sending Message…</span>';
    contactStatus.className = 'form-status';
    contactStatus.style.display = 'none';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        contactStatus.textContent = '✓ Thank you! Your message has been sent to our research team. We will get back to you within 24 hours.';
        contactStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        const errorData = await response.json();
        const msg = errorData?.errors?.map(err => err.message).join(', ') || 'Something went wrong. Please try again.';
        contactStatus.textContent = `✕ ${msg}`;
        contactStatus.className = 'form-status error';
      }
    } catch (err) {
      contactStatus.textContent = '✕ Network error. Please try again or email us directly at contact@qualdata.ai.';
      contactStatus.className = 'form-status error';
    } finally {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.innerHTML = btnText;
    }
  });
}

// ── Demo Modal & Formspree Integration ───────────────────────
const demoModal = document.getElementById('demo-modal');
const demoForm = document.getElementById('demo-form');
const modalStatus = document.getElementById('modal-status');

function openModal() {
  if (!demoModal) return;
  demoModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.getElementById('demo-firstname')?.focus();
  }, 100);
}

function closeModal() {
  if (!demoModal) return;
  demoModal.style.display = 'none';
  document.body.style.overflow = '';
}

const demoBtns = [
  'nav-demo-btn',
  'hero-demo-btn',
  'detect-learn-btn',
  'verify-learn-btn',
  'monitor-learn-btn',
  'report-learn-btn',
  'cta-demo-btn',
  'mobile-demo-btn',
].map(id => document.getElementById(id)).filter(Boolean);

demoBtns.forEach(btn => btn.addEventListener('click', openModal));

document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

demoModal?.addEventListener('click', (e) => {
  if (e.target === demoModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && demoModal?.style.display !== 'none') {
    closeModal();
  }
});

// Demo Form submission via Formspree
if (demoForm) {
  demoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('demo-submit-btn');
    const originalText = submitBtn.textContent;

    const email = document.getElementById('demo-email').value;
    if (!email || !email.includes('@')) {
      document.getElementById('demo-email').focus();
      return;
    }

    submitBtn.textContent = 'Submitting Demo Request…';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(demoForm);
      const response = await fetch(demoForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        submitBtn.textContent = '✓ Demo Requested!';
        submitBtn.style.background = '#10B981';
        if (modalStatus) {
          modalStatus.textContent = 'Thank you! Our research team will arrange your live platform demonstration shortly.';
          modalStatus.className = 'form-status success';
        }
        setTimeout(() => {
          closeModal();
          demoForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          if (modalStatus) modalStatus.className = 'form-status';
        }, 2200);
      } else {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        if (modalStatus) {
          modalStatus.textContent = 'Could not submit. Please check your inputs or try again.';
          modalStatus.className = 'form-status error';
        }
      }
    } catch (err) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      if (modalStatus) {
        modalStatus.textContent = 'Network error. Please try again.';
        modalStatus.className = 'form-status error';
      }
    }
  });
}

// ── Hero explore button ──────────────────────────────────────
document.getElementById('hero-explore-btn')?.addEventListener('click', (e) => {
  const lifecycle = document.getElementById('lifecycle');
  if (lifecycle) {
    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
    window.scrollTo({ top: lifecycle.offsetTop - navHeight, behavior: 'smooth' });
  }
});

// ── Scroll animations ────────────────────────────────────────
function initScrollAnimations() {
  const animatable = document.querySelectorAll(
    '.feature-card, .iso-part, .how-step, .testimonial-card, .c-info-card, .lifecycle-display-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const idx = siblings.indexOf(entry.target);

        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, Math.max(0, idx) * 70);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatable.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
setTimeout(initScrollAnimations, 200);

// ── Active nav link on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--blue)';
          link.style.fontWeight = '700';
        } else {
          link.style.color = '';
          link.style.fontWeight = '';
        }
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── Quality bar animation ────────────────────────────────────
function initQualityBars() {
  const bars = document.querySelectorAll('.quality-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}
initQualityBars();

// ── Console branding ─────────────────────────────────────────
console.log(
  '%cqualdata.ai',
  'font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #2563EB, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 8px 0;'
);
console.log('%cBuilding more reliable AI through ISO/IEC 5259 data quality.', 'color: #475569; font-size: 14px;');
console.log('%cDirect inquiries: contact@qualdata.ai', 'color: #2563EB; font-size: 12px;');
