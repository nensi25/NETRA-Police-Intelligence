/* =============================================
   NETRA — CRIME INTELLIGENCE PAGE
   ============================================= */
'use strict';

const Intelligence = (() => {
  let initialized = false;

  const PREDICTIONS = [
    {
      icon:'🎯', bg:'rgba(239,68,68,0.1)',
      title:'Robbery Spike Predicted',
      sub: 'Next 48 hours — East Zone',
      desc: 'AI model detects 78% probability of robbery spike in Koramangala and KR Puram. Historical data shows elevated weekend crime pattern. Recommend increased patrol presence.',
      risk: 'high', confidence: 78,
    },
    {
      icon:'🔍', bg:'rgba(245,158,11,0.1)',
      title:'Repeat Offender Pattern',
      sub: 'Whitefield area — Active suspect',
      desc: '3 incidents show identical MO: chain snatching near ATMs between 8–10 PM. Suspect profile generated. CCTV analysis ongoing. 65% match with prior offender.',
      risk: 'medium', confidence: 65,
    },
    {
      icon:'💻', bg:'rgba(37,99,235,0.1)',
      title:'Cyber Fraud Cluster',
      sub: 'Banking sector — Escalating',
      desc: 'Cluster of 12 UPI fraud cases share same device fingerprint and originating network. Likely organized gang. Cyber cell coordination recommended.',
      risk: 'medium', confidence: 82,
    },
    {
      icon:'🏚️', bg:'rgba(139,92,246,0.1)',
      title:'Residential Burglary Zone',
      sub: 'Jayanagar — Night-time pattern',
      desc: 'Burglary incidents increase 40% on weeknights in Jayanagar sectors 4 and 6. Prefer ground-floor flats. Entry via rear windows. Night patrol increase recommended.',
      risk: 'low', confidence: 71,
    },
  ];

  const TIMELINE = [
    { date:'Jul 05', title:'High Alert Issued', desc:'Robbery alert for East Zone activated based on AI prediction.', color:'red'    },
    { date:'Jul 04', title:'Pattern Detected',  desc:'Repeat offender MO identified across 3 Whitefield incidents.', color:'orange' },
    { date:'Jul 03', title:'Cyber Cluster Found', desc:'12 UPI fraud cases linked to single organized network.',     color:'blue'   },
    { date:'Jul 02', title:'Model Updated',    desc:'Crime prediction model retrained with June data. +4% accuracy.', color:'green' },
    { date:'Jul 01', title:'Report Generated',  desc:'Monthly intelligence brief submitted to DCP office.',          color:'blue'   },
    { date:'Jun 28', title:'Arrest made',        desc:'Suspect arrested in KR Puram robbery case. Linked to 3 cases.', color:'green' },
  ];

  const SUSPICIOUS = [
    { id:'SUS-001', type:'Vehicle',     desc:'Dark SUV — KA05AB1234 — circling residential area 3× nightly', zone:'Jayanagar',     threat:'high'   },
    { id:'SUS-002', type:'Person',      desc:'Unknown male loitering near ATMs — 8–10 PM — Whitefield',       zone:'Whitefield',    threat:'medium' },
    { id:'SUS-003', type:'Transaction', desc:'Unusual UPI transfers from 5 accounts to single beneficiary',   zone:'Online',        threat:'high'   },
    { id:'SUS-004', type:'Movement',    desc:'Group of 4–5 persons gathering at Hebbal junction after midnight',zone:'Hebbal',      threat:'medium' },
    { id:'SUS-005', type:'Network',     desc:'3 known associates of Rajan gang spotted together in Yelahanka', zone:'Yelahanka',    threat:'high'   },
  ];

  function renderPredictions() {
    const el = document.getElementById('intel-predictions');
    if (!el) return;
    el.innerHTML = PREDICTIONS.map(p => `
      <div class="prediction-card" style="animation:fadeInUp 0.4s ease both;">
        <div class="prediction-header">
          <div class="prediction-icon" style="background:${p.bg};">${p.icon}</div>
          <div>
            <div class="prediction-title">${p.title}</div>
            <div class="prediction-sub">${p.sub}</div>
          </div>
        </div>
        <div class="prediction-body">${p.desc}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:10px;">
          <span class="risk-tag ${p.risk}">${p.risk.toUpperCase()} RISK</span>
          <span style="font-size:11px;color:var(--text-muted);">Confidence: <b>${p.confidence}%</b></span>
          <div style="flex:1;height:4px;background:rgba(0,0,0,0.06);border-radius:2px;">
            <div style="width:${p.confidence}%;height:100%;border-radius:2px;background:${p.risk==='high'?'#ef4444':p.risk==='medium'?'#f59e0b':'#16a34a'};transition:width 1s ease;"></div>
          </div>
        </div>
      </div>`).join('');
  }

  function renderTimeline() {
    const el = document.getElementById('intel-timeline');
    if (!el) return;
    el.innerHTML = `<div class="timeline">` +
      TIMELINE.map(t => `
        <div class="timeline-item ${t.color}">
          <div class="timeline-date">${t.date}</div>
          <div class="timeline-content">
            <div class="timeline-title">${t.title}</div>
            <div class="timeline-desc">${t.desc}</div>
          </div>
        </div>`).join('') +
      `</div>`;
  }

  function renderSuspicious() {
    const el = document.getElementById('intel-suspicious');
    if (!el) return;
    const threatBg = { high:'var(--red-bg)', medium:'var(--orange-bg)', low:'var(--green-bg)' };
    const threatColor = { high:'var(--red)', medium:'#d97706', low:'var(--green)' };
    el.innerHTML = SUSPICIOUS.map(s => `
      <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.04);">
        <div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:${threatBg[s.threat]};display:flex;align-items:center;justify-content:center;font-size:14px;">
          ${s.type==='Vehicle'?'🚗':s.type==='Person'?'👤':s.type==='Transaction'?'💳':'🔍'}
        </div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
            <span style="font-size:11px;font-weight:700;color:var(--text-muted);">${s.id}</span>
            <span style="font-size:10px;font-weight:700;padding:1px 8px;border-radius:20px;background:${threatBg[s.threat]};color:${threatColor[s.threat]};">${s.threat.toUpperCase()}</span>
          </div>
          <div style="font-size:12.5px;font-weight:600;color:var(--text-primary);">${s.type}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${s.desc}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">📍 ${s.zone}</div>
        </div>
      </div>`).join('');
  }

  function renderForecastChart() {
    Charts.area('intel-forecast-chart',
      ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'],
      [42, 45, 50, 46, 55, 62],
      '#ef4444',
      { label: 'Predicted Incidents', maxY: 80, stepY: 20 }
    );
  }

  function init() {
    if (initialized) return;
    initialized = true;
    renderPredictions();
    renderTimeline();
    renderSuspicious();
    renderForecastChart();
  }

  return { init };
})();

window.Intelligence = Intelligence;
