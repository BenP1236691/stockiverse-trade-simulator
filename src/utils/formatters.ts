
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatShares = (shares: number): string => {
  return shares === 1 ? '1 share' : `${formatNumber(shares)} shares`;
};

export const formatPercent = (value: number): string => {
  return `${(value >= 0 ? '+' : '')}${value.toFixed(2)}%`;
};

export const formatChange = (value: number): string => {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${formatCurrency(value)}`;
};

export const formatMarketCap = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else {
    return formatCurrency(value);
  }
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};
