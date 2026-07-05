/* =============================================
   NETRA — MAP MODULE
   ============================================= */
'use strict';

const MapModule = (() => {
  let dashMap = null;
  let fullMap  = null;
  let hotspotMap = null;
  let activeFilter = 'all';
  let heatLayer = null;
  let markerGroup = null;

  // Crime data
  const CRIME_LOCATIONS = [
    { lat: 12.9752, lng: 77.6066, type: 'Robbery',    area: 'MG Road',        color: '#ef4444', icon: '🔫', severity: 'high'   },
    { lat: 12.9352, lng: 77.6245, type: 'Assault',    area: 'Koramangala',    color: '#f59e0b', icon: '👊', severity: 'medium' },
    { lat: 12.9698, lng: 77.7500, type: 'Theft',      area: 'Whitefield',     color: '#3b82f6', icon: '💰', severity: 'low'    },
    { lat: 12.9279, lng: 77.5871, type: 'Burglary',   area: 'Jayanagar',      color: '#8b5cf6', icon: '🏚️', severity: 'medium' },
    { lat: 12.8486, lng: 77.6600, type: 'Cyber Crime',area: 'Electronic City',color: '#06b6d4', icon: '💻', severity: 'low'    },
    { lat: 13.0067, lng: 77.5668, type: 'Robbery',    area: 'Rajajinagar',    color: '#ef4444', icon: '🔫', severity: 'high'   },
    { lat: 13.0358, lng: 77.5970, type: 'Theft',      area: 'Yelahanka',      color: '#3b82f6', icon: '💰', severity: 'low'    },
    { lat: 12.9542, lng: 77.6369, type: 'Assault',    area: 'HSR Layout',     color: '#f59e0b', icon: '👊', severity: 'medium' },
    { lat: 12.9450, lng: 77.5800, type: 'Robbery',    area: 'Vijayanagar',    color: '#ef4444', icon: '🔫', severity: 'high'   },
    { lat: 13.0100, lng: 77.6400, type: 'Burglary',   area: 'Hebbal',         color: '#8b5cf6', icon: '🏚️', severity: 'medium' },
    { lat: 12.9600, lng: 77.5400, type: 'Cyber Crime',area: 'Rajajinagar',    color: '#06b6d4', icon: '💻', severity: 'low'    },
    { lat: 12.9100, lng: 77.5700, type: 'Theft',      area: 'Mysore Road',    color: '#3b82f6', icon: '💰', severity: 'low'    },
  ];

  const HEAT_DATA = [
    [12.9716,77.5946,0.9],[12.9352,77.6245,0.95],[12.9698,77.7500,0.7],
    [12.9279,77.5871,0.85],[12.9542,77.6369,0.8],[12.9121,77.6446,0.75],
    [12.9902,77.5513,0.65],[13.0067,77.5668,0.6],[13.0358,77.5970,0.55],
    [12.9565,77.7009,0.88],[12.9783,77.6408,0.72],[12.9344,77.6101,0.92],
    [12.9010,77.5970,0.68],[13.0115,77.5540,0.5],[12.9610,77.5660,0.77],
    [12.9850,77.6050,0.83],[12.9400,77.5800,0.9],[12.9200,77.6500,0.78],
    [12.9650,77.5400,0.6],[13.0200,77.6400,0.55],[12.9100,77.5700,0.7],
    [12.9500,77.6700,0.85],[12.9750,77.6800,0.62],[12.9300,77.5500,0.58],
    [12.9950,77.5300,0.45],[12.9450,77.5950,0.92],[12.9600,77.6100,0.87],
    [12.9150,77.6200,0.73],[12.9800,77.5750,0.66],[13.0050,77.6100,0.52],
  ];

  const LABELS = [
    {lat:13.055,lng:77.580,name:'YELAHANKA'},{lat:13.01,lng:77.55,name:'RAJAJINAGAR'},
    {lat:12.990,lng:77.590,name:'HEBBAL'},{lat:12.975,lng:77.650,name:'KR PURAM'},
    {lat:12.965,lng:77.595,name:'BANGALORE'},{lat:12.935,lng:77.620,name:'KORAMANGALA'},
    {lat:12.970,lng:77.745,name:'WHITEFIELD'},{lat:12.925,lng:77.575,name:'JAYANAGAR'},
    {lat:12.900,lng:77.540,name:'MYSORE ROAD'},{lat:12.850,lng:77.660,name:'ELECTRONIC CITY'},
  ];

  const TILE = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  function getTile() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? TILE_DARK : TILE;
  }

  function createMap(containerId, zoom = 12) {
    const m = L.map(containerId, { zoomControl: true, attributionControl: false })
               .setView([12.9716, 77.5946], zoom);
    L.tileLayer(getTile(), { maxZoom: 19 }).addTo(m);
    addLabels(m);
    return m;
  }

  function addHeatLayer(m) {
    if (typeof L.heatLayer !== 'function') return;
    if (heatLayer) { m.removeLayer(heatLayer); }
    heatLayer = L.heatLayer(HEAT_DATA, {
      radius: 30, blur: 25, maxZoom: 15,
      gradient: { 0.2:'#22c55e', 0.4:'#84cc16', 0.6:'#f59e0b', 0.8:'#ef4444', 1.0:'#dc2626' }
    }).addTo(m);
  }

  function addMarkers(m, filter = 'all') {
    if (markerGroup) { m.removeLayer(markerGroup); }
    markerGroup = L.featureGroup();
    CRIME_LOCATIONS.forEach(loc => {
      if (filter !== 'all' && loc.type.toLowerCase().replace(' ','') !== filter) return;
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 9, fillColor: loc.color, color: '#fff', weight: 2, fillOpacity: 0.9,
      });
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;padding:4px;min-width:160px;">
          <div style="font-size:15px;margin-bottom:4px;">${loc.icon}</div>
          <div style="font-size:13px;font-weight:700;color:#1e293b;">${loc.type}</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">📍 ${loc.area}</div>
          <div style="margin-top:6px;display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;background:${loc.color}22;color:${loc.color};">
            ${loc.severity.toUpperCase()}
          </div>
        </div>
      `);
      markerGroup.addLayer(marker);
    });
    markerGroup.addTo(m);
  }

  function addLabels(m) {
    LABELS.forEach(l => {
      L.marker([l.lat, l.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="font-size:9px;font-weight:700;color:#475569;letter-spacing:0.5px;white-space:nowrap;text-shadow:0 0 4px #fff,0 0 4px #fff;">${l.name}</div>`,
          iconSize: [0,0],
        })
      }).addTo(m);
    });
  }

  /** Initialize the small dashboard map */
  function initDashMap() {
    if (dashMap) return;
    const el = document.getElementById('crime-map');
    if (!el) return;
    dashMap = createMap('crime-map', 12);
    addHeatLayer(dashMap);
    addMarkers(dashMap);
    setTimeout(() => dashMap.invalidateSize(), 300);
  }

  /** Initialize the full-page Live Map */
  function initFullMap() {
    const el = document.getElementById('full-map');
    if (!el) return;
    if (fullMap) { setTimeout(() => fullMap.invalidateSize(), 200); return; }
    fullMap = createMap('full-map', 12);
    addHeatLayer(fullMap);
    addMarkers(fullMap);
    setTimeout(() => fullMap.invalidateSize(), 300);
  }

  /** Initialize the hotspot mini-map */
  function initHotspotMap() {
    const el = document.getElementById('hotspot-map');
    if (!el) return;
    if (hotspotMap) { setTimeout(() => hotspotMap.invalidateSize(), 200); return; }
    hotspotMap = createMap('hotspot-map', 12);
    addHeatLayer(hotspotMap);
    setTimeout(() => hotspotMap.invalidateSize(), 300);
  }

  /** Filter full map markers */
  function filterMap(type) {
    activeFilter = type;
    if (fullMap) addMarkers(fullMap, type);
    // Update filter buttons
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === type);
    });
  }

  return { initDashMap, initFullMap, initHotspotMap, filterMap, CRIME_LOCATIONS };
})();

window.MapModule = MapModule;
