(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('nav-mobile');
        const overlay = document.getElementById('nav-overlay');
        const navLinks = document.querySelectorAll('.nav-link');

        function onScroll() {
            if (!navbar) return;
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage ||
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        function openMenu() {
            if (!hamburger || !mobileMenu) return;
            hamburger.classList.add('open');
            mobileMenu.classList.add('open');
            if (overlay) overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            if (!hamburger || !mobileMenu) return;
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            if (overlay) overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function toggleMenu() {
            if (hamburger && hamburger.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        if (hamburger) hamburger.addEventListener('click', toggleMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        if (mobileMenu) {
            mobileMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        }

        const main = document.querySelector('main') || document.querySelector('.page-enter-target');
        if (main) {
            main.style.opacity = '0';
            main.style.transform = 'translateY(16px)';
            requestAnimationFrame(() => {
                main.style.transition = 'opacity 0.55s cubic-bezier(0.19,1,0.22,1), transform 0.55s cubic-bezier(0.19,1,0.22,1)';
                main.style.opacity = '1';
                main.style.transform = 'translateY(0)';
            });
        }
    });
})();