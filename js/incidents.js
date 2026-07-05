/* =============================================
   NETRA — INCIDENTS PAGE
   ============================================= */
'use strict';

const Incidents = (() => {
  const ALL_INCIDENTS = [
    { id:'INC-001', type:'Robbery',     location:'MG Road',         officer:'Insp. Ravi Kumar', status:'open',    severity:'high',   date:'2026-07-05', time:'10:15', desc:'Armed robbery at ATM. Suspect fled on motorcycle. Witnesses present.' },
    { id:'INC-002', type:'Assault',     location:'Koramangala',     officer:'SI Priya Nair',    status:'open',    severity:'medium', date:'2026-07-05', time:'09:48', desc:'Physical altercation outside pub. Two persons injured. FIR registered.' },
    { id:'INC-003', type:'Vehicle Theft',location:'HSR Layout',     officer:'Const. Mahesh',    status:'pending', severity:'medium', date:'2026-07-05', time:'09:30', desc:'Honda City stolen from basement parking. CCTV footage being reviewed.' },
    { id:'INC-004', type:'Theft',       location:'Indiranagar',     officer:'Insp. Ravi Kumar', status:'closed',  severity:'low',    date:'2026-07-05', time:'09:10', desc:'Mobile phone snatched near food street. Accused identified.' },
    { id:'INC-005', type:'Cyber Fraud', location:'Marathahalli',    officer:'SI Deepa Shetty',  status:'open',    severity:'low',    date:'2026-07-05', time:'08:45', desc:'Online banking fraud. Victim lost ₹2.5 lakhs. Cyber cell investigating.' },
    { id:'INC-006', type:'Burglary',    location:'Jayanagar',       officer:'Insp. Mehta',      status:'pending', severity:'high',   date:'2026-07-04', time:'23:10', desc:'Break-in at residential flat. Jewellery and cash stolen.' },
    { id:'INC-007', type:'Robbery',     location:'Rajajinagar',     officer:'SI Priya Nair',    status:'open',    severity:'high',   date:'2026-07-04', time:'21:30', desc:'Chain snatching incident. Two suspects on bike. Sketch prepared.' },
    { id:'INC-008', type:'Assault',     location:'Whitefield',      officer:'Const. Mahesh',    status:'closed',  severity:'medium', date:'2026-07-04', time:'19:00', desc:'Road rage incident. Both parties counselled. Case closed.' },
    { id:'INC-009', type:'Theft',       location:'Electronic City', officer:'SI Deepa Shetty',  status:'closed',  severity:'low',    date:'2026-07-04', time:'14:20', desc:'Laptop stolen from office. Arrested suspect, property recovered.' },
    { id:'INC-010', type:'Cyber Fraud', location:'Hebbal',          officer:'Insp. Mehta',      status:'open',    severity:'medium', date:'2026-07-04', time:'11:00', desc:'Impersonation fraud on social media. Victim lost ₹50,000.' },
    { id:'INC-011', type:'Burglary',    location:'Yelahanka',       officer:'Insp. Ravi Kumar', status:'pending', severity:'high',   date:'2026-07-03', time:'02:15', desc:'Shop break-in. Merchandise worth ₹3L stolen.' },
    { id:'INC-012', type:'Robbery',     location:'Vijayanagar',     officer:'SI Priya Nair',    status:'open',    severity:'high',   date:'2026-07-03', time:'20:45', desc:'Knifepoint robbery near bus stop. Victim hospitalised.' },
  ];

  let filtered = [...ALL_INCIDENTS];
  let currentPage = 1;
  const PER_PAGE = 8;
  let sortCol = 'date';
  let sortDir = 'desc';
  let searchQ = '';
  let filterStatus = 'all';
  let filterSeverity = 'all';

  let initialized = false;

  const statusColors = { open:'orange', closed:'green', pending:'pending', critical:'critical' };
  const sevColors    = { high:'high', medium:'medium', low:'low' };

  function applyFilters() {
    filtered = ALL_INCIDENTS.filter(inc => {
      const q = searchQ.toLowerCase();
      const matchSearch = !q || inc.id.toLowerCase().includes(q) || inc.type.toLowerCase().includes(q) || inc.location.toLowerCase().includes(q) || inc.officer.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || inc.status === filterStatus;
      const matchSev    = filterSeverity === 'all' || inc.severity === filterSeverity;
      return matchSearch && matchStatus && matchSev;
    });
    // Sort
    filtered.sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'date') { av = a.date + a.time; bv = b.date + b.time; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    currentPage = 1;
    renderTable();
    renderPagination();
  }

  function renderTable() {
    const tbody = document.getElementById('incidents-tbody');
    if (!tbody) return;
    const start = (currentPage - 1) * PER_PAGE;
    const rows  = filtered.slice(start, start + PER_PAGE);
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text-muted);">No incidents found</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(inc => `
      <tr data-id="${inc.id}" style="cursor:pointer;" onclick="Incidents.openModal('${inc.id}')">
        <td><span style="font-size:11px;font-weight:700;color:var(--text-muted);">${inc.id}</span></td>
        <td><span style="font-weight:600;">${inc.type}</span></td>
        <td>📍 ${inc.location}</td>
        <td><span class="severity-badge ${inc.severity}">${inc.severity.charAt(0).toUpperCase()+inc.severity.slice(1)}</span></td>
        <td><span class="status-badge ${inc.status}">${inc.status.charAt(0).toUpperCase()+inc.status.slice(1)}</span></td>
        <td style="font-size:12px;color:var(--text-muted);">${inc.officer}</td>
        <td style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${inc.date} ${inc.time}</td>
      </tr>`).join('');
  }

  function renderPagination() {
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const info = document.getElementById('inc-page-info');
    const btns = document.getElementById('inc-page-btns');
    if (!info || !btns) return;

    const start = (currentPage - 1) * PER_PAGE + 1;
    const end   = Math.min(currentPage * PER_PAGE, filtered.length);
    info.textContent = `Showing ${filtered.length ? start : 0}–${end} of ${filtered.length} incidents`;

    let pages = [];
    pages.push(`<button class="page-btn ${currentPage===1?'':''}${currentPage>1?'':'disabled'}" onclick="Incidents.goPage(${currentPage-1})">‹</button>`);
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
        pages.push(`<button class="page-btn ${p===currentPage?'active':''}" onclick="Incidents.goPage(${p})">${p}</button>`);
      } else if (Math.abs(p - currentPage) === 2) {
        pages.push(`<span style="padding:4px 2px;color:var(--text-muted);">…</span>`);
      }
    }
    pages.push(`<button class="page-btn" onclick="Incidents.goPage(${currentPage+1})">›</button>`);
    btns.innerHTML = pages.join('');
  }

  function goPage(p) {
    const total = Math.ceil(filtered.length / PER_PAGE);
    if (p < 1 || p > total) return;
    currentPage = p;
    renderTable();
    renderPagination();
  }

  function openModal(id) {
    const inc = ALL_INCIDENTS.find(i => i.id === id);
    if (!inc) return;
    const overlay = document.getElementById('incident-modal');
    if (!overlay) return;
    document.getElementById('modal-inc-id').textContent = inc.id;
    const body = document.getElementById('modal-inc-body');
    body.innerHTML = `
      <div class="detail-row"><span class="detail-label">Incident ID</span><span class="detail-value"><b>${inc.id}</b></span></div>
      <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${inc.type}</span></div>
      <div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${inc.location}</span></div>
      <div class="detail-row"><span class="detail-label">Date & Time</span><span class="detail-value">${inc.date} at ${inc.time}</span></div>
      <div class="detail-row"><span class="detail-label">Severity</span><span class="detail-value"><span class="severity-badge ${inc.severity}">${inc.severity}</span></span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge ${inc.status}">${inc.status}</span></span></div>
      <div class="detail-row"><span class="detail-label">Officer Assigned</span><span class="detail-value">${inc.officer}</span></div>
      <div class="detail-row"><span class="detail-label">Description</span><span class="detail-value">${inc.desc}</span></div>
    `;
    overlay.classList.add('open');
  }

  function closeModal() {
    document.getElementById('incident-modal')?.classList.remove('open');
  }

  function sortBy(col) {
    if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortCol = col; sortDir = 'asc'; }
    applyFilters();
    // Update header arrow
    document.querySelectorAll('.inc-th').forEach(th => {
      const arrow = th.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = '';
    });
    const active = document.querySelector(`.inc-th[data-col="${col}"] .sort-arrow`);
    if (active) active.textContent = sortDir === 'asc' ? ' ↑' : ' ↓';
  }

  function init() {
    if (initialized) return;
    initialized = true;

    // Search
    const searchEl = document.getElementById('inc-search');
    if (searchEl) {
      searchEl.addEventListener('input', Utils.debounce(() => {
        searchQ = searchEl.value.trim();
        applyFilters();
      }, 250));
    }

    // Status filter
    const statusEl = document.getElementById('inc-status-filter');
    if (statusEl) statusEl.addEventListener('change', () => { filterStatus = statusEl.value; applyFilters(); });

    // Severity filter
    const sevEl = document.getElementById('inc-sev-filter');
    if (sevEl) sevEl.addEventListener('change', () => { filterSeverity = sevEl.value; applyFilters(); });

    // Sort headers
    document.querySelectorAll('.inc-th').forEach(th => {
      th.addEventListener('click', () => sortBy(th.dataset.col));
    });

    // Modal close
    document.getElementById('incident-modal')?.addEventListener('click', e => {
      if (e.target.id === 'incident-modal') closeModal();
    });
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

    applyFilters();
  }

  return { init, goPage, openModal, closeModal, sortBy };
})();

window.Incidents = Incidents;
