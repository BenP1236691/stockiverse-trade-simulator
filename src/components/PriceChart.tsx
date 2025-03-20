
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
} from 'recharts';
import { PriceHistoryPoint } from '@/utils/types';
import { formatCurrency } from '@/utils/formatters';

interface PriceChartProps {
  data: PriceHistoryPoint[];
  currentPrice: number;
  previousPrice: number;
  className?: string;
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground shadow-lg p-3 rounded-md border border-border">
        <p className="text-sm font-medium">{new Date(label).toLocaleTimeString()}</p>
        <p className="text-sm">
          <span className="font-semibold">Price: </span>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  currentPrice, 
  previousPrice,
  className = "" 
}) => {
  // Determine if the trend is positive or negative for colors
  const isPositive = currentPrice >= previousPrice;
  const lineColor = isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  
  // Format data for chart
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: point.timestamp,
      price: point.price,
    }));
  }, [data]);
  
  // Calculate min and max for Y axis
  const minPrice = useMemo(() => {
    const min = Math.min(...chartData.map(d => d.price));
    return Math.floor(min * 0.995); // 0.5% buffer below min
  }, [chartData]);
  
  const maxPrice = useMemo(() => {
    const max = Math.max(...chartData.map(d => d.price));
    return Math.ceil(max * 1.005); // 0.5% buffer above max
  }, [chartData]);

  return (
    <Card className={`p-4 animate-fade-in ${className}`}>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => formatCurrency(value)}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={previousPrice} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2, fill: 'hsl(var(--background))' }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PriceChart;
