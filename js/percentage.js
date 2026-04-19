/* ================================================
   percentage.js — Percentage Calculator (4 modes)
   Calculate Your Finance
   ================================================ */

'use strict';

const round2 = (n) => Math.round(n * 100) / 100;
const fmt    = (n) => round2(n).toLocaleString('en-IN');

document.addEventListener('DOMContentLoaded', () => {

  /* ---- TAB SWITCHING ---- */
  const tabs   = document.querySelectorAll('.calc-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach((p) => {
        p.style.display = p.id === `panel-${mode}` ? 'block' : 'none';
        p.classList.toggle('active', p.id === `panel-${mode}`);
      });

      // Hide all result boxes on switch
      document.querySelectorAll('.result-box').forEach((b) => b.classList.remove('visible'));
    });
  });

  /* ---- MODE 1: X% of Y ---- */
  document.getElementById('form-of').addEventListener('submit', (e) => {
    e.preventDefault();
    const pct = parseFloat(document.getElementById('of-percent').value);
    const num = parseFloat(document.getElementById('of-number').value);

    if (isNaN(pct) || isNaN(num)) { alert('Please enter valid numbers.'); return; }

    const result    = (pct / 100) * num;
    const remaining = num - result;

    document.getElementById('res-of-result').textContent    = fmt(result);
    document.getElementById('res-of-remaining').textContent = fmt(remaining);
    document.getElementById('result-of').classList.add('visible');
  });

  /* ---- MODE 2: Percentage Change ---- */
  document.getElementById('form-change').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldVal = parseFloat(document.getElementById('change-old').value);
    const newVal = parseFloat(document.getElementById('change-new').value);

    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) { alert('Please enter valid numbers. Old value cannot be zero.'); return; }

    const change  = newVal - oldVal;
    const pct     = (change / Math.abs(oldVal)) * 100;
    const dir     = change >= 0 ? '▲ Increase' : '▼ Decrease';

    document.getElementById('res-change-pct').textContent = (pct >= 0 ? '+' : '') + fmt(pct) + '%';
    document.getElementById('res-change-abs').textContent = (change >= 0 ? '+' : '') + fmt(change);
    document.getElementById('res-change-dir').textContent = dir;
    document.getElementById('result-change').classList.add('visible');
  });

  /* ---- MODE 3: X is what % of Y ---- */
  document.getElementById('form-what').addEventListener('submit', (e) => {
    e.preventDefault();
    const x = parseFloat(document.getElementById('what-x').value);
    const y = parseFloat(document.getElementById('what-y').value);

    if (isNaN(x) || isNaN(y) || y === 0) { alert('Please enter valid numbers. Total (Y) cannot be zero.'); return; }

    const pct = (x / y) * 100;
    const rem = 100 - pct;

    document.getElementById('res-what-pct').textContent = fmt(pct) + '%';
    document.getElementById('res-what-rem').textContent = fmt(rem) + '%';
    document.getElementById('result-what').classList.add('visible');
  });

  /* ---- MODE 4: Reverse percentage ---- */
  document.getElementById('form-reverse').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = parseFloat(document.getElementById('rev-value').value);
    const pct = parseFloat(document.getElementById('rev-percent').value);

    if (isNaN(val) || isNaN(pct) || pct === 0) { alert('Please enter valid numbers. Percentage cannot be zero.'); return; }

    const original = (val / pct) * 100;
    const verify   = fmt(pct) + '% of ' + fmt(original) + ' = ' + fmt(val);

    document.getElementById('res-rev-original').textContent = fmt(original);
    document.getElementById('res-rev-verify').textContent   = verify;
    document.getElementById('result-reverse').classList.add('visible');
  });

  /* Reset buttons clear result boxes */
  document.querySelectorAll('button[type="reset"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // find closest result-box sibling
      const card = btn.closest('.calc-card');
      if (card) card.querySelectorAll('.result-box').forEach((r) => r.classList.remove('visible'));
    });
  });
});
