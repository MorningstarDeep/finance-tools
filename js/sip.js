/* ================================================
   sip.js — SIP Calculator Logic
   Calculate Your Finance
   ================================================ */

'use strict';

const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

function calculateSIP(monthly, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('sip-form');
  const resultBox = document.getElementById('sip-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const monthly    = parseFloat(document.getElementById('monthly-investment').value);
    const annualRate = parseFloat(document.getElementById('sip-rate').value);
    const years      = parseFloat(document.getElementById('sip-duration').value);

    if (!monthly || !annualRate || !years ||
        monthly <= 0 || annualRate <= 0 || years <= 0) {
      alert('Please fill in all fields with valid positive numbers.');
      return;
    }

    const futureValue = calculateSIP(monthly, annualRate, years);
    const invested    = monthly * years * 12;
    const gain        = futureValue - invested;
    const roi         = ((gain / invested) * 100).toFixed(1) + '%';

    document.getElementById('res-future').textContent   = fmt(futureValue);
    document.getElementById('res-invested').textContent = fmt(invested);
    document.getElementById('res-gain').textContent     = fmt(gain);
    document.getElementById('res-roi').textContent      = roi;

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('sip-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
