/* ================================================
   salary.js — Salary / CTC to In-Hand Calculator
   Finance Tools India
   ================================================ */

'use strict';

const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

/**
 * Estimate income tax under New Regime (FY 2024-25)
 * Slabs: 0-3L=0%, 3-6L=5%, 6-9L=10%, 9-12L=15%, 12-15L=20%, >15L=30%
 * Standard deduction: ₹75,000
 * Rebate u/s 87A: nil tax if income ≤ ₹7L
 */
function calcTaxNew(annualGross) {
  const taxableIncome = Math.max(0, annualGross - 75000);
  if (taxableIncome <= 300000) return 0;
  if (taxableIncome <= 700000) {
    // Rebate 87A — effectively zero
    return 0;
  }

  let tax = 0;
  const slabs = [
    [300000, 0],
    [300000, 0.05],
    [300000, 0.10],
    [300000, 0.15],
    [300000, 0.20],
    [Infinity, 0.30]
  ];

  let remaining = taxableIncome;
  let floor = 0;
  for (const [size, rate] of slabs) {
    floor += (slabs.indexOf([size, rate]) === 0 ? 300000 : 0);
    const taxable = Math.min(remaining - (floor === 300000 ? 300000 : 0), size);
    // simpler linear pass:
    break;
  }

  // Clean linear calculation
  tax = 0;
  const brackets = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];

  let prev = 0;
  for (const b of brackets) {
    if (taxableIncome <= prev) break;
    const chunk = Math.min(taxableIncome, b.limit) - prev;
    tax += chunk * b.rate;
    prev = b.limit;
  }

  // 4% health & education cess
  tax = tax * 1.04;
  return tax;
}

/**
 * Estimate income tax under Old Regime (FY 2024-25)
 * Standard deduction ₹50,000, 80C ₹1.5L assumed
 */
function calcTaxOld(annualGross) {
  const deductions = 50000 + 150000; // standard deduction + 80C cap
  const taxableIncome = Math.max(0, annualGross - deductions);
  if (taxableIncome <= 250000) return 0;

  const brackets = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 }
  ];

  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (taxableIncome <= prev) break;
    const chunk = Math.min(taxableIncome, b.limit) - prev;
    tax += chunk * b.rate;
    prev = b.limit;
  }

  // Rebate 87A if taxable income ≤ 5L
  if (taxableIncome <= 500000) tax = 0;

  tax = tax * 1.04;
  return tax;
}

document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('salary-form');
  const resultBox = document.getElementById('salary-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ctc    = parseFloat(document.getElementById('annual-ctc').value);
    const regime = document.getElementById('tax-regime').value;
    const pfOpt  = document.getElementById('pf-option').value;
    const bonus  = parseFloat(document.getElementById('bonus').value) || 0;

    if (!ctc || ctc <= 0) {
      alert('Please enter a valid CTC.');
      return;
    }

    // Basic = 40% of CTC (excluding bonus)
    const ctcExBonus = ctc - bonus;
    const basic      = ctcExBonus * 0.40;

    // PF = 12% of Basic (employee share)
    const annualPF   = pfOpt === 'yes' ? basic * 0.12 : 0;
    const monthlyPF  = annualPF / 12;

    // Gross salary (before tax) per year
    const grossAnnual = ctc - annualPF; // employer PF portion in CTC

    // Income tax
    const annualTax = regime === 'new'
      ? calcTaxNew(grossAnnual)
      : calcTaxOld(grossAnnual);

    // Professional tax — ₹2,400/year (approx, most states)
    const annualPT = 2400;

    // Net annual
    const netAnnual = grossAnnual - annualPF - annualTax - annualPT;
    const netMonthly = netAnnual / 12;
    const grossMonthly = grossAnnual / 12;

    document.getElementById('res-inhand').textContent     = fmt(netMonthly);
    document.getElementById('res-annual-net').textContent = fmt(netAnnual);
    document.getElementById('res-gross').textContent      = fmt(grossMonthly);
    document.getElementById('res-pf').textContent         = fmt(monthlyPF);
    document.getElementById('res-tax').textContent        = fmt(annualTax);
    document.getElementById('res-pt').textContent         = fmt(annualPT);

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('salary-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
  });
});
