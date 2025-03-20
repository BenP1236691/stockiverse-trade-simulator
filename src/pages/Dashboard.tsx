
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import StockCard from '@/components/StockCard';
import PortfolioSummary from '@/components/PortfolioSummary';
import { simulationEngine } from '@/utils/simulationEngine';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { Stock, StockWithHistory, Portfolio } from '@/utils/types';

const SECTORS = [
  'All Sectors',
  'Technology',
  'Healthcare',
  'Finance',
  'Consumer Goods',
  'Energy',
  'Materials',
  'Utilities',
  'Real Estate',
  'Communication',
  'Industrial'
];

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [stocks, setStocks] = useState<StockWithHistory[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockWithHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All Sectors');
  const [sortOption, setSortOption] = useState('name');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  // Mock portfolio for now - will be replaced with real data
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 100000,
    holdings: [],
    totalValue: 100000,
    totalGain: 0,
    totalGainPercent: 0
  });
  
  // Initialize simulation
  useEffect(() => {
    // Start simulation engine
    simulationEngine.start();
    
    // Subscribe to stock updates
    const unsubscribe = simulationEngine.subscribe((updatedStocks) => {
      setStocks(updatedStocks);
      setLastUpdateTime(new Date());
    });
    
    // Use current stocks state initially
    setStocks(simulationEngine.getStocks());
    
    // Show toast when page loads
    toast({
      title: "Trading Simulation Active",
      description: "Stock prices update every 5 seconds"
    });
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [toast]);
  
  // Filter and sort stocks based on search, sector, and sort option
  useEffect(() => {
    let result = [...stocks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
      );
    }
    
    // Apply sector filter
    if (sectorFilter !== 'All Sectors') {
      result = result.filter(stock => stock.sector === sectorFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent - a.changePercent;
        default:
          return 0;
      }
    });
    
    setFilteredStocks(result);
  }, [stocks, searchQuery, sectorFilter, sortOption]);
  
  // Get market trends
  const marketTrend = stocks.reduce(
    (sum, stock) => sum + stock.changePercent, 
    0
  ) / (stocks.length || 1);
  
  const gainers = stocks
    .filter(stock => stock.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
    
  const losers = stocks
    .filter(stock => stock.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-3xl font-semibold mb-2">Market Dashboard</h1>
          <p className="text-muted-foreground">
            Track and trade stocks in real-time. Last update: {lastUpdateTime.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-7">
          {/* Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <PortfolioSummary portfolio={portfolio} compact />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Market Trend</h3>
              <div className="glass-panel p-4 flex items-center space-x-3">
                {marketTrend >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-success" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-destructive" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Overall</p>
                  <p className={`text-xl font-semibold ${marketTrend >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {marketTrend.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <TrendingUp size={16} className="text-success mr-1" />
                  Top Gainers
                </h4>
                <div className="space-y-2">
                  {gainers.map(stock => (
                    <Link to={`/stock/${stock.id}`} key={stock.id} className="block">
                      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-success">+{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <TrendingDown size={16} className="text-destructive mr-1" />
                  Top Losers
                </h4>
                <div className="space-y-2">
                  {losers.map(stock => (
                    <Link to={`/stock/${stock.id}`} key={stock.id} className="block">
                      <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-destructive">{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="relative w-full sm:w-auto flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-40">
                  <Select 
                    value={sectorFilter} 
                    onValueChange={setSectorFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map(sector => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-40">
                  <Select 
                    value={sortOption} 
                    onValueChange={setSortOption}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Company Name</SelectItem>
                      <SelectItem value="symbol">Symbol</SelectItem>
                      <SelectItem value="price">Price (High to Low)</SelectItem>
                      <SelectItem value="change">% Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setSearchQuery('');
                    setSectorFilter('All Sectors');
                    setSortOption('name');
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Stocks</h3>
                <Badge variant="outline">
                  {filteredStocks.length} of {stocks.length} stocks
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks.slice(0, 12).map(stock => (
                  <Link to={`/stock/${stock.id}`} key={stock.id}>
                    <StockCard stock={stock} />
                  </Link>
                ))}
              </div>
              
              {filteredStocks.length > 12 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All {filteredStocks.length} Stocks
                  </Button>
                </div>
              )}
              
              {filteredStocks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No stocks found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
