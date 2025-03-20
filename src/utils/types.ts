
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  logoUrl?: string;
}

export interface PortfolioHolding {
  stockId: string;
  symbol: string;
  name: string;
  shares: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
}

export interface Portfolio {
  cash: number;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
}

export interface TradeOrder {
  type: 'buy' | 'sell';
  stockId: string;
  shares: number;
  price: number;
  total: number;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  portfolio: Portfolio;
  trades: TradeOrder[];
  joinedAt: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

export interface StockWithHistory extends Stock {
  priceHistory: PriceHistoryPoint[];
}
