
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  History,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Navbar from '@/components/Navbar';
import PortfolioSummary from '@/components/PortfolioSummary';
import { simulationEngine } from '@/utils/simulationEngine';
import { formatCurrency, formatPercent, formatShares } from '@/utils/formatters';
import { Stock, Portfolio as PortfolioType, PortfolioHolding, TradeOrder } from '@/utils/types';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioType>({
    cash: 100000,
    holdings: [],
    totalValue: 100000,
    totalGain: 0,
    totalGainPercent: 0
  });
  
  const [trades, setTrades] = useState<TradeOrder[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  
  // Initialize and subscribe to stock updates
  useEffect(() => {
    // Start simulation engine if not already started
    simulationEngine.start();
    
    // Set initial stocks
    setStocks(simulationEngine.getStocks());
    
    // Subscribe to stock updates
    const unsubscribe = simulationEngine.subscribe((updatedStocks) => {
      setStocks(updatedStocks);
      
      // Update portfolio holdings with new stock prices
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
    });
    
    // Load portfolio from localStorage if exists
    const savedPortfolio = localStorage.getItem('portfolio');
    const savedTrades = localStorage.getItem('trades');
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Save portfolio changes to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);
  
  // Save trades to localStorage
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);
  
  // Sort holdings by value
  const sortedHoldings = useMemo(() => {
    return [...portfolio.holdings].sort((a, b) => b.totalValue - a.totalValue);
  }, [portfolio.holdings]);
  
  // Recent trades, newest first
  const recentTrades = useMemo(() => {
    return [...trades].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [trades]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-3xl font-semibold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your investments and track performance
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <PortfolioSummary portfolio={portfolio} />
            
            {recentTrades.length > 0 && (
              <Card className="mt-6 animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <History size={18} className="mr-2" />
                    Recent Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTrades.map((trade, index) => {
                      const stock = stocks.find(s => s.id === trade.stockId);
                      if (!stock) return null;
                      
                      return (
                        <div key={index} className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={trade.type === 'buy' ? 'bg-success/10 text-success border-success/30' : 'bg-destructive/10 text-destructive border-destructive/30'}
                            >
                              {trade.type === 'buy' ? 'BUY' : 'SELL'}
                            </Badge>
                            <div>
                              <p className="font-medium text-sm">{stock.symbol}</p>
                              <p className="text-xs text-muted-foreground">{formatShares(trade.shares)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{formatCurrency(trade.total)}</p>
                            <p className="text-xs text-muted-foreground">
                              <Clock size={10} className="inline mr-1" />
                              {new Date(trade.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Holdings</span>
                  <Badge variant="outline">{portfolio.holdings.length} stocks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.holdings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You don't have any stocks yet</p>
                    <Link to="/dashboard">
                      <Badge variant="secondary" className="cursor-pointer">
                        Go to Dashboard to start trading
                      </Badge>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stock</TableHead>
                        <TableHead>Shares</TableHead>
                        <TableHead className="text-right">Avg. Price</TableHead>
                        <TableHead className="text-right">Current</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Gain/Loss</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedHoldings.map((holding) => (
                        <TableRow key={holding.stockId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-secondary">
                                <span className="font-semibold text-xs">{holding.symbol.charAt(0)}</span>
                              </div>
                              <span>{holding.symbol}</span>
                            </div>
                          </TableCell>
                          <TableCell>{holding.shares}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="cursor-help flex items-center">
                                  {formatCurrency(holding.averageBuyPrice)}
                                  <Info size={12} className="ml-1 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Average cost basis per share</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(holding.currentPrice)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(holding.totalValue)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              {holding.totalGain >= 0 ? (
                                <TrendingUp size={14} className="text-success mr-1" />
                              ) : (
                                <TrendingDown size={14} className="text-destructive mr-1" />
                              )}
                              <span className={holding.totalGain >= 0 ? 'text-success' : 'text-destructive'}>
                                {formatPercent(holding.totalGainPercent)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/stock/${holding.stockId}`}>
                              <ChevronRight size={16} className="text-muted-foreground" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
