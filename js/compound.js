/* ================================================
   compound.js — Compound Interest Calculator
   Finance Tools India
   ================================================ */

'use strict';

const fmtINR = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('compound-form');
  const resultBox = document.getElementById('compound-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const P = parseFloat(document.getElementById('ci-principal').value);
    const r = parseFloat(document.getElementById('ci-rate').value);
    const t = parseFloat(document.getElementById('ci-time').value);
    const n = parseFloat(document.getElementById('ci-frequency').value);

    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) {
      alert('Please fill in all fields with valid positive numbers.');
      return;
    }

    const rate = r / 100;

    // A = P * (1 + r/n)^(n*t)
    const A  = P * Math.pow(1 + rate / n, n * t);
    const CI = A - P;

    // Effective Annual Rate (EAR) = (1 + r/n)^n − 1
    const EAR = (Math.pow(1 + rate / n, n) - 1) * 100;

    // Simple interest for comparison
    const SI = (P * r * t) / 100;
    const extraOverSI = CI - SI;

    document.getElementById('res-ci-total').textContent     = fmtINR(A);
    document.getElementById('res-ci').textContent           = fmtINR(CI);
    document.getElementById('res-ci-principal').textContent = fmtINR(P);
    document.getElementById('res-ci-ear').textContent       = EAR.toFixed(2) + '% p.a.';
    document.getElementById('res-ci-vs-si').textContent     = '+' + fmtINR(extraOverSI) + ' extra';

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('compound-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
