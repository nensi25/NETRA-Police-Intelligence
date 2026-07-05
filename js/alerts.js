/* =============================================
   NETRA — ALERTS PAGE
   ============================================= */
'use strict';

const AlertsPage = (() => {
  let initialized = false;
  let filterType  = 'all';
  let showUnread  = false;

  let ALL_ALERTS = [
    { id:'ALT-001', type:'critical', title:'High Crime Alert',        sub:'Armed robbery in progress — MG Road',        time:'2 min ago',  read:false, area:'MG Road',        icon:'🔴' },
    { id:'ALT-002', type:'warning',  title:'Suspicious Activity',     sub:'Unidentified vehicle circling Hoskote area',  time:'15 min ago', read:false, area:'Hoskote',        icon:'🟡' },
    { id:'ALT-003', type:'critical', title:'Repeat Offender Detected',sub:'Known offender Rajan Shetty spotted Whitefield', time:'30 min ago', read:false, area:'Whitefield',  icon:'🟠' },
    { id:'ALT-004', type:'info',     title:'Unusual Movement',        sub:'Large gathering near Hebbal junction — monitor', time:'1 hr ago', read:false, area:'Hebbal',        icon:'🔵' },
    { id:'ALT-005', type:'warning',  title:'Missing Person Alert',    sub:'Child missing near KR Puram station',         time:'2 hrs ago',  read:true,  area:'KR Puram',       icon:'🟡' },
    { id:'ALT-006', type:'info',     title:'Patrol Check-in',         sub:'Alpha-2 unit checked in — Koramangala sector', time:'2 hrs ago', read:true,  area:'Koramangala',    icon:'🔵' },
    { id:'ALT-007', type:'critical', title:'Fire Emergency',          sub:'Vehicle fire near Indiranagar flyover',        time:'3 hrs ago',  read:true,  area:'Indiranagar',    icon:'🔴' },
    { id:'ALT-008', type:'warning',  title:'Noise Complaint Escalated',sub:'Large crowd gathering — Electronic City',    time:'4 hrs ago',  read:true,  area:'Electronic City',icon:'🟡' },
    { id:'ALT-009', type:'info',     title:'System Update',           sub:'Crime database synced — 1247 records updated', time:'5 hrs ago', read:true,  area:'System',         icon:'🔵' },
    { id:'ALT-010', type:'warning',  title:'Traffic Incident',        sub:'Major accident blocking ORR near Marathahalli', time:'6 hrs ago', read:true, area:'ORR',            icon:'🟡' },
  ];

  const typeLabel = { all:'All', critical:'Critical', warning:'Warning', info:'Info' };
  const typeBg    = { critical:'var(--red-bg)',    warning:'var(--orange-bg)', info:'rgba(37,99,235,0.1)' };
  const typeColor = { critical:'var(--red)',       warning:'#d97706',          info:'var(--blue)'          };

  function filtered() {
    return ALL_ALERTS.filter(a => {
      const matchType  = filterType === 'all' || a.type === filterType;
      const matchRead  = !showUnread || !a.read;
      return matchType && matchRead;
    });
  }

  function renderAlerts() {
    const list = document.getElementById('alerts-page-list');
    if (!list) return;
    const items = filtered();
    if (!items.length) {
      list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">No alerts found</div>';
      return;
    }
    list.innerHTML = items.map(a => `
      <div class="alert-item" style="${a.read?'':'background:rgba(37,99,235,0.03);'}animation:fadeInUp 0.3s ease both;" data-id="${a.id}">
        <div class="alert-severity-icon ${a.type}">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title" style="color:${a.read?'var(--text-secondary)':'var(--text-primary)'};">${a.title} ${!a.read?'<span style="width:6px;height:6px;border-radius:50%;background:var(--blue);display:inline-block;margin-left:4px;vertical-align:middle;"></span>':''}</div>
          <div class="alert-sub">${a.sub}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">📍 ${a.area}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <span class="alert-time">${a.time}</span>
          <div class="alert-actions">
            ${!a.read ? `<button class="alert-action-btn" onclick="AlertsPage.markRead('${a.id}')">Mark Read</button>` : ''}
            <button class="alert-action-btn danger" onclick="AlertsPage.deleteAlert('${a.id}')">✕</button>
          </div>
        </div>
      </div>`).join('');
    updateCounts();
  }

  function updateCounts() {
    const unread = ALL_ALERTS.filter(a => !a.read).length;
    const countEl = document.getElementById('alerts-unread-count');
    if (countEl) countEl.textContent = `${unread} unread`;
    const navBadge = document.querySelector('#nav-alerts .nav-badge');
    if (navBadge) navBadge.textContent = unread > 0 ? unread : '';
    const dot = document.querySelector('.notif-dot');
    if (dot) dot.style.display = unread > 0 ? '' : 'none';
  }

  function markRead(id) {
    const a = ALL_ALERTS.find(a => a.id === id);
    if (a) a.read = true;
    renderAlerts();
    Utils.toast('Marked as read', 'success');
  }

  function markAllRead() {
    ALL_ALERTS.forEach(a => a.read = true);
    renderAlerts();
    Utils.toast('All alerts marked as read', 'success');
  }

  function deleteAlert(id) {
    ALL_ALERTS = ALL_ALERTS.filter(a => a.id !== id);
    renderAlerts();
    Utils.toast('Alert dismissed', 'info');
  }

  function init() {
    if (initialized) return;
    initialized = true;

    // Filter type buttons
    document.querySelectorAll('.alert-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.alert-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterType = btn.dataset.type;
        renderAlerts();
      });
    });

    // Unread toggle
    const unreadToggle = document.getElementById('alerts-unread-toggle');
    if (unreadToggle) {
      unreadToggle.addEventListener('change', () => {
        showUnread = unreadToggle.checked;
        renderAlerts();
      });
    }

    // Mark all read
    document.getElementById('alerts-mark-all')?.addEventListener('click', markAllRead);

    renderAlerts();
  }

  return { init, markRead, deleteAlert, markAllRead };
})();

window.AlertsPage = AlertsPage;
