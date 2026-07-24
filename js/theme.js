(function () {
    'use strict';

    const STORAGE_KEY = 'portfolio-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    function getInitialTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === DARK || stored === LIGHT) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
    }

    function applyTheme(theme) {
        const html = document.documentElement;
        if (theme === LIGHT) {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }
        localStorage.setItem(STORAGE_KEY, theme);
        updateToggleUI(theme);
    }

    function updateToggleUI(theme) {
        const toggles = document.querySelectorAll('.theme-toggle');
        const thumbs = document.querySelectorAll('.toggle-thumb');

        toggles.forEach(btn => {
            btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
            btn.setAttribute('data-current', theme);
        });

        thumbs.forEach(thumb => {
            thumb.textContent = theme === DARK ? '🌙' : '☀️';
        });
    }

    function toggle() {
        const current = document.documentElement.hasAttribute('data-theme') ? LIGHT : DARK;
        applyTheme(current === DARK ? LIGHT : DARK);
    }

    function init() {
        applyTheme(getInitialTheme());

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.theme-toggle').forEach(btn => {
                btn.addEventListener('click', toggle);
            });
        });
    }

    init();
})();