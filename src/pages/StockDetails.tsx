
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Building,
  BarChart4,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import PriceChart from '@/components/PriceChart';
import TradeForm from '@/components/TradeForm';
import { simulationEngine } from '@/utils/simulationEngine';
import { formatCurrency, formatPercent, formatMarketCap, formatNumber } from '@/utils/formatters';
import { StockWithHistory, TradeOrder, Portfolio, PortfolioHolding } from '@/utils/types';

const StockDetails: React.FC = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockWithHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 100000,
    holdings: [],
    totalValue: 100000,
    totalGain: 0,
    totalGainPercent: 0
  });
  const [trades, setTrades] = useState<TradeOrder[]>([]);
  
  // Load portfolio and trades from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    const savedTrades = localStorage.getItem('trades');
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);
  
  // Save portfolio changes to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);
  
  // Save trades to localStorage
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);
  
  // Initialize and subscribe to stock updates
  useEffect(() => {
    // Start simulation engine if not already started
    simulationEngine.start();
    
    if (!stockId) {
      navigate('/dashboard');
      return;
    }
    
    // Get initial stock data
    const initialStock = simulationEngine.getStockById(stockId);
    if (!initialStock) {
      navigate('/dashboard');
      return;
    }
    
    setStock(initialStock);
    setLoading(false);
    
    // Subscribe to stock updates
    const unsubscribe = simulationEngine.subscribe((updatedStocks) => {
      const updatedStock = updatedStocks.find(s => s.id === stockId);
      if (updatedStock) {
        setStock(updatedStock);
        
        // Update portfolio with new stock prices
        setPortfolio(prev => {
          const updatedHoldings = prev.holdings.map(holding => {
            const stock = updatedStocks.find(s => s.id === holding.stockId);
            if (!stock) return holding;
            
            const currentPrice = stock.price;
            const totalValue = holding.shares * currentPrice;
            const totalGain = totalValue - (holding.averageBuyPrice * holding.shares);
            const totalGainPercent = (totalGain / (holding.averageBuyPrice * holding.shares)) * 100;
            
            return {
              ...holding,
              currentPrice,
              totalValue,
              totalGain,
              totalGainPercent
            };
          });
          
          const totalStockValue = updatedHoldings.reduce((sum, h) => sum + h.totalValue, 0);
          const totalValue = totalStockValue + prev.cash;
          const totalGain = totalValue - 100000; // Initial cash
          const totalGainPercent = (totalGain / 100000) * 100;
          
          return {
            ...prev,
            holdings: updatedHoldings,
            totalValue,
            totalGain,
            totalGainPercent
          };
        });
      }
    });
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [stockId, navigate]);
  
  // Handle trading
  const handleTrade = (order: TradeOrder) => {
    // Add trade to history
    setTrades(prev => [...prev, order]);
    
    // Update portfolio
    setPortfolio(prev => {
      let updatedCash = prev.cash;
      let updatedHoldings = [...prev.holdings];
      
      // Find existing holding for this stock
      const holdingIndex = updatedHoldings.findIndex(h => h.stockId === order.stockId);
      
      if (order.type === 'buy') {
        // Deduct cash
        updatedCash -= order.total;
        
        if (holdingIndex >= 0) {
          // Update existing holding
          const holding = updatedHoldings[holdingIndex];
          const newShares = holding.shares + order.shares;
          const newAverageBuyPrice = (
            (holding.shares * holding.averageBuyPrice) + 
            (order.shares * order.price)
          ) / newShares;
          
          updatedHoldings[holdingIndex] = {
            ...holding,
            shares: newShares,
            averageBuyPrice: newAverageBuyPrice,
            totalValue: newShares * order.price,
            totalGain: (newShares * order.price) - (newShares * newAverageBuyPrice),
            totalGainPercent: (
              ((newShares * order.price) - (newShares * newAverageBuyPrice)) / 
              (newShares * newAverageBuyPrice)
            ) * 100
          };
        } else {
          // Create new holding
          const newHolding: PortfolioHolding = {
            stockId: order.stockId,
            symbol: stock!.symbol,
            name: stock!.name,
            shares: order.shares,
            averageBuyPrice: order.price,
            currentPrice: order.price,
            totalValue: order.shares * order.price,
            totalGain: 0,
            totalGainPercent: 0
          };
          
          updatedHoldings.push(newHolding);
        }
      } else if (order.type === 'sell') {
        // Add cash
        updatedCash += order.total;
        
        if (holdingIndex >= 0) {
          const holding = updatedHoldings[holdingIndex];
          const newShares = holding.shares - order.shares;
          
          if (newShares <= 0) {
            // Remove holding if no shares left
            updatedHoldings = updatedHoldings.filter(h => h.stockId !== order.stockId);
          } else {
            // Update holding
            updatedHoldings[holdingIndex] = {
              ...holding,
              shares: newShares,
              totalValue: newShares * order.price,
              totalGain: (newShares * order.price) - (newShares * holding.averageBuyPrice),
              totalGainPercent: (
                ((newShares * order.price) - (newShares * holding.averageBuyPrice)) / 
                (newShares * holding.averageBuyPrice)
              ) * 100
            };
          }
        }
      }
      
      // Calculate new total value
      const totalStockValue = updatedHoldings.reduce((sum, h) => sum + h.totalValue, 0);
      const totalValue = totalStockValue + updatedCash;
      const totalGain = totalValue - 100000; // Initial cash
      const totalGainPercent = (totalGain / 100000) * 100;
      
      return {
        cash: updatedCash,
        holdings: updatedHoldings,
        totalValue,
        totalGain,
        totalGainPercent
      };
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-[300px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!stock) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-semibold mb-4">Stock Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The stock you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const isPositive = stock.change >= 0;
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-2 -ml-3">
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary">
                  <span className="font-semibold">{stock.symbol}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-semibold">{stock.name}</h1>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{stock.symbol}</Badge>
                    <Badge className="bg-secondary">{stock.sector}</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-semibold mb-1">
                {formatCurrency(stock.price)}
              </div>
              <div className="flex items-center justify-end space-x-2">
                <div className={`flex items-center ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  <span>{formatCurrency(stock.change)}</span>
                </div>
                <div className={isPositive ? 'text-success' : 'text-destructive'}>
                  ({formatPercent(stock.changePercent)})
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <PriceChart 
              data={stock.priceHistory} 
              currentPrice={stock.price} 
              previousPrice={stock.previousPrice} 
            />
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Company Overview</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Building size={12} className="mr-1" />
                      Market Cap
                    </div>
                    <div className="font-medium">{formatMarketCap(stock.marketCap)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Activity size={12} className="mr-1" />
                      Volume
                    </div>
                    <div className="font-medium">{formatNumber(stock.volume)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <BarChart4 size={12} className="mr-1" />
                      Sector
                    </div>
                    <div className="font-medium">{stock.sector}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock size={12} className="mr-1" />
                      Last Update
                    </div>
                    <div className="font-medium">
                      {new Date(stock.priceHistory[stock.priceHistory.length - 1].timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm text-muted-foreground">
                  <p>This is a simulated stock for educational purposes. Price updates every 5 seconds.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <TradeForm 
              stock={stock} 
              portfolio={portfolio} 
              onTrade={handleTrade} 
            />
            
            {portfolio.holdings.some(h => h.stockId === stock.id) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Your Position</h3>
                  
                  {portfolio.holdings
                    .filter(h => h.stockId === stock.id)
                    .map(holding => (
                      <div key={holding.stockId} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Shares</p>
                            <p className="text-lg font-medium">{holding.shares}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <p className="text-lg font-medium">
                              {formatCurrency(holding.totalValue)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Avg. Price</p>
                            <p className="text-lg font-medium">
                              {formatCurrency(holding.averageBuyPrice)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Gain/Loss</p>
                            <div className="flex items-center">
                              {holding.totalGain >= 0 ? (
                                <TrendingUp size={14} className="text-success mr-1" />
                              ) : (
                                <TrendingDown size={14} className="text-destructive mr-1" />
                              )}
                              <span className={`text-lg font-medium ${holding.totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {formatPercent(holding.totalGainPercent)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockDetails;
