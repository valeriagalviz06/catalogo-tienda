export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) || 0);
