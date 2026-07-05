/* =============================================
   NETRA — SETTINGS PAGE
   ============================================= */
'use strict';

const Settings = (() => {
  let initialized = false;

  function bindThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ThemeManager.applyTheme(btn.dataset.theme);
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Utils.toast(`Theme: ${btn.dataset.theme.charAt(0).toUpperCase()+btn.dataset.theme.slice(1)}`, 'success');
      });
    });
  }

  function bindAccentDots() {
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        ThemeManager.applyAccent(dot.dataset.accent);
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        Utils.toast(`Accent color changed`, 'success');
      });
    });
  }

  function bindFontSlider() {
    const slider = document.getElementById('font-size-slider');
    const label  = document.getElementById('font-size-label');
    if (!slider) return;
    const sizes = ['sm','md','lg'];
    const labels = ['Small','Medium','Large'];
    slider.value = sizes.indexOf(Utils.storage.get('font','md'));
    if (label) label.textContent = labels[parseInt(slider.value)];
    slider.addEventListener('input', () => {
      const idx = parseInt(slider.value);
      ThemeManager.applyFont(sizes[idx]);
      if (label) label.textContent = labels[idx];
    });
  }

  function bindCompactToggle() {
    const toggle = document.getElementById('compact-toggle');
    if (!toggle) return;
    toggle.checked = Utils.storage.get('compact', false);
    toggle.addEventListener('change', () => {
      ThemeManager.applyCompact(toggle.checked);
      Utils.toast('Compact mode ' + (toggle.checked ? 'enabled' : 'disabled'), 'info');
    });
  }

  function bindNotifToggles() {
    const toggleIds = ['notif-crime-toggle','notif-patrol-toggle','notif-alert-toggle','notif-report-toggle'];
    toggleIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.checked = Utils.storage.get(id, true);
      el.addEventListener('change', () => {
        Utils.storage.set(id, el.checked);
        Utils.toast('Notification preference saved', 'success');
      });
    });
  }

  function bindSidebarCollapse() {
    const toggle = document.getElementById('sidebar-collapse-toggle');
    if (!toggle) return;
    const saved = Utils.storage.get('sidebar-collapsed', false);
    toggle.checked = saved;
    if (saved) collapseApply(true);
    toggle.addEventListener('change', () => {
      Utils.storage.set('sidebar-collapsed', toggle.checked);
      collapseApply(toggle.checked);
    });
  }

  function collapseApply(collapsed) {
    const sidebar = document.getElementById('sidebar');
    const main    = document.querySelector('.main-container');
    if (!sidebar || !main) return;
    if (collapsed) {
      sidebar.style.width = '68px';
      sidebar.querySelectorAll('.nav-item span, .brand-info, .sidebar-emergency, .sidebar-user .user-info, .sidebar-user .user-chevron').forEach(el => { el.style.display = 'none'; });
      main.style.marginLeft = '68px';
    } else {
      sidebar.style.width = '';
      sidebar.querySelectorAll('.nav-item span, .brand-info, .sidebar-emergency, .sidebar-user .user-info, .sidebar-user .user-chevron').forEach(el => { el.style.display = ''; });
      main.style.marginLeft = '';
    }
  }

  function bindSaveButton() {
    document.getElementById('settings-save')?.addEventListener('click', () => {
      Utils.toast('Settings saved successfully!', 'success', 3000);
    });
  }

  function bindResetButton() {
    document.getElementById('settings-reset')?.addEventListener('click', () => {
      ['netra_theme','netra_accent','netra_font','netra_compact','netra_sidebar-collapsed'].forEach(k => localStorage.removeItem(k));
      ThemeManager.applyTheme('light');
      ThemeManager.applyAccent('blue');
      ThemeManager.applyFont('md');
      ThemeManager.applyCompact(false);
      ThemeManager.syncSettingsUI();
      // Reset toggles
      document.getElementById('compact-toggle') && (document.getElementById('compact-toggle').checked = false);
      document.getElementById('sidebar-collapse-toggle') && (document.getElementById('sidebar-collapse-toggle').checked = false);
      collapseApply(false);
      Utils.toast('Settings reset to defaults', 'info');
    });
  }

  function syncUI() {
    ThemeManager.syncSettingsUI();
    // Compact
    const ct = document.getElementById('compact-toggle');
    if (ct) ct.checked = Utils.storage.get('compact', false);
    // Dark toggle
    const dt = document.getElementById('dark-toggle');
    if (dt) {
      dt.checked = document.documentElement.getAttribute('data-theme') === 'dark';
      dt.addEventListener('change', () => {
        ThemeManager.applyTheme(dt.checked ? 'dark' : 'light');
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === (dt.checked?'dark':'light')));
      });
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;
    bindThemeButtons();
    bindAccentDots();
    bindFontSlider();
    bindCompactToggle();
    bindNotifToggles();
    bindSidebarCollapse();
    bindSaveButton();
    bindResetButton();
    syncUI();
  }

  return { init };
})();

window.Settings = Settings;
