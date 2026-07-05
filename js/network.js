/* =============================================
   NETRA — OFFENDER NETWORK PAGE
   ============================================= */
'use strict';

const NetworkGraph = (() => {
  let initialized = false;
  let canvas, ctx, W, H;
  let nodes = [], edges = [];
  let dragging = null, offsetX, offsetY;
  let selectedNode = null;
  let animFrame;
  let search = '';

  const NODE_DATA = [
    { id:0,  name:'Rajan Shetty',   role:'Gang Leader',   crime:'Robbery',    connections:[1,2,3],    color:'#ef4444', radius:22 },
    { id:1,  name:'Mahesh Gowda',   role:'Associate',     crime:'Assault',    connections:[0,4],      color:'#f59e0b', radius:16 },
    { id:2,  name:'Suresh Kumar',   role:'Driver',        crime:'Robbery',    connections:[0,3,5],    color:'#f59e0b', radius:16 },
    { id:3,  name:'Anand Rao',      role:'Lookout',       crime:'Robbery',    connections:[0,2,6],    color:'#f59e0b', radius:14 },
    { id:4,  name:'Vijay Nair',     role:'Fence',         crime:'Theft',      connections:[1,7],      color:'#8b5cf6', radius:14 },
    { id:5,  name:'Ramu Pillai',    role:'Associate',     crime:'Burglary',   connections:[2,8],      color:'#f59e0b', radius:12 },
    { id:6,  name:'Shiva Reddy',    role:'Known Thief',   crime:'Theft',      connections:[3,9],      color:'#06b6d4', radius:12 },
    { id:7,  name:'Kiran Bhat',     role:'Money Mule',    crime:'Cyber Fraud',connections:[4,10],     color:'#06b6d4', radius:12 },
    { id:8,  name:'Pradeep Singh',  role:'Associate',     crime:'Burglary',   connections:[5],        color:'#94a3b8', radius:10 },
    { id:9,  name:'Lokesh Patil',   role:'Associate',     crime:'Theft',      connections:[6],        color:'#94a3b8', radius:10 },
    { id:10, name:'Kavya Menon',    role:'Suspected Spy', crime:'Cyber Fraud',connections:[7],        color:'#22c55e', radius:10 },
  ];

  function buildGraph(ww, hh) {
    // Spread nodes in a force-based circular layout
    const cx = ww / 2, cy = hh / 2;
    const leaders = NODE_DATA.filter(n => n.radius >= 20);
    const mid     = NODE_DATA.filter(n => n.radius >= 14 && n.radius < 20);
    const outer   = NODE_DATA.filter(n => n.radius < 14);

    function place(arr, r) {
      arr.forEach((n, i) => {
        const angle = (2 * Math.PI * i / arr.length) - Math.PI / 2;
        n.x = cx + r * Math.cos(angle);
        n.y = cy + r * Math.sin(angle);
        n.vx = 0; n.vy = 0;
      });
    }

    place(leaders, 0);
    place(mid, Math.min(ww, hh) * 0.22);
    place(outer, Math.min(ww, hh) * 0.4);

    nodes = NODE_DATA;
    edges = [];
    NODE_DATA.forEach(n => {
      n.connections.forEach(c => {
        if (c > n.id) edges.push({ a: n.id, b: c });
      });
    });
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Draw edges
    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      const isHighlighted = selectedNode && (selectedNode.id === e.a || selectedNode.id === e.b);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isHighlighted ? 'rgba(37,99,235,0.6)' : 'rgba(148,163,184,0.3)';
      ctx.lineWidth   = isHighlighted ? 2 : 1;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      const isDimmed = selectedNode && selectedNode.id !== n.id && !selectedNode.connections.includes(n.id);
      const alpha    = isDimmed ? 0.3 : 1;
      const isSearch = search && (n.name.toLowerCase().includes(search) || n.crime.toLowerCase().includes(search));

      // Glow for selected or search match
      if (selectedNode?.id === n.id || isSearch) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '33';
        ctx.fill();
      }

      // Circle
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Initial
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${n.radius > 14 ? 11 : 9}px Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.name.charAt(0), n.x, n.y);

      // Label
      ctx.fillStyle = isDark() ? '#e2e8f0' : '#1e293b';
      ctx.font = `500 9px Inter`;
      ctx.fillText(n.name.split(' ')[0], n.x, n.y + n.radius + 10);

      ctx.globalAlpha = 1;
    });
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getNodeAt(x, y) {
    return nodes.find(n => Math.hypot(n.x - x, n.y - y) <= n.radius + 4) || null;
  }

  function setupCanvas() {
    canvas = document.getElementById('network-canvas');
    if (!canvas) return false;
    ctx = canvas.getContext('2d');
    W = canvas.offsetWidth || 700;
    H = canvas.offsetHeight || 500;
    canvas.width  = W;
    canvas.height = H;
    buildGraph(W, H);
    return true;
  }

  function renderOffenderList(filterSearch = '') {
    const list = document.getElementById('offender-list');
    if (!list) return;
    const filtered = filterSearch
      ? nodes.filter(n => n.name.toLowerCase().includes(filterSearch.toLowerCase()) || n.crime.toLowerCase().includes(filterSearch.toLowerCase()))
      : nodes;

    list.innerHTML = filtered.map(n => `
      <div class="offender-item" onclick="NetworkGraph.selectNode(${n.id})" style="cursor:pointer;">
        <div class="offender-avatar" style="background:${n.color};">${n.name.charAt(0)}</div>
        <div class="offender-info">
          <div class="offender-name">${n.name}</div>
          <div class="offender-crime">${n.role} · ${n.crime}</div>
        </div>
        <span class="severity-badge ${n.connections.length>=3?'high':n.connections.length>=1?'medium':'low'}">
          ${n.connections.length} links
        </span>
      </div>`).join('');
  }

  function selectNode(id) {
    selectedNode = selectedNode?.id === id ? null : nodes[id];
    draw();
    // Update detail panel
    const detail = document.getElementById('offender-detail');
    if (!detail) return;
    if (!selectedNode) { detail.innerHTML = '<p style="color:var(--text-muted);font-size:12px;text-align:center;padding:20px 0;">Click a node to view details</p>'; return; }
    const n = selectedNode;
    detail.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:48px;height:48px;border-radius:50%;background:${n.color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;">${n.name.charAt(0)}</div>
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--text-primary);">${n.name}</div>
          <div style="font-size:11px;color:var(--text-muted);">${n.role}</div>
        </div>
      </div>
      <div class="detail-row"><span class="detail-label">Crime Type</span><span class="detail-value">${n.crime}</span></div>
      <div class="detail-row"><span class="detail-label">Connections</span><span class="detail-value">${n.connections.length} known associates</span></div>
      <div class="detail-row"><span class="detail-label">Risk Level</span><span class="detail-value"><span class="severity-badge ${n.connections.length>=3?'high':n.connections.length>=1?'medium':'low'}">${n.connections.length>=3?'High':n.connections.length>=1?'Medium':'Low'}</span></span></div>
      <div class="detail-row"><span class="detail-label">Associates</span><span class="detail-value">${n.connections.map(c=>nodes[c]?.name||'').filter(Boolean).join(', ')}</span></div>
    `;
  }

  function loop() {
    draw();
    animFrame = requestAnimationFrame(loop);
  }

  function bindEvents() {
    canvas.addEventListener('mousedown', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const n = getNodeAt(x, y);
      if (n) { dragging = n; offsetX = x - n.x; offsetY = y - n.y; }
    });
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (dragging) {
        dragging.x = x - offsetX;
        dragging.y = y - offsetY;
      }
      canvas.style.cursor = getNodeAt(x, y) ? 'pointer' : 'default';
    });
    canvas.addEventListener('mouseup', e => {
      if (dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        // If hardly moved, treat as click
        if (Math.hypot(x - dragging.x - offsetX, y - dragging.y - offsetY) < 5) {
          selectNode(dragging.id);
        }
        dragging = null;
      }
    });
    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = t.clientX - rect.left, y = t.clientY - rect.top;
      const n = getNodeAt(x, y);
      if (n) { dragging = n; offsetX = x - n.x; offsetY = y - n.y; e.preventDefault(); }
    }, { passive: false });
    canvas.addEventListener('touchmove', e => {
      if (!dragging) return;
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      dragging.x = t.clientX - rect.left - offsetX;
      dragging.y = t.clientY - rect.top  - offsetY;
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => { dragging = null; });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    if (!setupCanvas()) return;
    bindEvents();
    loop();
    renderOffenderList();

    // Search
    const searchEl = document.getElementById('network-search');
    if (searchEl) {
      searchEl.addEventListener('input', Utils.debounce(() => {
        search = searchEl.value.trim().toLowerCase();
        renderOffenderList(searchEl.value.trim());
        draw();
      }, 250));
    }

    // Reset button
    document.getElementById('network-reset')?.addEventListener('click', () => {
      selectedNode = null;
      search = '';
      const s = document.getElementById('network-search');
      if (s) s.value = '';
      buildGraph(W, H);
      renderOffenderList();
      const detail = document.getElementById('offender-detail');
      if (detail) detail.innerHTML = '<p style="color:var(--text-muted);font-size:12px;text-align:center;padding:20px 0;">Click a node to view details</p>';
    });
  }

  return { init, selectNode };
})();

window.NetworkGraph = NetworkGraph;
