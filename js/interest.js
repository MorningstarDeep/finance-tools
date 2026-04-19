/* ================================================
   interest.js — Simple Interest Calculator
   Calculate Your Finance
   ================================================ */

'use strict';

const fmtINR = (n) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('interest-form');
  const resultBox = document.getElementById('interest-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const P        = parseFloat(document.getElementById('principal').value);
    const R        = parseFloat(document.getElementById('si-rate').value);
    const timeVal  = parseFloat(document.getElementById('si-time').value);
    const timeUnit = document.getElementById('si-time-unit').value;

    if (!P || !R || !timeVal || P <= 0 || R <= 0 || timeVal <= 0) {
      alert('Please fill in all fields with valid positive numbers.');
      return;
    }

    // Convert time to years
    let T;
    if (timeUnit === 'years')  T = timeVal;
    else if (timeUnit === 'months') T = timeVal / 12;
    else T = timeVal / 365;   // days

    const SI    = (P * R * T) / 100;
    const total = P + SI;

    document.getElementById('res-si').textContent           = fmtINR(SI);
    document.getElementById('res-si-total').textContent     = fmtINR(total);
    document.getElementById('res-si-principal').textContent = fmtINR(P);
    document.getElementById('res-si-rate').textContent      = R.toFixed(2) + '% p.a.';

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('interest-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
