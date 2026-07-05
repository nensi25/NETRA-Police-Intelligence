/* =============================================
   NETRA — CHARTS (Reusable Chart Factory)
   ============================================= */
'use strict';

const Charts = (() => {
  const instances = {};

  // Base font settings
  const font = { family: 'Inter', size: 11 };
  const gridColor  = 'rgba(0,0,0,0.05)';
  const tickColor  = '#94a3b8';
  const tooltipBg  = '#0f172a';

  function destroyIfExists(id) {
    if (instances[id]) { instances[id].destroy(); delete instances[id]; }
  }

  function getCtx(id) {
    const el = document.getElementById(id);
    return el ? el.getContext('2d') : null;
  }

  /** Line Chart */
  function line(id, labels, datasets, opts = {}) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;
    instances[id] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: {
            display: opts.legend !== false,
            position: 'bottom',
            labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font, color: tickColor }
          },
          tooltip: { backgroundColor: tooltipBg, titleFont: { ...font, size: 12, weight: '600' }, bodyFont: font, cornerRadius: 8, padding: 10 }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: opts.maxY,
            grid: { color: gridColor, drawBorder: false },
            ticks: { font, color: tickColor, stepSize: opts.stepY },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: { font, color: tickColor },
            border: { display: false },
          }
        },
        ...opts.extra
      }
    });
    return instances[id];
  }

  /** Bar Chart */
  function bar(id, labels, datasets, opts = {}) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;
    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: opts.legend !== false, position: 'bottom', labels: { usePointStyle: true, padding: 16, font, color: tickColor } },
          tooltip: { backgroundColor: tooltipBg, titleFont: { ...font, weight: '600' }, bodyFont: font, cornerRadius: 8, padding: 10 }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: opts.maxY,
            grid: { color: gridColor, drawBorder: false },
            ticks: { font, color: tickColor },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: { font, color: tickColor },
            border: { display: false },
          }
        },
        borderRadius: 6,
        ...opts.extra
      }
    });
    return instances[id];
  }

  /** Doughnut / Pie */
  function doughnut(id, labels, data, colors, opts = {}) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;
    instances[id] = new Chart(ctx, {
      type: opts.pie ? 'pie' : 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 3, borderColor: 'var(--card-bg)', hoverOffset: 8 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: opts.pie ? 0 : '65%',
        plugins: {
          legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font, color: tickColor } },
          tooltip: { backgroundColor: tooltipBg, titleFont: { ...font, weight: '600' }, bodyFont: font, cornerRadius: 8, padding: 10 }
        }
      }
    });
    return instances[id];
  }

  /** Radar Chart */
  function radar(id, labels, datasets, opts = {}) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;
    instances[id] = new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font, color: tickColor } },
          tooltip: { backgroundColor: tooltipBg, bodyFont: font, cornerRadius: 8, padding: 10 }
        },
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: { font: { ...font, size: 10 }, color: tickColor },
            ticks: { display: false }
          }
        }
      }
    });
    return instances[id];
  }

  /** Horizontal Bar */
  function horizontalBar(id, labels, data, colors, opts = {}) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;
    instances[id] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderRadius: 6, borderWidth: 0 }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: tooltipBg, bodyFont: font, cornerRadius: 8, padding: 10 }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: opts.maxX || 100,
            grid: { color: gridColor, drawBorder: false },
            ticks: { font, color: tickColor },
            border: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: { font, color: tickColor },
            border: { display: false }
          }
        }
      }
    });
    return instances[id];
  }

  /** Area Chart (line with fill) */
  function area(id, labels, data, color, opts = {}) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;

    let gradient = color;
    if (ctx.createLinearGradient) {
      gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.3)'));
      gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.0)'));
    }

    instances[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: opts.label || 'Value',
          data,
          borderColor: color,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: tooltipBg, titleFont: { ...font, size: 12, weight: '600' }, bodyFont: font, cornerRadius: 8, padding: 10 }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: opts.maxY,
            grid: { color: gridColor, drawBorder: false },
            ticks: { font, color: tickColor, stepSize: opts.stepY },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: { font, color: tickColor },
            border: { display: false },
          }
        }
      }
    });
    return instances[id];
  }

  /** Sparkline */
  function sparkline(id, data, color) {
    destroyIfExists(id);
    const ctx = getCtx(id);
    if (!ctx) return;
    
    let gradient = color;
    if (ctx.createLinearGradient) {
      gradient = ctx.createLinearGradient(0, 0, 0, 50);
      gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
      gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.0)'));
    }

    instances[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false, beginAtZero: false }
        },
        layout: { padding: 0 }
      }
    });
    return instances[id];
  }

  function destroy(id) {
    destroyIfExists(id);
  }

  return { line, bar, doughnut, radar, horizontalBar, area, sparkline, destroy };
})();

window.Charts = Charts;
