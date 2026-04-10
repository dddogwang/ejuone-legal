// Simple i18n system - shared across all pages
(function() {
    const STORAGE_KEY = 'ejuone_lang';
    const DEFAULT_LANG = 'en';
    const SUPPORTED = ['en', 'zh', 'ja'];

    const LANG_NAMES = {
        en: 'English',
        zh: '简体中文',
        ja: '日本語'
    };

    function getLang() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SUPPORTED.includes(saved)) return saved;
        const browser = (navigator.language || 'en').toLowerCase();
        if (browser.startsWith('zh')) return 'zh';
        if (browser.startsWith('ja')) return 'ja';
        return DEFAULT_LANG;
    }

    function setLang(lang) {
        if (!SUPPORTED.includes(lang)) return;
        localStorage.setItem(STORAGE_KEY, lang);
        applyLang(lang);
    }

    function applyLang(lang) {
        if (!window.I18N || !window.I18N[lang]) return;
        const dict = window.I18N[lang];
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        if (dict['__title__']) document.title = dict['__title__'];

        // Update language button label
        const label = document.getElementById('lang-current');
        if (label) label.textContent = LANG_NAMES[lang];

        // Update active state
        document.querySelectorAll('[data-lang-option]').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-lang-option') === lang);
        });
    }

    function buildSwitcher() {
        const container = document.getElementById('lang-switcher');
        if (!container) return;
        container.innerHTML = `
            <button class="lang-btn" id="lang-toggle" aria-label="Language">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span id="lang-current">English</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="lang-menu" id="lang-menu">
                ${SUPPORTED.map(l => `<button class="lang-option" data-lang-option="${l}">${LANG_NAMES[l]}</button>`).join('')}
            </div>
        `;
        const toggle = document.getElementById('lang-toggle');
        const menu = document.getElementById('lang-menu');
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });
        document.addEventListener('click', () => menu.classList.remove('open'));
        document.querySelectorAll('[data-lang-option]').forEach(btn => {
            btn.addEventListener('click', () => {
                setLang(btn.getAttribute('data-lang-option'));
                menu.classList.remove('open');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        buildSwitcher();
        applyLang(getLang());
    });
})();
