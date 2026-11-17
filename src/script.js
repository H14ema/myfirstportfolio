/**
 * Hema Maheswari G J - Personal Portfolio Interactivity
 * Plain JavaScript (ES6+) with zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. Theme Management (Light / Dark mode with localStorage & System sync)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const storageKey = 'portfolio-theme';

  // Determine initial theme: saved preference or system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  // Apply theme to document element
  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // Set initial theme
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Toggle handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = rootElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(storageKey, newTheme);
    });
  }

  // Listen to system theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeMediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================================================
  // 2. Mobile Navigation Toggle
  // ==========================================================================
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    if (!mobileToggleBtn || !navMenu) return;
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
  }

  function closeMobileMenu() {
    if (!mobileToggleBtn || !navMenu) return;
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
  }

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside of the nav menu
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
        mobileToggleBtn.focus();
      }
    });
  }

  // ==========================================================================
  // 3. Stat Numbers Count-Up Animation (Runs once on page load)
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatNumber(num, formatType) {
    if (formatType === 'comma') {
      return num.toLocaleString('en-US');
    }
    return String(num);
  }

  function animateCounters() {
    statNumbers.forEach((element) => {
      const target = parseInt(element.getAttribute('data-target'), 10) || 0;
      const formatType = element.getAttribute('data-format') || '';
      const suffix = element.getAttribute('data-suffix') || '';

      if (prefersReducedMotion) {
        element.textContent = `${formatNumber(target, formatType)}${suffix}`;
        return;
      }

      const duration = 1600; // milliseconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic formula for organic settling
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * target);

        element.textContent = `${formatNumber(currentCount, formatType)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = `${formatNumber(target, formatType)}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger stat count-up once on page load
  animateCounters();

  // ==========================================================================
  // 4. Project Filtering
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.getAttribute('data-filter') || 'all';

      // Update active state on buttons
      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      // Filter project cards
      projectCards.forEach((card) => {
        const cardTags = card.getAttribute('data-tags') || '';
        const tagsArray = cardTags.toLowerCase().split(' ');

        if (selectedFilter === 'all' || tagsArray.includes(selectedFilter.toLowerCase())) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
});
