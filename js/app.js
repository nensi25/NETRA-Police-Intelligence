/* =============================================
   NETRA — APP BOOTSTRAP
   ============================================= */
'use strict';

const App = (() => {
  function updateDateTime() {
    const { dateMain, dayName, time } = Utils.getDateStrings();
    const dm = document.getElementById('header-date-main');
    const ds = document.getElementById('header-date-sub');
    if (dm) dm.textContent = dateMain;
    if (ds) ds.textContent = `${dayName}, ${time}`;
  }

  function updateGreeting() {
    const el = document.querySelector('.greeting-top');
    if (el) el.textContent = Utils.getGreeting() + ',';
  }

  function initMobileSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const toggle   = document.getElementById('sidebar-toggle');
    const overlay  = document.getElementById('sidebar-overlay');
    if (!sidebar || !toggle || !overlay) return;
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  function registerPages() {
    // Dashboard — init immediately (first page)
    Router.register('dashboard', () => Dashboard.init());

    // Live Map
    Router.register('livemap', () => MapModule.initFullMap());

    // Hotspots
    Router.register('hotspots', () => Hotspots.init());

    // Incidents
    Router.register('incidents', () => Incidents.init());

    // Analytics
    Router.register('analytics', () => Analytics.init());

    // Crime Intelligence
    Router.register('intelligence', () => Intelligence.init());

    // Offender Network
    Router.register('network', () => NetworkGraph.init());

    // Reports
    Router.register('reports', () => Reports.init());

    // Alerts
    Router.register('alerts', () => AlertsPage.init());

    // Settings
    Router.register('settings', () => Settings.init());
  }

  function init() {
    // Apply saved theme before anything renders
    ThemeManager.init();

    // Start router
    registerPages();
    Router.init();

    // Date/time
    updateDateTime();
    updateGreeting();
    setInterval(updateDateTime, 30000);

    // Mobile sidebar
    initMobileSidebar();

    // Notifications
    Notifications.init();

    // Kick off dashboard if it's the starting page
    if (Router.current() === 'dashboard') {
      Dashboard.init();
    }

    console.log('%c NETRA Police Intelligence Platform ', 'background:#1a56db;color:#fff;padding:4px 8px;border-radius:4px;font-weight:700;');
    console.log('%c SPA initialized successfully ', 'color:#16a34a;font-weight:600;');
  }

  return { init };
})();

// Boot on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
