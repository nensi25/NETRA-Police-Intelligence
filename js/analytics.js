/* =============================================
   NETRA — ANALYTICS PAGE
   ============================================= */
'use strict';

const Analytics = (() => {
  let initialized = false;
  let currentPeriod = 'monthly';

  const DATA = {
    monthly: {
      labels:   ['Jan','Feb','Mar','Apr','May','Jun'],
      robbery:  [60, 65, 80, 75, 90, 68],
      assault:  [45, 58, 90, 82, 100, 72],
      theft:    [90, 105, 140, 125, 160, 112],
      cyber:    [30, 38, 52, 48, 58, 44],
    },
    weekly: {
      labels:   ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      robbery:  [12, 8, 14, 10, 18, 22, 16],
      assault:  [9, 12, 18, 14, 22, 25, 19],
      theft:    [20, 18, 25, 22, 30, 35, 28],
      cyber:    [5, 7, 9, 8, 12, 6, 4],
    },
    yearly: {
      labels:   ['2020','2021','2022','2023','2024','2025'],
      robbery:  [580, 620, 710, 680, 750, 820],
      assault:  [420, 450, 540, 500, 580, 640],
      theft:    [890, 950, 1100, 1050, 1180, 1280],
      cyber:    [180, 250, 380, 420, 510, 580],
    },
  };

  function renderCrimeTrendChart(period) {
    const d = DATA[period];
    Charts.line('analytics-trend-chart', d.labels, [
      { label:'Robbery', data:d.robbery, borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.08)', fill:true, tension:0.4, borderWidth:2, pointRadius:4, pointBackgroundColor:'#ef4444', pointBorderColor:'#fff', pointBorderWidth:2 },
      { label:'Assault', data:d.assault, borderColor:'#f59e0b', backgroundColor:'transparent', fill:false, tension:0.4, borderWidth:2, pointRadius:4, pointBackgroundColor:'#f59e0b', pointBorderColor:'#fff', pointBorderWidth:2 },
      { label:'Theft',   data:d.theft,   borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,0.08)', fill:true, tension:0.4, borderWidth:2, pointRadius:4, pointBackgroundColor:'#2563eb', pointBorderColor:'#fff', pointBorderWidth:2 },
      { label:'Cyber',   data:d.cyber,   borderColor:'#06b6d4', backgroundColor:'transparent', fill:false, tension:0.4, borderWidth:2, borderDash:[5,5], pointRadius:4, pointBackgroundColor:'#06b6d4', pointBorderColor:'#fff', pointBorderWidth:2 },
    ], { maxY: period==='yearly'?1400:period==='monthly'?200:40 });
  }

  function renderCrimeTypeChart() {
    Charts.doughnut('crime-type-chart',
      ['Theft', 'Assault', 'Robbery', 'Burglary', 'Cyber Crime'],
      [35, 22, 18, 14, 11],
      ['#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
    );
  }

  function renderAreaChart() {
    Charts.horizontalBar('area-crime-chart',
      ['Koramangala','KR Puram','Whitefield','Jayanagar','Rajajinagar','Hebbal','Yelahanka'],
      [95, 87, 78, 72, 65, 58, 52],
      ['#ef4444','#ea580c','#f59e0b','#3b82f6','#06b6d4','#8b5cf6','#22c55e'],
      { maxX: 100 }
    );
  }

  function renderRadarChart() {
    Charts.radar('crime-radar-chart',
      ['Violence','Property Crime','Cyber Crime','Drug Offences','Traffic','White Collar'],
      [{
        label: 'Bangalore', data:[85,72,68,45,60,38],
        borderColor:'#2563eb', backgroundColor:'rgba(37,99,235,0.15)',
        borderWidth:2, pointRadius:4, pointBackgroundColor:'#2563eb',
      },{
        label: 'State Average', data:[65,58,45,50,70,30],
        borderColor:'#94a3b8', backgroundColor:'rgba(148,163,184,0.1)',
        borderWidth:2, borderDash:[5,5], pointRadius:4, pointBackgroundColor:'#94a3b8',
      }]
    );
  }

  function renderHourlyChart() {
    const hours = ['00','02','04','06','08','10','12','14','16','18','20','22'];
    Charts.bar('hourly-chart', hours,
      [{
        label:'Incidents',
        data:[5,3,2,4,12,28,35,30,28,38,42,25],
        backgroundColor: hours.map((_,i) => {
          const v = [5,3,2,4,12,28,35,30,28,38,42,25][i];
          if (v > 35) return '#ef4444';
          if (v > 20) return '#f59e0b';
          return '#2563eb';
        }),
        borderWidth:0,
      }],
      { maxY:50 }
    );
  }

  function renderResolutionChart() {
    Charts.doughnut('resolution-chart',
      ['Resolved', 'Open', 'Pending'],
      [58, 28, 14],
      ['#16a34a','#ef4444','#f59e0b']
    );
  }

  function renderKPICounters() {
    const kpis = [
      { id:'anlyt-total',    target:1247 },
      { id:'anlyt-solved',   target:724  },
      { id:'anlyt-rate',     target:58.1, suffix:'%' },
      { id:'anlyt-response', target:4.2,  suffix:' min' },
    ];
    kpis.forEach(k => {
      const el = document.getElementById(k.id);
      if (!el) return;
      Utils.animateCounter(el, k.target, 1200, k.prefix||'', k.suffix||'');
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    renderCrimeTrendChart('monthly');
    renderCrimeTypeChart();
    renderAreaChart();
    renderRadarChart();
    renderHourlyChart();
    renderResolutionChart();
    renderKPICounters();

    // Period tabs
    document.querySelectorAll('.analytics-period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.analytics-period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        renderCrimeTrendChart(currentPeriod);
      });
    });
  }

  return { init };
})();

window.Analytics = Analytics;
