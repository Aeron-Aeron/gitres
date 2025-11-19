const root = document.body;
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.primary-nav');
const navLinks = document.querySelectorAll('.primary-nav a');
const scrollTopBtn = document.getElementById('scrollTop');
const sections = Array.from(document.querySelectorAll('main section[id]'));
const yearEl = document.getElementById('year');
const THEME_KEY = 'anjal.theme';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const setThemeIcon = (mode) => {
  if (!themeToggle) return;
  const icon = mode === 'dark' ? 'ph-sun' : 'ph-moon';
  themeToggle.innerHTML = `<i class="ph ${icon}"></i>`;
};

const applyTheme = (mode) => {
  root.setAttribute('data-theme', mode);
  setThemeIcon(mode);
};

const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    applyTheme(stored);
    return;
  }
  applyTheme(prefersDark.matches ? 'dark' : 'light');
};

const toggleTheme = () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
};

themeToggle?.addEventListener('click', toggleTheme);

prefersDark.addEventListener('change', (event) => {
  if (localStorage.getItem(THEME_KEY)) return;
  applyTheme(event.matches ? 'dark' : 'light');
});

const closeNav = () => {
  if (!nav) return;
  nav.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

const toggleNav = () => {
  if (!nav) return;
  const isOpen = nav.classList.toggle('is-open');
  navToggle?.setAttribute('aria-expanded', String(isOpen));
};

navToggle?.addEventListener('click', toggleNav);

navLinks.forEach((link) => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('click', (event) => {
  if (!nav || !navToggle) return;
  if (!nav.classList.contains('is-open')) return;
  const isClickInside = nav.contains(event.target) || navToggle.contains(event.target);
  if (!isClickInside) {
    closeNav();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

const revealItems = document.querySelectorAll('[data-animate]');
revealItems.forEach((item) => observer.observe(item));

const navMap = new Map(
  Array.from(navLinks).map((link) => [link.getAttribute('href')?.replace('#', '') ?? '', link])
);

const setActiveLink = () => {
  const scrollPos = window.scrollY + window.innerHeight * 0.25;
  let activeId = sections[0]?.id ?? '';

  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => link.classList.remove('active'));
  navMap.get(activeId)?.classList.add('active');
};

const toggleScrollTop = () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 320) {
    scrollTopBtn.classList.add('is-visible');
  } else {
    scrollTopBtn.classList.remove('is-visible');
  }
};

window.addEventListener('scroll', () => {
  setActiveLink();
  toggleScrollTop();
});

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

initTheme();
setActiveLink();
toggleScrollTop();
