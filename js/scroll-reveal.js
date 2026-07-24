(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        });

        revealEls.forEach(el => revealObserver.observe(el));
        const skillBars = document.querySelectorAll('.skill-bar');

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => skillObserver.observe(bar));
        const timeline = document.querySelector('.timeline');

        if (timeline) {
            const tlObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        timeline.classList.add('animated');
                        tlObserver.unobserve(timeline);
                    }
                });
            }, { threshold: 0.1 });

            tlObserver.observe(timeline);
        }

        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
            if (isNaN(target)) return;

            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);
                el.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }

        const counters = document.querySelectorAll('[data-counter]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));

        const tiltSelectors = `.card, .qn-card, .project-card, .profile-card, .interest-card, 
                           .interest-big-card, .at-card, .stat-banner-card, .course-card, 
                           .info-card, .contact-form-wrap, .fact-card, .skill-category, 
                           .current-card, .featured-project, [data-tilt]`;

        document.querySelectorAll(tiltSelectors).forEach(card => {
            const MAX_TILT = 14;

            card.style.transformStyle = 'preserve-3d';
            if (!card.style.perspective) card.style.perspective = '1000px';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);

                const rotX = -dy * MAX_TILT;
                const rotY = dx * MAX_TILT;

                card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                setTimeout(() => { card.style.transition = ''; }, 600);
            });
        });

        const heroVisual = document.querySelector('.hero-visual');
        const heroSection = document.querySelector('.hero');

        if (heroSection && heroVisual) {
            const avatarRing = heroVisual.querySelector('.hero-avatar-ring');
            const floatIcons = heroVisual.querySelectorAll('.float-icon');

            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);

                if (avatarRing) {
                    avatarRing.style.transform = `perspective(1000px) rotateX(${-dy * 15}deg) rotateY(${dx * 18}deg) translateZ(20px)`;
                    avatarRing.style.transition = 'transform 0.1s ease-out';
                }

                floatIcons.forEach((icon, i) => {
                    const depth = (i + 1) * 15;
                    icon.style.transform = `translate3d(${dx * depth}px, ${dy * depth}px, ${depth * 2}px) rotate(${dx * 10}deg)`;
                    icon.style.transition = 'transform 0.15s ease-out';
                });
            });

            heroSection.addEventListener('mouseleave', () => {
                if (avatarRing) {
                    avatarRing.style.transition = 'transform 0.6s ease';
                    avatarRing.style.transform = '';
                }
                floatIcons.forEach((icon) => {
                    icon.style.transition = 'transform 0.6s ease';
                    icon.style.transform = '';
                });
            });
        }

        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterBtns.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');

                    projectCards.forEach(card => {
                        const cat = card.getAttribute('data-category');
                        const show = filter === 'all' || cat === filter;
                        if (show) {
                            card.style.display = '';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = '';
                            }, 50);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.9)';
                            setTimeout(() => { card.style.display = 'none'; }, 350);
                        }
                    });

                    const noResults = document.querySelector('.no-results');
                    if (noResults) {
                        const anyVisible = [...projectCards].some(c => c.style.display !== 'none');
                        noResults.classList.toggle('visible', !anyVisible);
                    }
                });
            });
        }

        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = contactForm.querySelector('.form-submit');
                const icon = btn.querySelector('.submit-icon');

                btn.disabled = true;
                btn.style.opacity = '0.7';
                if (icon) icon.textContent = '⏳';

                setTimeout(() => {
                    const formEl = contactForm.querySelector('.form-inner');
                    const successEl = contactForm.querySelector('.form-success');
                    if (formEl) formEl.style.display = 'none';
                    if (successEl) successEl.classList.add('visible');
                }, 1500);
            });
        }

        document.querySelectorAll('.subject-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
            });
        });
    });
})();