(function () {
    'use strict';
    if (window.matchMedia('(hover: none)').matches) return;

    document.addEventListener('DOMContentLoaded', () => {
        const outer = document.createElement('div');
        const inner = document.createElement('div');
        outer.className = 'cursor-outer';
        inner.className = 'cursor-inner';
        document.body.appendChild(outer);
        document.body.appendChild(inner);

        let mouseX = -200, mouseY = -200;
        let outerX = -200, outerY = -200;
        let raf;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            inner.style.left = mouseX + 'px';
            inner.style.top = mouseY + 'px';
        }, { passive: true });

        function animateOuter() {
            outerX += (mouseX - outerX) * 0.18;
            outerY += (mouseY - outerY) * 0.18;
            outer.style.left = outerX + 'px';
            outer.style.top = outerY + 'px';
            raf = requestAnimationFrame(animateOuter);
        }
        animateOuter();

        const hoverTargets = 'a, button, [role="button"], input, textarea, select, .project-card, .card, .qn-card, .filter-btn, .subject-chip, .nav-link, .nav-logo, .social-link';

        function onEnter() { outer.classList.add('hovered'); }
        function onLeave() { outer.classList.remove('hovered'); }

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) onEnter();
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) onLeave();
        });

        document.addEventListener('mousedown', () => { outer.classList.add('clicked'); });
        document.addEventListener('mouseup', () => { outer.classList.remove('clicked'); });

        const style = document.createElement('style');
        style.textContent = `
      body, a, button, input, textarea, select, [role="button"] {
        cursor: none !important;
      }
    `;
        document.head.appendChild(style);

        document.addEventListener('mouseleave', () => {
            outer.style.opacity = '0';
            inner.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            outer.style.opacity = '1';
            inner.style.opacity = '1';
        });
    });
})();