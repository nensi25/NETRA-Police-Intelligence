/* =============================================
   NETRA — DASHBOARD PAGE
   ============================================= */
'use strict';

const Dashboard = (() => {
  let initialized = false;

  const INCIDENTS = [
    { time:'10:15 AM', type:'Robbery',      location:'MG Road, Bangalore',    severity:'high',   icon:'🔫', dotColor:'red',    iconClass:'robbery' },
    { time:'09:48 AM', type:'Assault',      location:'Koramangala 3rd Block', severity:'medium', icon:'👊', dotColor:'orange', iconClass:'assault' },
    { time:'09:30 AM', type:'Vehicle Theft',location:'HSR Layout',            severity:'medium', icon:'🚗', dotColor:'orange', iconClass:'theft'   },
    { time:'09:10 AM', type:'Theft',        location:'Indiranagar',           severity:'low',    icon:'💰', dotColor:'green',  iconClass:'theft'   },
    { time:'08:45 AM', type:'Cyber Fraud',  location:'Marathahalli',          severity:'low',    icon:'💻', dotColor:'blue',   iconClass:'cyber'   },
  ];

  const RISK_AREAS = [
    { rank:1, name:'Koramangala', pct:95, count: 48 },
    { rank:2, name:'KR Puram',    pct:87, count: 41 },
    { rank:3, name:'Whitefield',  pct:78, count: 37 },
    { rank:4, name:'Jayanagar',   pct:72, count: 31 },
    { rank:5, name:'Rajajinagar', pct:65, count: 28 },
  ];

  const ALERTS = [
    { title:'<span>High Crime Alert</span>', sub:'Koramangala, Bangalore', time:'2 min ago',  type:'critical', icon:'🔴' },
    { title:'Suspicious Activity',           sub:'Hoskote',               time:'15 min ago', type:'warning',  icon:'🟡' },
    { title:'<span>Repeat Offender Detected</span>', sub:'Whitefield',     time:'30 min ago', type:'critical', icon:'🟠' },
    { title:'Unusual Movement Detected',     sub:'KR Puram',              time:'1 hr ago',   type:'info',     icon:'🔵' },
  ];

  const INTEL = [
    { text:'Robbery incidents increased by 12% in the last 7 days.', color:'red'    },
    { text:'3 repeat offenders identified in high activity zones.',   color:'orange' },
    { text:'Koramangala and KR Puram are high risk zones.',          color:'blue'   },
    { text:'Recommend deploying 2 additional patrol units in East Zone.', color:'green' },
  ];

  const TREND_DATA = {
    'All Crimes': [180, 220, 310, 280, 350, 240],
    'Theft':      [80,  100, 140, 120, 160, 110],
    'Assault':    [40,  60,  90,  80,  100, 70 ],
    'Robbery':    [60,  60,  80,  80,  90,  60 ],
  };

  function renderIncidents() {
    const list = document.getElementById('dash-incidents-list');
    if (!list) return;
    list.innerHTML = INCIDENTS.map((inc, i) => `
      <div class="incident-item" style="animation:fadeInUp 0.4s ${0.1+i*0.08}s ease both;">
        <div class="incident-time-col">
          <span class="incident-time">${inc.time}</span>
          <span class="incident-dot ${inc.dotColor}"></span>
          ${i < INCIDENTS.length-1 ? '<div class="incident-line"></div>' : ''}
        </div>
        <div class="incident-icon ${inc.iconClass}">${inc.icon}</div>
        <div class="incident-info">
          <div class="incident-title">${inc.type}</div>
          <div class="incident-location">${inc.location}</div>
        </div>
        <span class="severity-badge ${inc.severity}">${inc.severity.charAt(0).toUpperCase()+inc.severity.slice(1)}</span>
      </div>`).join('');
  }

  function renderRiskAreas() {
    const list = document.getElementById('dash-risk-areas');
    if (!list) return;
    list.innerHTML = RISK_AREAS.map((a,i) => `
      <div class="risk-area-item" style="animation:fadeInUp 0.4s ${0.15+i*0.08}s ease both;">
        <div class="risk-rank r${a.rank}">${a.rank}</div>
        <div class="risk-area-info">
          <div class="risk-area-name">${a.name}</div>
          <div class="risk-progress-bar">
            <div class="risk-progress-fill r${a.rank}" style="width:${a.pct}%"></div>
          </div>
        </div>
        <div class="risk-pct">${a.pct}%</div>
      </div>`).join('');
  }

  function renderAlerts() {
    const list = document.getElementById('dash-alerts-list');
    if (!list) return;
    list.innerHTML = ALERTS.map((a,i) => `
      <div class="alert-item" style="animation:fadeInUp 0.4s ${0.2+i*0.08}s ease both;">
        <div class="alert-severity-icon ${a.type}">${a.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${a.title}</div>
          <div class="alert-sub">${a.sub}</div>
        </div>
        <span class="alert-time">${a.time}</span>
      </div>`).join('');
  }

  function renderIntel() {
    const el = document.getElementById('dash-intel-brief');
    if (!el) return;
    el.innerHTML = INTEL.map(item => `
      <div class="intel-item">
        <span class="intel-dot ${item.color}"></span>
        <span>${item.text}</span>
      </div>`).join('');
  }

  function initSparklines() {
    setTimeout(() => {
      Charts.sparkline('spark-incidents', [40,55,30,70,60,85,100], 'rgb(37,99,235)');
      Charts.sparkline('spark-open', [100,95,90,85,90,80,75], 'rgb(234,88,12)');
      Charts.sparkline('spark-risk', [8,10,9,11,10,12,14], 'rgb(220,38,38)');
      Charts.sparkline('spark-patrols', [15,16,15,18,17,18,19], 'rgb(22,163,74)');
      Charts.sparkline('spark-trend', [250,230,240,210,190,170,165], 'rgb(6,182,212)');
    }, 100); // slight delay to ensure DOM is ready
  }

  function animateAIPrediction() {
    setTimeout(() => {
      const ring = document.getElementById('ai-conf-ring');
      if (ring) {
        ring.style.strokeDasharray = '92, 100';
      }
    }, 300);
  }

  function initTrendChart(filter = 'All Crimes') {
    const data2025 = TREND_DATA[filter] || TREND_DATA['All Crimes'];
    const data2024 = data2025.map(v => Math.round(v * 0.82));
    
    const ctx = document.getElementById('crime-trend-chart')?.getContext('2d');
    if (!ctx) return;
    
    let gradient = 'rgba(37,99,235,0.1)';
    if (ctx.createLinearGradient) {
      gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, 'rgba(37,99,235,0.4)');
      gradient.addColorStop(1, 'rgba(37,99,235,0.0)');
    }

    Charts.line('crime-trend-chart', ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], [
      {
        label:'This Week', data: data2025.map(v => v/2), // scaling down for 7 days
        borderColor:'#2563eb', backgroundColor: gradient,
        fill:true, tension:0.4, borderWidth:3,
        pointRadius:0, pointHoverRadius:6, pointBackgroundColor:'#2563eb', pointBorderColor:'#fff', pointBorderWidth:2,
      },
      {
        label:'Last Week', data: data2024.map(v => v/2),
        borderColor:'#64748b', backgroundColor:'transparent',
        borderDash:[5,5], tension:0.4, borderWidth:2,
        pointRadius:0, pointHoverRadius:4,
      }
    ], { maxY:200, stepY:50 });
  }

  function animateStatCounters() {
    const counters = [
      { id:'stat-val-incidents', target:234 },
      { id:'stat-val-open',      target:128 },
      { id:'stat-val-risk',      target:12  },
      { id:'stat-val-patrol',    target:18  },
      { id:'stat-val-trend',     target:-4, suffix:'%' },
    ];
    counters.forEach(c => {
      const el = document.getElementById(c.id);
      if (!el) return;
      if (c.target < 0) { el.textContent = c.target + (c.suffix||''); return; }
      Utils.animateCounter(el, c.target, 1200, c.prefix||'', c.suffix||'');
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    renderIncidents();
    renderRiskAreas();
    renderAlerts();
    initTrendChart();
    animateStatCounters();
    initSparklines();
    animateAIPrediction();
    MapModule.initDashMap();

    // Trend filter
    const trendFilter = document.getElementById('trend-filter');
    if (trendFilter) {
      trendFilter.addEventListener('change', () => initTrendChart(trendFilter.value));
    }

    // View all incidents → navigate
    document.querySelectorAll('.dash-view-incidents').forEach(btn => {
      btn.addEventListener('click', () => Router.navigate('incidents'));
    });
    document.querySelectorAll('.dash-view-alerts').forEach(btn => {
      btn.addEventListener('click', () => Router.navigate('alerts'));
    });
    document.querySelectorAll('.dash-view-hotspots').forEach(btn => {
      btn.addEventListener('click', () => Router.navigate('hotspots'));
    });
  }

  return { init };
})();

window.Dashboard = Dashboard;
