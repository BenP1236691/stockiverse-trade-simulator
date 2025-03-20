
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { Stock } from '@/utils/types';
import { Link } from 'react-router-dom';

interface StockCardProps {
  stock: Stock;
  compact?: boolean;
  onClick?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, compact = false, onClick }) => {
  const isPositive = stock.change >= 0;
  const changeClass = isPositive ? 'text-success' : 'text-destructive';
  const changeAnimation = isPositive ? 'animate-price-up' : 'animate-price-down';

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-md ${
        compact ? 'p-3' : 'p-4'
      } animate-scale-in`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary">
            <span className="font-semibold text-sm">{stock.symbol}</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-base leading-tight">{stock.symbol}</h3>
            {!compact && (
              <p className="text-xs text-muted-foreground line-clamp-1">{stock.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <p className={`font-semibold ${stock.change !== 0 ? changeAnimation : ''}`}>
            {formatCurrency(stock.price)}
          </p>
          <div className="flex items-center text-xs">
            {isPositive ? (
              <TrendingUp size={14} className="text-success mr-1" />
            ) : (
              <TrendingDown size={14} className="text-destructive mr-1" />
            )}
            <span className={changeClass}>
              {formatPercent(stock.changePercent)}
            </span>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {stock.sector}
          </Badge>
          
          {onClick ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto -mr-2 h-8 px-2" 
              onClick={onClick}
            >
              <span className="text-xs mr-1">Trade</span>
              <ChevronRight size={14} />
            </Button>
          ) : (
            <Link to={`/stock/${stock.id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto -mr-2 h-8 px-2"
              >
                <span className="text-xs mr-1">Details</span>
                <ChevronRight size={14} />
              </Button>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};

export default StockCard;
