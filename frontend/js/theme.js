/**
 * SalesPulse - Dark Mode Toggle
 * Applies the saved theme to the document root and toggles it on click.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'salespulse-theme';
    var root = document.documentElement;

    function isDark() {
        return root.getAttribute('data-theme') === 'dark';
    }

    function updateButtons(theme) {
        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        });
    }

    function apply(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        try { localStorage.setItem(STORAGE_KEY, theme === 'dark' ? 'dark' : 'light'); } catch (e) { /* ignore */ }
        updateButtons(theme === 'dark' ? 'dark' : 'light');
    }

    // Public toggle handler used by the buttons
    window.toggleTheme = function () {
        apply(isDark() ? 'light' : 'dark');
    };

    // Wire up any toggle buttons on the page
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
        btn.addEventListener('click', window.toggleTheme);
    });

    // Initialize icons to match the already-applied theme
    updateButtons(isDark() ? 'dark' : 'light');
})();