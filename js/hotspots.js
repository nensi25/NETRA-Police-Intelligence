/* =============================================
   NETRA — HOTSPOTS PAGE
   ============================================= */
'use strict';

const Hotspots = (() => {
  let initialized = false;

  const HOTSPOTS = [
    { rank:1, name:'Koramangala',    zone:'South-East', risk:95, trend:'+8%',  incidents:48, type:'Mixed', lat:12.9352, lng:77.6245, color:'#ef4444' },
    { rank:2, name:'KR Puram',       zone:'East',       risk:87, trend:'+5%',  incidents:41, type:'Robbery', lat:12.9779,lng:77.6962,color:'#ea580c' },
    { rank:3, name:'Whitefield',     zone:'East',       risk:78, trend:'-2%',  incidents:37, type:'Theft',  lat:12.9698,lng:77.7500,color:'#f59e0b' },
    { rank:4, name:'Jayanagar',      zone:'South',      risk:72, trend:'+1%',  incidents:31, type:'Burglary',lat:12.9279,lng:77.5871,color:'#3b82f6' },
    { rank:5, name:'Rajajinagar',    zone:'West',       risk:65, trend:'-3%',  incidents:28, type:'Assault',lat:13.0067,lng:77.5668,color:'#06b6d4' },
    { rank:6, name:'Hebbal',         zone:'North',      risk:58, trend:'+4%',  incidents:22, type:'Mixed',  lat:13.0350,lng:77.5970,color:'#8b5cf6' },
    { rank:7, name:'Electronic City',zone:'South',      risk:52, trend:'-5%',  incidents:19, type:'Cyber',  lat:12.8486,lng:77.6600,color:'#22c55e' },
  ];

  function renderList() {
    const list = document.getElementById('hotspot-list');
    if (!list) return;
    list.innerHTML = HOTSPOTS.map((h, i) => `
      <div class="risk-area-item" style="animation:fadeInUp 0.4s ${0.05+i*0.07}s ease both;cursor:pointer;" onclick="Hotspots.highlight(${i})">
        <div class="risk-rank r${h.rank}">${h.rank}</div>
        <div class="risk-area-info">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="risk-area-name">${h.name}</div>
            <span style="font-size:10px;font-weight:700;color:${h.trend.startsWith('+')?'var(--red)':'var(--green)'};">${h.trend}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:3px;">
            <span style="font-size:10px;color:var(--text-muted);">${h.zone} Zone · ${h.type}</span>
            <span style="font-size:10px;color:var(--text-muted);">${h.incidents} incidents</span>
          </div>
          <div class="risk-progress-bar">
            <div class="risk-progress-fill r${h.rank}" style="width:${h.risk}%"></div>
          </div>
        </div>
        <div class="risk-pct">${h.risk}%</div>
      </div>`).join('');
  }

  function renderStats() {
    const stats = [
      { id:'hs-stat-total',  value:HOTSPOTS.length, label:'Hotspot Areas'    },
      { id:'hs-stat-high',   value:3,                label:'Critical Zones'  },
      { id:'hs-stat-inc',    value:226,              label:'Total Incidents'  },
      { id:'hs-stat-patrol', value:7,                label:'Patrols Deployed' },
    ];
    stats.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) Utils.animateCounter(el, s.value, 1000);
    });
  }

  function renderHotspotChart() {
    Charts.bar('hotspot-bar-chart',
      HOTSPOTS.map(h => h.name),
      [{
        label: 'Risk Score',
        data: HOTSPOTS.map(h => h.risk),
        backgroundColor: HOTSPOTS.map(h => h.color),
        borderRadius: 6,
        borderWidth: 0,
      }],
      { maxY: 100 }
    );
  }

  function highlight(idx) {
    // Visual highlight only
    document.querySelectorAll('#hotspot-list .risk-area-item').forEach((el, i) => {
      el.style.background = i === idx ? 'rgba(37,99,235,0.06)' : '';
    });
    Utils.toast(`Viewing: ${HOTSPOTS[idx].name} — Risk ${HOTSPOTS[idx].risk}%`, 'info');
  }

  function init() {
    if (initialized) return;
    initialized = true;
    renderList();
    renderStats();
    renderHotspotChart();
    MapModule.initHotspotMap();
  }

  return { init, highlight };
})();

window.Hotspots = Hotspots;
