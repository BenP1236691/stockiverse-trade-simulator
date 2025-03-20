import { Stock, StockWithHistory, PriceHistoryPoint } from './types';
import { initialStocksWithHistory } from './stocksData';

interface SimulationOptions {
  volatilityFactor: number;
  updateInterval: number;
  marketTrend: number;
  sectorCorrelation: number;
}

class SimulationEngine {
  private stocks: StockWithHistory[];
  private subscribers: Set<(stocks: StockWithHistory[]) => void>;
  private intervalId: number | null;
  private options: SimulationOptions;
  private lastUpdateTime: number;

  constructor() {
    this.stocks = [...initialStocksWithHistory];
    this.subscribers = new Set();
    this.intervalId = null;
    this.lastUpdateTime = Date.now();
    
    // Default simulation options
    this.options = {
      volatilityFactor: 0.015, // Max 1.5% change in each update
      updateInterval: 5000,    // 5 seconds
      marketTrend: 0.001,      // Slight upward bias (0.1%)
      sectorCorrelation: 0.6   // 60% correlation within sectors
    };
  }

  // Start the simulation
  start(): void {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => this.updatePrices(), this.options.updateInterval);
      console.log('Simulation started');
    }
  }

  // Stop the simulation
  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Simulation stopped');
    }
  }

  // Subscribe to stock updates
  subscribe(callback: (stocks: StockWithHistory[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Immediately send current state
    callback([...this.stocks]);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Get current stocks
  getStocks(): StockWithHistory[] {
    return [...this.stocks];
  }

  // Get a specific stock by ID
  getStockById(id: string): StockWithHistory | undefined {
    return this.stocks.find(stock => stock.id === id);
  }

  // Get a specific stock by symbol
  getStockBySymbol(symbol: string): StockWithHistory | undefined {
    return this.stocks.find(stock => stock.symbol === symbol);
  }

  // Update simulation options
  updateOptions(newOptions: Partial<SimulationOptions>): void {
    this.options = { ...this.options, ...newOptions };
    
    // If update interval changed and simulation is running, restart it
    if (newOptions.updateInterval && this.intervalId !== null) {
      this.stop();
      this.start();
    }
  }

  // Private method to update stock prices
  private updatePrices(): void {
    const now = Date.now();
    
    // Generate market movement (-1 to 1)
    const marketMovement = (Math.random() * 2 - 1) + this.options.marketTrend;
    
    // Generate sector movements
    const sectorMovements: Record<string, number> = {};
    const sectors = Array.from(new Set(this.stocks.map(stock => stock.sector)));
    
    sectors.forEach(sector => {
      // Sector movement is partially correlated with market, partially random
      sectorMovements[sector] = 
        marketMovement * this.options.sectorCorrelation + 
        (Math.random() * 2 - 1) * (1 - this.options.sectorCorrelation);
    });
    
    // Update each stock
    this.stocks = this.stocks.map(stock => {
      // Previous price becomes the current price
      const previousPrice = stock.price;
      
      // Calculate new price based on volatility, market and sector influence
      const change = (
        // Individual stock movement
        (Math.random() * 2 - 1) * this.options.volatilityFactor * previousPrice * 0.4 +
        // Sector influence
        sectorMovements[stock.sector] * this.options.volatilityFactor * previousPrice * 0.4 +
        // Market influence
        marketMovement * this.options.volatilityFactor * previousPrice * 0.2
      );
      
      const newPrice = Math.max(1, previousPrice + change); // Ensure price doesn't go below $1
      const priceChange = newPrice - previousPrice;
      const priceChangePercent = (priceChange / previousPrice) * 100;
      
      // Create a new price history point
      const newHistoryPoint: PriceHistoryPoint = {
        timestamp: now,
        price: newPrice
      };
      
      // Add new price point to history and keep last 25 points (24 hours + current)
      const updatedPriceHistory = [...stock.priceHistory, newHistoryPoint];
      if (updatedPriceHistory.length > 25) {
        updatedPriceHistory.shift();
      }
      
      // Create updated stock
      return {
        ...stock,
        price: newPrice,
        previousPrice,
        change: priceChange,
        changePercent: priceChangePercent,
        priceHistory: updatedPriceHistory
      };
    });
    
    // Notify subscribers
    this.notifySubscribers();
    this.lastUpdateTime = now;
  }
  
  // Notify all subscribers with updated stocks
  private notifySubscribers(): void {
    const stocksCopy = [...this.stocks];
    this.subscribers.forEach(callback => {
      try {
        callback(stocksCopy);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }
}

// Create and export a singleton instance
export const simulationEngine = new SimulationEngine();
