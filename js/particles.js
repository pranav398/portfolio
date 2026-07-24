(function () {
    'use strict';

    const PARTICLE_COUNT_DESKTOP = 80;
    const PARTICLE_COUNT_MOBILE = 40;
    const MAX_DIST = 140;
    const SPEED_MAX = 0.5;
    const MOUSE_RADIUS = 140;
    const MOUSE_PUSH = 2.5;

    let canvas, ctx, W, H, particles, mouse, animId;
    let isDark = true;

    function getColors() {
        isDark = !document.documentElement.hasAttribute('data-theme');
        return {
            particle: isDark ? 'rgba(0,245,255,' : 'rgba(0,180,200,',
            line: isDark ? 'rgba(0,245,255,' : 'rgba(124,58,237,',
        };
    }

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x = Math.random() * W;
            this.y = initial ? Math.random() * H : -10;
            this.vx = (Math.random() - 0.5) * SPEED_MAX;
            this.vy = (Math.random() - 0.5) * SPEED_MAX;
            this.r = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.3;
        }

        update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.vx += (dx / dist) * force * MOUSE_PUSH * 0.05;
                this.vy += (dy / dist) * force * MOUSE_PUSH * 0.05;
            }

            this.vx *= 0.99;
            this.vy *= 0.99;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > SPEED_MAX) {
                this.vx = (this.vx / speed) * SPEED_MAX;
                this.vy = (this.vy / speed) * SPEED_MAX;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;

            this.x = Math.max(0, Math.min(W, this.x));
            this.y = Math.max(0, Math.min(H, this.y));
        }

        draw(colors) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = colors.particle + this.alpha + ')';
            ctx.fill();
        }
    }

    function drawConnections(colors) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    const opacity = (1 - dist / MAX_DIST) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = colors.line + opacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        const colors = getColors();

        particles.forEach(p => { p.update(); p.draw(colors); });
        drawConnections(colors);

        animId = requestAnimationFrame(animate);
    }

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function init() {
        canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        mouse = { x: -1000, y: -1000 };

        resize();
        window.addEventListener('resize', () => { resize(); }, { passive: true });

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }, { passive: true });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        canvas.addEventListener('touchmove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            mouse.x = t.clientX - rect.left;
            mouse.y = t.clientY - rect.top;
        }, { passive: true });

        const count = window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
        particles = Array.from({ length: count }, () => new Particle());

        if (animId) cancelAnimationFrame(animId);
        animate();
    }

    document.addEventListener('DOMContentLoaded', init);
})();