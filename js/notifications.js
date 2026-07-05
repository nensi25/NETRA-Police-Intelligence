/* =============================================
   NETRA — NOTIFICATIONS
   ============================================= */
'use strict';

const Notifications = (() => {
  const NOTIFS = [
    { id: 1, type: 'critical', title: 'High Crime Alert', sub: 'Robbery reported at MG Road', time: '2 min ago', read: false },
    { id: 2, type: 'warning',  title: 'Suspicious Activity', sub: 'Unidentified vehicle — Hoskote', time: '15 min ago', read: false },
    { id: 3, type: 'critical', title: 'Repeat Offender Detected', sub: 'Whitefield area', time: '30 min ago', read: false },
    { id: 4, type: 'info',     title: 'Patrol Update', sub: '2 units deployed to East Zone', time: '45 min ago', read: true },
    { id: 5, type: 'info',     title: 'System Update', sub: 'Crime database synced successfully', time: '1 hr ago', read: true },
  ];

  let notifs = [...NOTIFS];
  let panelOpen = false;

  function unreadCount() {
    return notifs.filter(n => !n.read).length;
  }

  function renderPanel() {
    let panel = document.getElementById('notif-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'notif-panel';
      panel.style.cssText = `
        position:fixed; top:64px; right:20px; width:320px; z-index:150;
        background:var(--card-bg); border-radius:14px;
        border:1px solid var(--card-border);
        box-shadow:0 8px 30px rgba(0,0,0,0.15);
        overflow:hidden;
        animation:scaleIn 0.2s ease both;
        font-family:Inter,sans-serif;
      `;
      document.body.appendChild(panel);
    }

    const typeIcon = { critical: '🔴', warning: '🟡', info: '🔵' };

    panel.innerHTML = `
      <div style="padding:14px 16px;border-bottom:1px solid var(--card-border);display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:14px;font-weight:700;color:var(--text-primary);">Notifications</span>
        <button onclick="Notifications.markAllRead()" style="font-size:11px;color:var(--blue);font-weight:600;background:none;border:none;cursor:pointer;">Mark all read</button>
      </div>
      <div style="max-height:320px;overflow-y:auto;">
        ${notifs.map(n => `
          <div style="display:flex;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(0,0,0,0.04);background:${n.read ? 'transparent' : 'rgba(37,99,235,0.03)'};">
            <span style="font-size:16px;flex-shrink:0;">${typeIcon[n.type]}</span>
            <div style="flex:1;min-width:0;">
              <div style="font-size:12.5px;font-weight:${n.read ? '500' : '700'};color:var(--text-primary);">${n.title}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:1px;">${n.sub}</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">${n.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="padding:12px 16px;border-top:1px solid var(--card-border);text-align:center;">
        <button onclick="Router.navigate('alerts')" style="font-size:12px;color:var(--blue);font-weight:600;background:none;border:none;cursor:pointer;">View All Alerts →</button>
      </div>
    `;
  }

  function toggle() {
    let panel = document.getElementById('notif-panel');
    if (panelOpen && panel) {
      panel.remove();
      panelOpen = false;
    } else {
      renderPanel();
      panelOpen = true;
    }
  }

  function close() {
    const panel = document.getElementById('notif-panel');
    if (panel) panel.remove();
    panelOpen = false;
  }

  function markAllRead() {
    notifs.forEach(n => n.read = true);
    updateBadge();
    renderPanel();
  }

  function updateBadge() {
    const count = unreadCount();
    const dot   = document.querySelector('.notif-dot');
    if (dot) dot.style.display = count > 0 ? '' : 'none';
    // Update alerts nav badge
    const navBadge = document.querySelector('#nav-alerts .nav-badge');
    if (navBadge) navBadge.textContent = count > 0 ? count : '';
  }

  function init() {
    const btn = document.getElementById('notif-btn');
    if (btn) {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggle();
      });
    }
    document.addEventListener('click', e => {
      if (panelOpen && !e.target.closest('#notif-panel') && !e.target.closest('#notif-btn')) {
        close();
      }
    });
    updateBadge();
  }

  return { init, toggle, close, markAllRead, updateBadge };
})();

window.Notifications = Notifications;
