/* =============================================
   NETRA — THEME MANAGER
   ============================================= */
'use strict';

const ThemeManager = (() => {
  let currentTheme  = 'light';
  let currentAccent = 'blue';
  let currentFont   = 'md';
  let compactMode   = false;

  const ACCENT_COLORS = {
    blue:   '#2563eb',
    cyan:   '#06b6d4',
    green:  '#16a34a',
    purple: '#8b5cf6',
    orange: '#ea580c',
    red:    '#dc2626',
  };

  function applyTheme(theme) {
    currentTheme = theme;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
    }
    Utils.storage.set('theme', theme);
    // Update toggle in settings
    syncSettingsUI();
  }

  function applyAccent(accent) {
    currentAccent = accent;
    document.documentElement.setAttribute('data-accent', accent);
    Utils.storage.set('accent', accent);
    syncSettingsUI();
  }

  function applyFont(size) {
    currentFont = size;
    document.documentElement.setAttribute('data-font', size);
    Utils.storage.set('font', size);
  }

  function applyCompact(enabled) {
    compactMode = enabled;
    document.documentElement.setAttribute('data-compact', enabled ? 'true' : 'false');
    Utils.storage.set('compact', enabled);
  }

  function syncSettingsUI() {
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
    // Accent dots
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.accent === currentAccent);
    });
    // Dark toggle
    const darkToggle = document.getElementById('dark-toggle');
    if (darkToggle) darkToggle.checked = currentTheme === 'dark';
  }

  function init() {
    // Load saved preferences
    const savedTheme   = Utils.storage.get('theme',   'light');
    const savedAccent  = Utils.storage.get('accent',  'blue');
    const savedFont    = Utils.storage.get('font',    'md');
    const savedCompact = Utils.storage.get('compact', false);

    applyTheme(savedTheme);
    applyAccent(savedAccent);
    applyFont(savedFont);
    applyCompact(savedCompact);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (currentTheme === 'system') applyTheme('system');
    });
  }

  return { init, applyTheme, applyAccent, applyFont, applyCompact, syncSettingsUI, ACCENT_COLORS, get currentTheme() { return currentTheme; } };
})();

window.ThemeManager = ThemeManager;
