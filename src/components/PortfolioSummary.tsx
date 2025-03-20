
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { Portfolio, PortfolioHolding } from '@/utils/types';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
  compact?: boolean;
  className?: string;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  portfolio, 
  compact = false,
  className = "" 
}) => {
  const isPositive = portfolio.totalGain >= 0;
  
  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Wallet size={18} className="mr-2" />
          Portfolio Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold">{formatCurrency(portfolio.totalValue)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Available Cash</p>
              <p className="text-2xl font-semibold">{formatCurrency(portfolio.cash)}</p>
            </div>
          </div>
          
          <div className="pt-2 border-t flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
              <div className="flex items-center">
                {isPositive ? (
                  <TrendingUp size={16} className="text-success mr-2" />
                ) : (
                  <TrendingDown size={16} className="text-destructive mr-2" />
                )}
                <p className={`text-lg font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(portfolio.totalGain)}
                </p>
              </div>
            </div>
            <Badge className={isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}>
              {formatPercent(portfolio.totalGainPercent)}
            </Badge>
          </div>
          
          {!compact && portfolio.holdings.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Top Holdings</h4>
              <div className="space-y-2">
                {portfolio.holdings
                  .sort((a, b) => b.totalValue - a.totalValue)
                  .slice(0, 3)
                  .map((holding) => (
                    <HoldingSummary key={holding.stockId} holding={holding} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface HoldingSummaryProps {
  holding: PortfolioHolding;
}

const HoldingSummary: React.FC<HoldingSummaryProps> = ({ holding }) => {
  const isPositive = holding.totalGain >= 0;
  
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-secondary">
          <span className="font-semibold text-xs">{holding.symbol.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-sm">{holding.symbol}</p>
          <p className="text-xs text-muted-foreground">{holding.shares} shares</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm">{formatCurrency(holding.totalValue)}</p>
        <p className={`text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {formatPercent(holding.totalGainPercent)}
        </p>
      </div>
    </div>
  );
};

export default PortfolioSummary;
