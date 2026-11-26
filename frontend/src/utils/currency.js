/**
 * Format angka ke mata uang Rupiah (contoh: "Rp 150.000")
 * @param {number|string|null} amount 
 * @returns {string}
 */
export function formatRupiah(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return 'Tanpa nominal';
  }

  const numericValue = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(numericValue)) {
    return 'Tanpa nominal';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
}
