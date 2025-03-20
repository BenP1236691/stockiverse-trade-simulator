
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { Stock, TradeOrder, Portfolio } from '@/utils/types';
import { Plus, Minus, AlertCircle } from 'lucide-react';

interface TradeFormProps {
  stock: Stock;
  portfolio: Portfolio;
  onTrade: (order: TradeOrder) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ stock, portfolio, onTrade }) => {
  const { toast } = useToast();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState<string>('1');
  const [total, setTotal] = useState<number>(stock.price);
  const [maxShares, setMaxShares] = useState<number>(0);
  
  // Current holding for this stock, if any
  const currentHolding = portfolio.holdings.find(h => h.stockId === stock.id);
  
  // Calculate max shares user can buy with available cash
  useEffect(() => {
    if (tradeType === 'buy') {
      const maxSharesAffordable = Math.floor(portfolio.cash / stock.price);
      setMaxShares(maxSharesAffordable);
    } else {
      setMaxShares(currentHolding?.shares || 0);
    }
  }, [tradeType, stock.price, portfolio.cash, currentHolding]);
  
  // Update total whenever shares or price changes
  useEffect(() => {
    const sharesNum = parseFloat(shares) || 0;
    setTotal(sharesNum * stock.price);
  }, [shares, stock.price]);
  
  // Handle trade type change
  const handleTradeTypeChange = (value: string) => {
    setTradeType(value as 'buy' | 'sell');
    setShares('1'); // Reset shares when switching trade type
  };
  
  // Handle shares input change
  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setShares(value);
    }
  };
  
  // Set to max shares
  const handleSetMaxShares = () => {
    setShares(maxShares.toString());
  };
  
  // Handle trade submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sharesNum = parseFloat(shares);
    
    // Validation
    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast({
        title: "Invalid shares",
        description: "Please enter a valid number of shares",
        variant: "destructive"
      });
      return;
    }
    
    if (tradeType === 'buy' && total > portfolio.cash) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough cash to complete this purchase",
        variant: "destructive"
      });
      return;
    }
    
    if (tradeType === 'sell' && (!currentHolding || sharesNum > currentHolding.shares)) {
      toast({
        title: "Insufficient shares",
        description: "You don't have enough shares to complete this sale",
        variant: "destructive"
      });
      return;
    }
    
    // Create order
    const order: TradeOrder = {
      type: tradeType,
      stockId: stock.id,
      shares: sharesNum,
      price: stock.price,
      total: total,
      timestamp: Date.now()
    };
    
    // Execute trade
    onTrade(order);
    
    // Reset form
    setShares('1');
    
    // Show confirmation
    toast({
      title: `${tradeType === 'buy' ? 'Purchase' : 'Sale'} Completed`,
      description: `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${sharesNum} shares of ${stock.symbol} for ${formatCurrency(total)}`,
    });
  };
  
  return (
    <Card className="animate-fade-in">
      <Tabs defaultValue="buy" onValueChange={handleTradeTypeChange}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="buy" className="data-[state=active]:bg-success/10 data-[state=active]:text-success">
            <Plus size={16} className="mr-2" />
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive">
            <Minus size={16} className="mr-2" />
            Sell
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy" className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="price">Current Price</Label>
              <Input
                id="price"
                value={formatCurrency(stock.price)}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="shares">Shares</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSetMaxShares}
                  className="h-6 text-xs"
                >
                  Max: {maxShares}
                </Button>
              </div>
              <Input
                id="shares"
                value={shares}
                onChange={handleSharesChange}
                className="text-right"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="total">Total Cost</Label>
              <Input
                id="total"
                value={formatCurrency(total)}
                readOnly
                className="bg-muted font-semibold text-right"
              />
            </div>
            
            <div className="text-sm flex items-center space-x-2 text-muted-foreground">
              <AlertCircle size={14} />
              <span>Available Cash: {formatCurrency(portfolio.cash)}</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-success hover:bg-success/90"
              disabled={
                parseFloat(shares) <= 0 || 
                parseFloat(shares) > maxShares || 
                total > portfolio.cash
              }
            >
              Buy Shares
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="sell" className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="s-price">Current Price</Label>
              <Input
                id="s-price"
                value={formatCurrency(stock.price)}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="s-shares">Shares</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSetMaxShares}
                  className="h-6 text-xs"
                >
                  Max: {maxShares}
                </Button>
              </div>
              <Input
                id="s-shares"
                value={shares}
                onChange={handleSharesChange}
                className="text-right"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="s-total">Total Value</Label>
              <Input
                id="s-total"
                value={formatCurrency(total)}
                readOnly
                className="bg-muted font-semibold text-right"
              />
            </div>
            
            <div className="text-sm flex items-center space-x-2 text-muted-foreground">
              <AlertCircle size={14} />
              <span>Shares Owned: {currentHolding?.shares || 0}</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-destructive hover:bg-destructive/90"
              disabled={
                parseFloat(shares) <= 0 || 
                !currentHolding || 
                parseFloat(shares) > currentHolding.shares
              }
            >
              Sell Shares
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TradeForm;
