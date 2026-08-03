document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

mainNav.querySelectorAll('.nav-dropdown-caret').forEach((caret) => {
  caret.addEventListener('click', () => {
    const dropdown = caret.closest('.nav-dropdown');
    const isOpen = dropdown.classList.toggle('open');
    caret.setAttribute('aria-expanded', String(isOpen));
  });
});

const typewriters = document.querySelectorAll('[data-typewriter]');
if (typewriters.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const queue = [];
  let typing = false;

  const processQueue = () => {
    if (typing || !queue.length) return;
    typing = true;
    const el = queue.shift();
    const text = el.getAttribute('data-typewriter');
    el.textContent = '';
    el.classList.add('typewriter-active');
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(tick, 18);
      } else {
        el.classList.remove('typewriter-active');
        typing = false;
        processQueue();
      }
    };
    tick();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        queue.push(entry.target);
        observer.unobserve(entry.target);
      }
    });
    processQueue();
  }, { threshold: 0.4 });

  typewriters.forEach((el) => observer.observe(el));
}

document.querySelectorAll('.video-embed[data-video-id]').forEach((embed) => {
  embed.addEventListener('click', () => {
    const videoId = embed.getAttribute('data-video-id');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.setAttribute('title', 'YouTube video player');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    embed.innerHTML = '';
    embed.appendChild(iframe);
  }, { once: true });
});

const bgAudioToggle = document.getElementById('bgAudioToggle');
const bgAudioMount = document.getElementById('bgAudioMount');
const BG_AUDIO_START_SECONDS = 9;
if (bgAudioToggle && bgAudioMount) {
  let bgAudioIframe = null;
  const startBgAudio = () => {
    if (bgAudioIframe) return;
    const videoId = bgAudioMount.getAttribute('data-video-id');
    bgAudioIframe = document.createElement('iframe');
    bgAudioIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&start=${BG_AUDIO_START_SECONDS}`;
    bgAudioIframe.setAttribute('title', 'Background music');
    bgAudioIframe.setAttribute('allow', 'autoplay; encrypted-media');
    bgAudioMount.appendChild(bgAudioIframe);
    bgAudioToggle.classList.add('is-playing');
    bgAudioToggle.setAttribute('aria-pressed', 'true');
    bgAudioToggle.setAttribute('aria-label', 'Pause background music');
  };
  const stopBgAudio = () => {
    if (!bgAudioIframe) return;
    bgAudioIframe.remove();
    bgAudioIframe = null;
    bgAudioToggle.classList.remove('is-playing');
    bgAudioToggle.setAttribute('aria-pressed', 'false');
    bgAudioToggle.setAttribute('aria-label', 'Play background music');
  };
  bgAudioToggle.addEventListener('click', () => {
    if (bgAudioIframe) {
      stopBgAudio();
    } else {
      startBgAudio();
    }
  });

  // Browsers block unmuted autoplay before any user gesture. As a best-effort
  // "automatic" start, kick off audio on the visitor's first interaction
  // anywhere on the page, not just the toggle button itself.
  const startOnFirstInteraction = () => {
    startBgAudio();
    ['click', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
      window.removeEventListener(evt, startOnFirstInteraction);
    });
  };
  ['click', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
    window.addEventListener(evt, startOnFirstInteraction, { once: true, passive: true });
  });
}

const revealEls = document.querySelectorAll('.reveal-clarify');
if (revealEls.length) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    revealEls.forEach((el) => revealObserver.observe(el));
  }
}

const heroCrawl = document.querySelector('.hero-crawl');
const heroBrandVideoWrap = document.getElementById('heroBrandVideoWrap');
const heroBrandVideo = document.getElementById('heroBrandVideo');

if (heroBrandVideoWrap && heroBrandVideo) {
  const revealBrandVideo = () => {
    heroBrandVideoWrap.classList.add('is-visible');
    heroBrandVideo.currentTime = 0;
    heroBrandVideo.play().catch(() => {});
  };

  if (heroCrawl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroCrawl.addEventListener('animationend', (e) => {
      if (e.animationName === 'heroCrawlUp') revealBrandVideo();
    });
  } else {
    revealBrandVideo();
  }
}

const heroBgVideo = document.getElementById('heroBgVideo');
const heroSoundToggle = document.getElementById('heroSoundToggle');

if (heroBgVideo && heroSoundToggle) {
  heroSoundToggle.addEventListener('click', () => {
    heroBgVideo.muted = !heroBgVideo.muted;
    heroSoundToggle.setAttribute('aria-pressed', String(!heroBgVideo.muted));
    heroSoundToggle.setAttribute('aria-label', heroBgVideo.muted ? 'Turn on video sound' : 'Mute video sound');
  });
}

if (heroBgVideo && heroCrawl) {
  const restartHeroSequence = () => {
    heroBgVideo.currentTime = 0;
    heroBgVideo.play().catch(() => {});
    heroCrawl.style.animation = 'none';
    void heroCrawl.offsetWidth;
    heroCrawl.style.animation = '';
  };
  heroBgVideo.addEventListener('ended', restartHeroSequence);
}

const discoveryOpenBtn = document.getElementById('discoveryOpenBtn');
const discoveryOverlay = document.getElementById('discoveryOverlay');
const discoveryCloseBtn = document.getElementById('discoveryCloseBtn');
const discoveryForm = document.getElementById('discoveryForm');
const discoveryBody = document.getElementById('discoveryBody');
const discoveryBackBtn = document.getElementById('discoveryBackBtn');
const discoveryNextBtn = document.getElementById('discoveryNextBtn');
const discoveryProgressBar = document.getElementById('discoveryProgressBar');
const discoveryResults = document.getElementById('discoveryResults');
const discoveryResultsName = document.getElementById('discoveryResultsName');
const discoveryContinueBtn = document.getElementById('discoveryContinueBtn');

if (discoveryOpenBtn && discoveryOverlay && discoveryForm && discoveryBody) {
  const steps = Array.from(discoveryBody.querySelectorAll('.discovery-step'));
  const totalSteps = steps.length;
  const autoAdvanceSteps = new Set([0, 1, 3, 4, 5, 6, 7, 8]);
  let currentStep = 0;

  const updateOptionStates = (step) => {
    step.querySelectorAll('.discovery-option').forEach((option) => {
      const input = option.querySelector('input');
      option.classList.toggle('is-selected', !!input && input.checked);
    });
  };

  const updateProgress = () => {
    discoveryProgressBar.style.width = ((currentStep + 1) / totalSteps) * 100 + '%';
  };

  const showStep = (index) => {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    discoveryBackBtn.hidden = index === 0;
    discoveryNextBtn.textContent = index === totalSteps - 1 ? 'Complete Discovery' : 'Next';
    updateProgress();
  };

  const isStepValid = (index) => {
    const step = steps[index];
    const requiredInputs = step.querySelectorAll('[required]');
    for (const input of requiredInputs) {
      if (input.type === 'radio') {
        const group = step.querySelectorAll(`input[name="${input.name}"]`);
        if (![...group].some((r) => r.checked)) return false;
      } else if (input.type === 'checkbox') {
        if (!input.checked) return false;
      } else if (!input.value.trim()) {
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!isStepValid(currentStep)) {
      steps[currentStep].classList.add('discovery-step-shake');
      setTimeout(() => steps[currentStep].classList.remove('discovery-step-shake'), 400);
      return;
    }
    if (currentStep < totalSteps - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      discoveryForm.requestSubmit();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  };

  const openDiscovery = () => {
    discoveryOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    currentStep = 0;
    discoveryForm.hidden = false;
    discoveryResults.hidden = true;
    showStep(0);
  };

  const closeDiscovery = () => {
    discoveryOverlay.hidden = true;
    document.body.style.overflow = '';
  };

  discoveryOpenBtn.addEventListener('click', openDiscovery);
  discoveryCloseBtn.addEventListener('click', closeDiscovery);
  discoveryNextBtn.addEventListener('click', goNext);
  discoveryBackBtn.addEventListener('click', goBack);

  steps.forEach((step, index) => {
    step.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((input) => {
      input.addEventListener('change', () => updateOptionStates(step));
    });
    if (autoAdvanceSteps.has(index)) {
      step.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', () => {
          setTimeout(() => {
            if (currentStep === index) goNext();
          }, 350);
        });
      });
    }
  });

  const q3NoneOption = document.getElementById('discoveryQ3None');
  if (q3NoneOption) {
    const noneInput = q3NoneOption.querySelector('input');
    const q3Step = steps[2];
    const otherInputs = [...q3Step.querySelectorAll('input[type="checkbox"]')].filter((c) => c !== noneInput);
    noneInput.addEventListener('change', () => {
      if (noneInput.checked) {
        otherInputs.forEach((input) => {
          input.checked = false;
        });
        updateOptionStates(q3Step);
      }
    });
    otherInputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.checked) {
          noneInput.checked = false;
          updateOptionStates(q3Step);
        }
      });
    });
  }

  discoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isStepValid(currentStep)) return;
    const firstName = (discoveryForm.querySelector('[name="first_name"]').value || '').trim();
    const formData = new FormData(discoveryForm);
    const body = new URLSearchParams(formData).toString();
    fetch('https://formsubmit.co/ajax/julian@connect2nlp.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body,
    }).catch(() => {
      console.warn('Discovery form submission failed to send; showing results anyway.');
    }).finally(() => {
      if (discoveryResultsName) {
        discoveryResultsName.textContent = firstName ? `, ${firstName}` : '';
      }
      discoveryForm.hidden = true;
      discoveryResults.hidden = false;
    });
  });

  if (discoveryContinueBtn) {
    discoveryContinueBtn.addEventListener('click', closeDiscovery);
  }
}

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thanks, this form isn\'t connected yet. Email julian@connect2nlp.com directly for now.';
  });
}

const newsletterForm = document.getElementById('newsletterForm');
const newsletterNote = document.getElementById('newsletterNote');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(newsletterForm);
    const body = new URLSearchParams(formData).toString();
    fetch('https://formsubmit.co/ajax/julian@connect2nlp.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body,
    }).catch(() => {
      console.warn('Newsletter signup failed to send.');
    }).finally(() => {
      newsletterForm.hidden = true;
      if (newsletterNote) newsletterNote.hidden = false;
    });
  });
}
