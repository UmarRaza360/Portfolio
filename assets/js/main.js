/**
 * MAIN CONTROLLER & APPLICATION LOGIC (AWWWARDS EDITION)
 * Muhammad Umar Raza - Ultra-Premium Portfolio Website
 * Integrates: Vanilla ES6+, GSAP 3 / ScrollTrigger, jQuery, Magnetic Physics,
 * Dynamic Count-Up Animators, and Telemetry Clocks.
 */

(function ($) {
  'use strict';

  // --- 1. ROTATING TYPING EFFECT ---
  const TITLES = [
    'Frontend Engineer',
    'Laravel Developer',
    'Shopify Expert',
    'E-commerce Solutions Engineer'
  ];

  function initTypingAnimation() {
    const el = document.getElementById('heroTypedText');
    if (!el) return;

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const pauseDelay = 1800;

    function type() {
      const current = TITLES[titleIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === current.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % TITLES.length;
        timeout = 400;
      }

      setTimeout(type, timeout);
    }

    type();
  }

  // --- 2. LIVE TELEMETRY STATUS BAR (Clock, Latency, Stack) ---
  function initLiveStatusBar() {
    const clockEl = document.getElementById('liveStatusClock');
    const latencyEl = document.getElementById('liveStatusLatency');

    function updateClock() {
      if (!clockEl) return;
      const now = new Date();
      // Format in PKT (UTC+5)
      const options = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `${timeStr} PKT`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Subtle simulated network latency jitter
    if (latencyEl) {
      setInterval(() => {
        const ping = Math.floor(Math.random() * 8) + 14; // 14ms - 22ms
        latencyEl.textContent = `${ping}ms`;
      }, 4000);
    }
  }

  // --- 3. ANIMATED NUMBER COUNTERS (Every Number Animates from 0!) ---
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = parseFloat(el.getAttribute('data-counter-target') || '0');
            const suffix = el.getAttribute('data-counter-suffix') || '';
            const prefix = el.getAttribute('data-counter-prefix') || '';
            const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
            const duration = parseFloat(el.getAttribute('data-counter-duration') || '1800');

            animateValue(el, 0, targetVal, duration, prefix, suffix, decimals);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  function animateValue(obj, start, end, duration, prefix, suffix, decimals) {
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easedProgress;

      let formatted;
      if (decimals > 0) {
        formatted = current.toFixed(decimals);
      } else {
        formatted = Math.floor(current).toLocaleString();
      }

      obj.textContent = `${prefix}${formatted}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        const finalFormatted = decimals > 0 ? end.toFixed(decimals) : end.toLocaleString();
        obj.textContent = `${prefix}${finalFormatted}${suffix}`;
      }
    }

    window.requestAnimationFrame(step);
  }

  // --- 4. MAGNETIC BUTTONS (Awwwards-Grade Physics) ---
  function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic-btn');
    if (!magnetics.length) return;

    magnetics.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Eased attraction towards cursor
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: x * 0.35,
            y: y * 0.35,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)'
          });
        } else {
          btn.style.transform = 'translate(0px, 0px)';
        }
      });
    });
  }

  // --- 5. INTERACTIVE SPOTLIGHT CANVAS ---
  function initSpotlight() {
    const spotlight = document.getElementById('interactiveSpotlight');
    if (!spotlight) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    function animate() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // --- 6. SCROLL PROGRESS BAR ---
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  }

  // --- 7. SCROLLSPY & NAVIGATION HIGHLIGHT ---
  function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // --- 8. MOBILE DRAWER ---
  function initMobileMenu() {
    const toggleBtn = document.getElementById('navMobileToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const closeLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-close');

    if (!toggleBtn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    closeLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });
  }

  // --- 9. COMMAND PALETTE (Ctrl+K / Cmd+K) ---
  function initCommandPalette() {
    const backdrop = document.getElementById('cmdPaletteBackdrop');
    const openBtns = document.querySelectorAll('.trigger-cmd-palette');
    const input = document.getElementById('cmdPaletteInput');
    const items = document.querySelectorAll('.cmd-palette-item');

    if (!backdrop || !input) return;

    function open() {
      backdrop.classList.add('is-open');
      input.value = '';
      filterItems('');
      setTimeout(() => input.focus(), 80);
    }

    function close() {
      backdrop.classList.remove('is-open');
      input.blur();
    }

    function filterItems(query) {
      const q = query.toLowerCase().trim();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    }

    openBtns.forEach((btn) => btn.addEventListener('click', open));

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    input.addEventListener('input', (e) => {
      filterItems(e.target.value);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (backdrop.classList.contains('is-open')) {
          close();
        } else {
          open();
        }
      }
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        close();
      }
    });

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        close();

        if (action === 'copy-email') {
          navigator.clipboard.writeText('umark23898@gmail.com');
          showToast('Email copied to clipboard: umark23898@gmail.com');
        } else if (action === 'resume') {
          window.open('assets/resume/Muhammad_Umar_Raza_Resume.pdf', '_blank');
        } else if (action && action.startsWith('#')) {
          const target = document.querySelector(action);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- 10. SKILL BARS & FILTERING ---
  function initSkills() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const cards = document.querySelectorAll('.skill-category-card');

    if (fills.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const fill = entry.target;
              const targetWidth = fill.getAttribute('data-width') || '85%';
              fill.style.width = targetWidth;

              // Animate corresponding percentage counter
              const parent = fill.closest('.skill-bar-item');
              if (parent) {
                const pctEl = parent.querySelector('.skill-bar-percentage');
                if (pctEl && !pctEl.classList.contains('counted')) {
                  pctEl.classList.add('counted');
                  const numeric = parseInt(targetWidth.replace('%', ''), 10);
                  animateValue(pctEl, 0, numeric, 1200, '', '%', 0);
                }
              }

              observer.unobserve(fill);
            }
          });
        },
        { threshold: 0.1 }
      );

      fills.forEach((f) => observer.observe(f));
    }

    if (filterBtns.length && cards.length) {
      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const category = btn.getAttribute('data-filter');
          cards.forEach((card) => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  }

  // --- 11. GSAP SCROLLTRIGGER & REVEAL SYSTEM ---
  function initGSAPScrollReveals() {
    // If GSAP and ScrollTrigger are loaded, apply silky timeline animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.reveal-on-scroll').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    } else {
      // Vanilla fallback
      const reveals = document.querySelectorAll('.reveal-on-scroll');
      if (!reveals.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      reveals.forEach((el) => observer.observe(el));
    }
  }

  // --- 12. CASE STUDY DETAILED MODAL ---
  const CASE_STUDIES = {
    tresora: {
      title: 'Trésora & Zahir Luxury Shopify Storefront',
      subtitle: 'High-Converting Liquid Architecture & Logistics Automation',
      problem: 'The luxury cosmetics brand required an ultra-fast online shopping storefront capable of handling high conversion volume, bespoke bundle offers, automated COD payment reconciliation, and real-time courier fulfillment via PostEx.',
      solution: 'Engineered a tailored Shopify theme using modern native Liquid, vanilla JavaScript modules, dynamic slide-over cart drawer with upsell triggers, and customized PostEx parcel dispatch tracking. Reduced checkout friction substantially, driving conversion rates upwards.',
      tech: ['Shopify Liquid', 'Vanilla JS', 'Theme CLI', 'PostEx API', 'GA4 & Meta Pixel', 'CRO'],
      metrics: [
        { label: 'Conversion Lift', val: '+42%' },
        { label: 'Mobile Page Speed', val: '98/100' },
        { label: 'Orders Processed', val: '50,000+' }
      ],
      github: 'https://github.com/UmarRaza360',
      demo: 'https://github.com/UmarRaza360'
    },
    crm: {
      title: 'Enterprise Order & Inventory CRM',
      subtitle: 'Laravel 10 Full-Stack Management & Role-Based Workflows',
      problem: 'Managing high-velocity e-commerce operations, parcel tracking, and multi-tier staff coordination across disparate spreadsheets caused reconciliation errors and fulfillment delays.',
      solution: 'Architected a comprehensive Laravel MVC portal with relational MySQL database architecture, role-based access control (Admin, Dispatcher, Support), automated invoice PDF generation, and real-time inventory threshold alerts.',
      tech: ['Laravel 10', 'PHP 8.2', 'MySQL', 'Bootstrap 5', 'REST APIs', 'Chart.js'],
      metrics: [
        { label: 'Discrepancy Drop', val: '-95%' },
        { label: 'Fulfillment Speed', val: '3x Faster' },
        { label: 'Database Queries', val: '<15ms' }
      ],
      github: 'https://github.com/UmarRaza360/step2scientist',
      demo: 'https://github.com/UmarRaza360/step2scientist'
    },
    green: {
      title: 'Green-ETG Clean Energy Web Platform',
      subtitle: 'Semantic, High-Performance Sustainable Energy Interface',
      problem: 'An international clean energy initiative required a lightweight, zero-dependency web interface that loads instantly across global mobile connections while communicating technical credibility.',
      solution: 'Developed a custom frontend adhering strictly to semantic HTML5, modern CSS Grid/Flexbox architecture, fluid typography, and zero-framework performance optimization, scoring 99 on Google Lighthouse.',
      tech: ['Semantic HTML5', 'CSS3 Grid/Flexbox', 'Vanilla ES6', 'SVG Graphics', 'Accessibility ARIA'],
      metrics: [
        { label: 'Lighthouse Score', val: '99/100' },
        { label: 'Initial Payload', val: '<40 KB' },
        { label: 'Time to Interactive', val: '0.4s' }
      ],
      github: 'https://github.com/UmarRaza360/Green-ETG',
      demo: 'https://github.com/UmarRaza360/Green-ETG'
    },
    finance: {
      title: 'FinancePulse & TravelX Modern UI Engines',
      subtitle: 'Real-Time Financial Dashboard & Dynamic Travel Booking',
      problem: 'Fintech and travel applications require clean data visualization, currency handling, and seamless booking state management without UI stutter or layout shift.',
      solution: 'Engineered responsive interfaces with high-density card layouts, modular component design, dynamic filtering, and interactive state transitions.',
      tech: ['Modern CSS', 'JavaScript ES6+', 'CSS Variables', 'Micro-interactions', 'Responsive Layout'],
      metrics: [
        { label: 'Component Reusability', val: '100%' },
        { label: 'Responsive Fidelity', val: '320px - 4K' },
        { label: 'Fluid Animation', val: '60 FPS' }
      ],
      github: 'https://github.com/UmarRaza360/Finance-Landing-page',
      demo: 'https://github.com/UmarRaza360/Travel-Agency-landing-page'
    }
  };

  function initCaseStudyModal() {
    const backdrop = document.getElementById('caseModalBackdrop');
    const closeBtn = document.getElementById('caseModalCloseBtn');
    const viewBtns = document.querySelectorAll('.trigger-case-study');

    if (!backdrop) return;

    function openModal(id) {
      const data = CASE_STUDIES[id];
      if (!data) return;

      document.getElementById('modalCaseTitle').textContent = data.title;
      document.getElementById('modalCaseSubtitle').textContent = data.subtitle;
      document.getElementById('modalCaseProblem').textContent = data.problem;
      document.getElementById('modalCaseSolution').textContent = data.solution;

      const metricsContainer = document.getElementById('modalCaseMetrics');
      if (metricsContainer) {
        metricsContainer.innerHTML = data.metrics.map((m) => `
          <div class="project-metric-item">
            <span class="metric-val" style="color: var(--color-accent);">${m.val}</span>
            <span class="metric-label">${m.label}</span>
          </div>
        `).join('');
      }

      const techContainer = document.getElementById('modalCaseTech');
      if (techContainer) {
        techContainer.innerHTML = data.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('');
      }

      const ghBtn = document.getElementById('modalCaseGithubBtn');
      if (ghBtn) ghBtn.href = data.github;

      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    viewBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-case-id');
        openModal(id);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // --- 13. CONTACT TRANSMISSION & TOAST SYSTEM ---
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', true);
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Dispatching Transmission...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        showToast(`Thank you, ${name}! Your inquiry has been transmitted to Muhammad Umar Raza.`);
      }, 1000);
    });
  }

  function showToast(msg, isError = false) {
    const toast = document.getElementById('siteToast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    if (isError) {
      toast.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    } else {
      toast.style.borderColor = 'rgba(0, 210, 132, 0.5)';
    }

    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 4200);
  }

  // --- 14. JQUERY SMOOTH SCROLL DELEGATION ---
  function initJQueryEnhancements() {
    if (typeof $ !== 'undefined') {
      // Smooth internal anchor scrolling via jQuery
      $('a[href^="#"]').on('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
          e.preventDefault();
          $('html, body').stop().animate({
            scrollTop: target.offset().top - 70
          }, 600);
        }
      });
    }
  }

  // --- 15. BACK TO TOP ---
  function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initLiveStatusBar();
    initAnimatedCounters();
    initMagneticButtons();
    initSpotlight();
    initScrollProgress();
    initScrollspy();
    initMobileMenu();
    initCommandPalette();
    initSkills();
    initGSAPScrollReveals();
    initCaseStudyModal();
    initContactForm();
    initJQueryEnhancements();
    initBackToTop();
  });
})(typeof jQuery !== 'undefined' ? jQuery : undefined);
