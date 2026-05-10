// Financial number formatting utilities for asset management

export const formatCurrency = (value: number, currency: string = 'USD', decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPrice = (value: number, currency: string = 'USD'): string => {
  return formatCurrency(value, currency, 4);
};

export const formatNAVPerShare = (value: number, currency: string = 'USD'): string => {
  return formatCurrency(value, currency, 4);
};

export const formatShares = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number, showSign: boolean = true): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(2)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-');
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, '-');
  const timeStr = d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${dateStr} ${timeStr} GMT`;
};

export const formatTimeAgo = (minutes: number): string => {
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// Tabular number alignment CSS value
export const tabularNums = { fontVariantNumeric: 'tabular-nums' as const };
