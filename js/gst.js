/* ================================================
   gst.js — GST Calculator Logic
   Finance Tools India
   ================================================ */

'use strict';

const fmt = (n) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('gst-form');
  const resultBox   = document.getElementById('gst-result');
  const rateSelect  = document.getElementById('gst-rate');
  const customGroup = document.getElementById('custom-rate-group');

  // Show/hide custom rate input
  rateSelect.addEventListener('change', () => {
    customGroup.style.display = rateSelect.value === 'custom' ? 'block' : 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount  = parseFloat(document.getElementById('base-amount').value);
    const type    = document.getElementById('gst-type').value;

    let rate;
    if (rateSelect.value === 'custom') {
      rate = parseFloat(document.getElementById('custom-rate').value);
    } else {
      rate = parseFloat(rateSelect.value);
    }

    if (!amount || isNaN(rate) || amount <= 0 || rate <= 0) {
      alert('Please enter a valid amount and select a GST rate.');
      return;
    }

    let preGst, gstAmount, invoiceTotal;

    if (type === 'exclusive') {
      // GST added on top of the entered amount
      preGst       = amount;
      gstAmount    = (amount * rate) / 100;
      invoiceTotal = amount + gstAmount;
    } else {
      // Extract GST from the inclusive amount
      invoiceTotal = amount;
      preGst       = amount / (1 + rate / 100);
      gstAmount    = invoiceTotal - preGst;
    }

    const half = gstAmount / 2;

    document.getElementById('res-gst-total').textContent = fmt(gstAmount);
    document.getElementById('res-cgst').textContent      = fmt(half);
    document.getElementById('res-sgst').textContent      = fmt(half);
    document.getElementById('res-pre-gst').textContent   = fmt(preGst);
    document.getElementById('res-invoice').textContent   = fmt(invoiceTotal);

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('gst-reset').addEventListener('click', () => {
    resultBox.classList.remove('visible');
    customGroup.style.display = 'none';
  });
});
