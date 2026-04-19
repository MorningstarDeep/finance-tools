/* ================================================
   fd.js — Fixed Deposit Calculator
   Calculate Your Finance
   ================================================ */

'use strict';

const fmtINR = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('fd-form');
  const resultBox = document.getElementById('fd-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const P           = parseFloat(document.getElementById('fd-amount').value);
    let   rate        = parseFloat(document.getElementById('fd-rate').value);
    const tenureVal   = parseFloat(document.getElementById('fd-tenure').value);
    const tenureUnit  = document.getElementById('fd-tenure-unit').value;
    const payout      = document.getElementById('fd-payout').value;
    const isSenior    = document.getElementById('fd-senior').checked;

    if (!P || !rate || !tenureVal || P <= 0 || rate <= 0 || tenureVal <= 0) {
      alert('Please fill in all fields with valid positive numbers.');
      return;
    }

    // Senior citizen bonus
    if (isSenior) rate += 0.50;

    // Convert tenure to years
    const t = tenureUnit === 'years' ? tenureVal : tenureVal / 12;

    let maturity, interest, periodicPayout;

    if (payout === 'cumulative') {
      // Quarterly compounding: A = P * (1 + r/4)^(4*t)
      maturity       = P * Math.pow(1 + (rate / 100) / 4, 4 * t);
      interest       = maturity - P;
      periodicPayout = null;
    } else if (payout === 'quarterly') {
      // Simple interest per quarter, paid out
      const quarterlyRate = rate / 4 / 100;
      periodicPayout = P * quarterlyRate;
      interest       = periodicPayout * Math.round(t * 4);
      maturity       = P; // principal returned at end
    } else {
      // Monthly payout: SI per month
      const monthlyRate = rate / 12 / 100;
      periodicPayout = P * monthlyRate;
      interest       = periodicPayout * Math.round(t * 12);
      maturity       = P;
    }

    document.getElementById('res-fd-maturity').textContent  = fmtINR(maturity + (payout !== 'cumulative' ? 0 : 0));
    document.getElementById('res-fd-interest').textContent  = fmtINR(interest);
    document.getElementById('res-fd-invested').textContent  = fmtINR(P);
    document.getElementById('res-fd-rate').textContent      = rate.toFixed(2) + '% p.a.';
    document.getElementById('res-fd-payout').textContent    =
      periodicPayout ? fmtINR(periodicPayout) + ' / ' + (payout === 'quarterly' ? 'qtr' : 'mo') : 'At Maturity';

    // For cumulative, maturity already includes principal
    if (payout === 'cumulative') {
      document.getElementById('res-fd-maturity').textContent = fmtINR(maturity);
    } else {
      document.getElementById('res-fd-maturity').textContent = fmtINR(P + interest);
    }

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('fd-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
