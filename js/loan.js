/* ================================================
   loan.js — Loan Eligibility Calculator Logic
   Finance Tools India
   ================================================ */

'use strict';

const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

/**
 * Calculate maximum loan principal from an affordable EMI.
 * P = EMI × [(1+r)^n − 1] / [r × (1+r)^n]
 */
function loanFromEMI(emi, annualRate, years) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (r === 0) return emi * n;
  return emi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
}

/**
 * Back-calculate total payment (to find interest).
 */
function totalPayment(emi, years) {
  return emi * years * 12;
}

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('loan-form');
  const resultBox = document.getElementById('loan-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const netSalary  = parseFloat(document.getElementById('net-salary').value);
    const expenses   = parseFloat(document.getElementById('monthly-expenses').value) || 0;
    const annualRate = parseFloat(document.getElementById('loan-interest').value);
    const years      = parseFloat(document.getElementById('loan-period').value);

    if (!netSalary || !annualRate || !years ||
        netSalary <= 0 || annualRate <= 0 || years <= 0) {
      alert('Please fill in all fields with valid positive numbers.');
      return;
    }

    // FOIR cap: 50% of net salary → max total EMI obligation
    const maxTotalEMI = netSalary * 0.50;

    // Disposable after existing expenses
    const disposable = netSalary - expenses;

    if (disposable <= 0) {
      alert('Your expenses exceed your salary. No loan eligibility.');
      return;
    }

    // Eligible new EMI = min(disposable, max-total-emi − expenses)
    const eligibleEMI = Math.min(disposable, maxTotalEMI - expenses);

    if (eligibleEMI <= 0) {
      alert('Your existing expenses are too high for additional loan eligibility.');
      return;
    }

    const maxLoan    = loanFromEMI(eligibleEMI, annualRate, years);
    const totalPaid  = totalPayment(eligibleEMI, years);
    const totalInt   = totalPaid - maxLoan;

    document.getElementById('res-max-loan').textContent    = fmt(maxLoan);
    document.getElementById('res-emi-cap').textContent     = fmt(eligibleEMI);
    document.getElementById('res-disposable').textContent  = fmt(disposable);
    document.getElementById('res-total-interest').textContent = fmt(totalInt);

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('loan-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
