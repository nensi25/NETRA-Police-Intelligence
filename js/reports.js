/* =============================================
   NETRA — REPORTS PAGE
   ============================================= */
'use strict';

const Reports = (() => {
  let initialized = false;

  const REPORTS = [
    { id:'RPT-001', icon:'📊', bg:'rgba(37,99,235,0.1)',   title:'Monthly Crime Report',     desc:'Comprehensive monthly breakdown of all crime types, trends and comparisons.', tags:['Monthly','All Crimes','PDF','Excel'], date:'Jun 2026', status:'ready' },
    { id:'RPT-002', icon:'🗺️', bg:'rgba(239,68,68,0.1)',   title:'Hotspot Analysis Report',  desc:'Detailed hotspot map analysis with risk scores, area comparisons and patrol recommendations.', tags:['Hotspots','Maps','PDF'], date:'Jul 2026', status:'generating' },
    { id:'RPT-003', icon:'👤', bg:'rgba(139,92,246,0.1)',  title:'Offender Profile Report',  desc:'Individual and group offender profiles with network connections and criminal history.', tags:['Offenders','Intelligence'], date:'Jun 2026', status:'ready' },
    { id:'RPT-004', icon:'📈', bg:'rgba(22,163,74,0.1)',   title:'Patrol Efficiency Report', desc:'Patrol unit performance metrics, response times, coverage areas and deployment analysis.', tags:['Patrol','Operations','PDF'], date:'Jun 2026', status:'ready' },
    { id:'RPT-005', icon:'🔮', bg:'rgba(6,182,212,0.1)',   title:'Predictive Crime Report',  desc:'AI-generated crime forecast for next 30 days with confidence intervals and recommendations.', tags:['AI','Forecast','PDF'], date:'Jul 2026', status:'ready' },
    { id:'RPT-006', icon:'⚖️', bg:'rgba(245,158,11,0.1)',  title:'Incident Summary Report',  desc:'Daily/weekly incident log with officer assignments, case status and resolution rates.', tags:['Incidents','Weekly'], date:'Jul 05, 2026', status:'ready' },
  ];

  const RECENT = [
    { id:'RPT-001', name:'Monthly Crime Report — June', date:'Jul 01', size:'2.4 MB', type:'PDF'  },
    { id:'RPT-006', name:'Incident Summary — Week 27',  date:'Jul 04', size:'1.1 MB', type:'Excel' },
    { id:'RPT-003', name:'Offender Profile Report',     date:'Jun 28', size:'3.6 MB', type:'PDF'  },
    { id:'RPT-004', name:'Patrol Efficiency Q2',        date:'Jun 25', size:'1.8 MB', type:'Excel' },
  ];

  function renderReportCards() {
    const grid = document.getElementById('reports-grid');
    if (!grid) return;
    grid.innerHTML = REPORTS.map(r => `
      <div class="report-card" onclick="Reports.generate('${r.id}')">
        <div class="report-icon" style="background:${r.bg};">${r.icon}</div>
        <div>
          <div class="report-title">${r.title}</div>
          <div class="report-desc">${r.desc}</div>
        </div>
        <div class="report-meta">
          ${r.tags.map(t => `<span class="report-tag">${t}</span>`).join('')}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;">
          <span style="font-size:11px;color:var(--text-muted);">${r.date}</span>
          <span class="status-badge ${r.status==='ready'?'closed':'pending'}">${r.status==='ready'?'Ready':'Generating'}</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn-primary" style="flex:1;padding:8px;" onclick="event.stopPropagation();Reports.download('${r.id}','pdf')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF
          </button>
          <button class="btn-secondary" style="flex:1;padding:8px;" onclick="event.stopPropagation();Reports.download('${r.id}','excel')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Excel
          </button>
        </div>
      </div>`).join('');
  }

  function renderRecentReports() {
    const list = document.getElementById('recent-reports-list');
    if (!list) return;
    list.innerHTML = RECENT.map(r => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid rgba(0,0,0,0.04);">
        <div style="width:36px;height:36px;border-radius:8px;background:${r.type==='PDF'?'var(--red-bg)':'var(--green-bg)'};display:flex;align-items:center;justify-content:center;font-size:16px;">
          ${r.type==='PDF'?'📄':'📊'}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${r.name}</div>
          <div style="font-size:11px;color:var(--text-muted);">${r.date} · ${r.size} · ${r.type}</div>
        </div>
        <button class="btn-secondary" style="padding:6px 14px;font-size:11px;" onclick="Reports.download('${r.id}','${r.type.toLowerCase()}')">
          Download
        </button>
      </div>`).join('');
  }

  function renderStatsChart() {
    Charts.bar('reports-stats-chart',
      ['Jan','Feb','Mar','Apr','May','Jun'],
      [{
        label:'Reports Generated',
        data:[12, 14, 10, 16, 13, 18],
        backgroundColor:'rgba(37,99,235,0.7)',
        borderRadius:6, borderWidth:0,
      }],
      { maxY: 25 }
    );
  }

  function generate(id) {
    const report = REPORTS.find(r => r.id === id);
    if (!report) return;
    Utils.toast(`Generating: ${report.title}…`, 'info');
    setTimeout(() => Utils.toast(`Report ready: ${report.title}`, 'success'), 2000);
  }

  function download(id, format) {
    const report = REPORTS.find(r => r.id === id);
    if (!report) return;
    Utils.toast(`Downloading ${format.toUpperCase()}: ${report.title}`, 'success');
    // Simulate download with a blob
    const data = `NETRA Report — ${report.title}\nGenerated: ${new Date().toLocaleString('en-IN')}\nFormat: ${format.toUpperCase()}\n\nThis is a simulated report export.`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${report.id}-${format}.${format === 'excel' ? 'csv' : 'txt'}`;
    a.click(); URL.revokeObjectURL(url);
  }

  function init() {
    if (initialized) return;
    initialized = true;
    renderReportCards();
    renderRecentReports();
    renderStatsChart();
  }

  return { init, generate, download };
})();

window.Reports = Reports;
