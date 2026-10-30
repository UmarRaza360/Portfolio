/**
 * CARD 3D TILT & SPECULAR HIGHLIGHT
 * Lightweight, zero-dependency, 60fps micro-interaction
 */

(function () {
  'use strict';

  function initTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length) return;

    cards.forEach((card) => {
      let bounds;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = mouseX / bounds.width;
        const yPct = mouseY / bounds.height;

        const maxTilt = parseFloat(card.getAttribute('data-tilt-max') || '8');
        const tiltX = (0.5 - yPct) * maxTilt;
        const tiltY = (xPct - 0.5) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
        
        // Dynamic specular highlight reflection
        card.style.setProperty('--mouse-x', `${(xPct * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${(yPct * 100).toFixed(1)}%`);
      }

      function onMouseLeave() {
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
})();
