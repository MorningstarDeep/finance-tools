/* ================================================
   emi.js — EMI Calculator Logic
   Finance Tools India
   ================================================ */

'use strict';

const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

function calculateEMI(principal, annualRate, months) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) /
         (Math.pow(1 + r, months) - 1);
}

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('emi-form');
  const resultBox = document.getElementById('emi-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const principal   = parseFloat(document.getElementById('loan-amount').value);
    const annualRate  = parseFloat(document.getElementById('interest-rate').value);
    const tenureVal   = parseFloat(document.getElementById('loan-tenure').value);
    const tenureType  = document.getElementById('tenure-type').value;

    if (!principal || !annualRate || !tenureVal ||
        principal <= 0 || annualRate <= 0 || tenureVal <= 0) {
      alert('Please fill in all fields with valid positive numbers.');
      return;
    }

    const months      = tenureType === 'years' ? tenureVal * 12 : tenureVal;
    const emi         = calculateEMI(principal, annualRate, months);
    const totalPaid   = emi * months;
    const totalInt    = totalPaid - principal;

    document.getElementById('res-emi').textContent       = fmt(emi);
    document.getElementById('res-interest').textContent  = fmt(totalInt);
    document.getElementById('res-total').textContent     = fmt(totalPaid);
    document.getElementById('res-principal').textContent = fmt(principal);

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('emi-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
