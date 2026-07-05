/* =============================================
   NETRA — UTILITIES
   ============================================= */
'use strict';

const Utils = (() => {

  /** Format number with locale */
  function fmt(n) {
    return typeof n === 'number' ? n.toLocaleString('en-IN') : n;
  }

  /** Get current date/time strings */
  function getDateStrings() {
    const now = new Date();
    const dateMain = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const dayName  = now.toLocaleDateString('en-IN', { weekday: 'long' });
    const time     = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { dateMain, dayName, time };
  }

  /** Greeting based on hour */
  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  /** Debounce */
  function debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  /** Animate counter from 0 to target */
  function animateCounter(el, target, duration = 1200, prefix = '', suffix = '') {
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    const step = (ts) => {
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const val  = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = prefix + val + suffix;
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** Generate random int in [min, max] */
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Clamp value */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /** Element helper */
  function qs(sel, ctx = document)  { return ctx.querySelector(sel); }
  function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

  /** Show/hide helper */
  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }

  /** Create element */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /** Local storage helpers */
  const storage = {
    get: (key, def) => {
      try { const v = localStorage.getItem('netra_' + key); return v ? JSON.parse(v) : def; } catch { return def; }
    },
    set: (key, val) => {
      try { localStorage.setItem('netra_' + key, JSON.stringify(val)); } catch {}
    }
  };

  /** Toast notification */
  function toast(msg, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }
    const colors = { info: '#2563eb', success: '#16a34a', warning: '#f59e0b', error: '#ef4444' };
    const icons  = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const t = document.createElement('div');
    t.style.cssText = `background:${colors[type]};color:#fff;padding:12px 18px;border-radius:10px;font-size:13px;font-weight:600;font-family:Inter,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;gap:8px;animation:slideInRight 0.3s ease both;max-width:320px;`;
    t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, duration);
  }

  return { fmt, getDateStrings, getGreeting, debounce, animateCounter, randInt, clamp, qs, qsa, show, hide, el, storage, toast };
})();

window.Utils = Utils;
