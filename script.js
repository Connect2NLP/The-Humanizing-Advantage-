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

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thanks, this form isn\'t connected yet. Email julian@connect2nlp.com directly for now.';
  });
}
