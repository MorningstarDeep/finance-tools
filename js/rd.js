/* ================================================
   rd.js — Recurring Deposit Calculator
   Finance Tools India
   ================================================ */

'use strict';

const fmtINR = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

/**
 * RD Maturity = R × [(1+i)^n − 1] / (1 − (1+i)^(-1/3))
 * where i = quarterly rate = annual_rate / 4 / 100
 *       n = number of quarters
 * This is the formula used by Indian banks for RD calculation.
 *
 * Alternative (sum of each instalment's compound growth):
 * Each month's deposit grows for its remaining tenure.
 * M = Σ R × (1 + i)^(remaining_quarters) for each instalment
 */
function calcRDMaturity(monthlyDeposit, annualRate, tenureMonths) {
  const i = annualRate / 4 / 100;  // quarterly interest rate
  let maturity = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    // Each instalment compounds for (tenureMonths - month + 1) months
    // expressed in quarters: remainingMonths / 3
    const remainingMonths   = tenureMonths - month + 1;
    const remainingQuarters = remainingMonths / 3;
    maturity += monthlyDeposit * Math.pow(1 + i, remainingQuarters);
  }

  return maturity;
}

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('rd-form');
  const resultBox = document.getElementById('rd-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const R         = parseFloat(document.getElementById('rd-monthly').value);
    let   rate      = parseFloat(document.getElementById('rd-rate').value);
    const months    = parseInt(document.getElementById('rd-tenure').value, 10);
    const isSenior  = document.getElementById('rd-senior').checked;

    if (!R || !rate || !months || R <= 0 || rate <= 0 || months < 6) {
      alert('Please fill in all fields. Minimum tenure is 6 months.');
      return;
    }

    if (isSenior) rate += 0.50;

    const maturity  = calcRDMaturity(R, rate, months);
    const invested  = R * months;
    const interest  = maturity - invested;

    document.getElementById('res-rd-maturity').textContent  = fmtINR(maturity);
    document.getElementById('res-rd-interest').textContent  = fmtINR(interest);
    document.getElementById('res-rd-invested').textContent  = fmtINR(invested);
    document.getElementById('res-rd-rate').textContent      = rate.toFixed(2) + '% p.a.';

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('rd-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
