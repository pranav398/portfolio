/* ============================================================
   TYPED JS — Typewriter Effect
   IIT Bombay CSE Portfolio
   ============================================================ */

(function () {
  'use strict';

  class Typed {
    constructor(el, options = {}) {
      this.el       = typeof el === 'string' ? document.querySelector(el) : el;
      if (!this.el) return;

      this.strings     = options.strings     || ['Hello World'];
      this.typeSpeed   = options.typeSpeed   || 60;   // ms per character
      this.deleteSpeed = options.deleteSpeed || 35;
      this.pauseAfter  = options.pauseAfter  || 1800; // ms to hold completed string
      this.pauseBefore = options.pauseBefore || 400;  // ms before typing next
      this.loop        = options.loop !== undefined ? options.loop : true;

      this.strIndex  = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.timer      = null;

      this.tick();
    }

    tick() {
      const str = this.strings[this.strIndex];

      if (this.isDeleting) {
        this.charIndex--;
        this.el.textContent = str.slice(0, this.charIndex);

        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.strIndex   = (this.strIndex + 1) % this.strings.length;
          this.timer = setTimeout(() => this.tick(), this.pauseBefore);
          return;
        }

        this.timer = setTimeout(() => this.tick(), this.deleteSpeed);
      } else {
        this.el.textContent = str.slice(0, this.charIndex + 1);
        this.charIndex++;

        if (this.charIndex === str.length) {
          if (!this.loop && this.strIndex === this.strings.length - 1) return;
          this.isDeleting = true;
          this.timer = setTimeout(() => this.tick(), this.pauseAfter);
          return;
        }

        this.timer = setTimeout(() => this.tick(), this.typeSpeed);
      }
    }

    destroy() {
      clearTimeout(this.timer);
    }
  }

  // Export to window for inline use
  window.Typed = Typed;

  // Auto-init for hero element
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('hero-typed');
    if (!el) return;

    new Typed(el, {
      strings: [
        'CSE Student @ IIT Bombay',
        'Aspiring Roboticist 🤖',
        'Drone Enthusiast 🚁',
        'Music Lover 🎵',
        'Volleyball Player',
        'Open Source Explorer',
        'Problem Solver',
        'Future Tech Builder',
      ],
      typeSpeed:   60,
      deleteSpeed: 30,
      pauseAfter:  2000,
      pauseBefore: 400,
      loop:        true,
    });
  });
})();
