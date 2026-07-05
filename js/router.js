/* =============================================
   NETRA — ROUTER (SPA Page Navigation)
   ============================================= */
'use strict';

const Router = (() => {
  let currentPage = 'dashboard';
  const handlers  = {};

  /** Register an onEnter callback for a page */
  function register(pageId, callback) {
    handlers[pageId] = callback;
  }

  /** Navigate to a page */
  function navigate(pageId) {
    if (pageId === currentPage) return;

    // Hide old page
    const oldPage = document.getElementById('page-' + currentPage);
    if (oldPage) oldPage.classList.remove('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.page === pageId);
    });

    // Show new page
    const newPage = document.getElementById('page-' + pageId);
    if (newPage) {
      newPage.classList.add('active');
      // Reset scroll
      const main = document.querySelector('.content-area');
      if (main) main.scrollTop = 0;
    }

    currentPage = pageId;

    // Fire onEnter handler if registered
    if (handlers[pageId]) {
      try { handlers[pageId](); } catch(e) { console.warn('Router handler error:', e); }
    }

    // Update URL hash (no reload)
    history.replaceState(null, '', '#' + pageId);

    // Update page heading / breadcrumb if present
    updateBreadcrumb(pageId);
  }

  /** Update header page title */
  function updateBreadcrumb(pageId) {
    const names = {
      dashboard:    'Dashboard',
      livemap:      'Live Crime Map',
      hotspots:     'Hotspots',
      incidents:    'Incidents',
      analytics:    'Analytics',
      intelligence: 'Crime Intelligence',
      network:      'Offender Network',
      reports:      'Reports',
      alerts:       'Alerts',
      settings:     'Settings',
    };
    // Optional: update document title
    document.title = `${names[pageId] || 'NETRA'} — NETRA Police Intelligence`;
  }

  /** Initialize router from hash or default */
  function init() {
    const hash = window.location.hash.replace('#', '');
    const valid = ['dashboard','livemap','hotspots','incidents','analytics','intelligence','network','reports','alerts','settings'];
    const start = valid.includes(hash) ? hash : 'dashboard';

    // Bind nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        navigate(item.dataset.page);
        // Close mobile sidebar
        if (window.innerWidth <= 1024) {
          document.getElementById('sidebar')?.classList.remove('open');
          document.getElementById('sidebar-overlay')?.classList.remove('show');
        }
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const h = window.location.hash.replace('#', '');
      if (valid.includes(h) && h !== currentPage) navigate(h);
    });

    // Set initial page active state without animation
    const initPage = document.getElementById('page-' + start);
    if (initPage) initPage.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.page === start);
    });
    currentPage = start;
    updateBreadcrumb(start);

    if (handlers[start]) {
      try { handlers[start](); } catch(e) {}
    }
  }

  function current() { return currentPage; }

  return { init, navigate, register, current };
})();

window.Router = Router;
