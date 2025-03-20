
import { Stock, StockWithHistory, PriceHistoryPoint } from './types';

// Sectors for categorizing stocks
const sectors = [
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

// Company names and symbols
const companies = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Goods' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Goods' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Finance' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Goods' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
  { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Goods' },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Finance' },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Finance' },
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication' },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology' },
  { symbol: 'CMCSA', name: 'Comcast Corp.', sector: 'Communication' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Goods' },
  { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Goods' },
  { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.', sector: 'Healthcare' },
  { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
  { symbol: 'ACN', name: 'Accenture plc', sector: 'Technology' },
  { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare' },
  // Additional companies to reach 120+ total
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce.com Inc.', sector: 'Technology' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Goods' },
  { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Goods' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
  { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Goods' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Finance' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.', sector: 'Finance' },
  { symbol: 'MCD', name: 'McDonald\'s Corp.', sector: 'Consumer Goods' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology' },
  { symbol: 'DHR', name: 'Danaher Corp.', sector: 'Healthcare' },
  { symbol: 'PM', name: 'Philip Morris International', sector: 'Consumer Goods' },
  { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication' },
  { symbol: 'TXN', name: 'Texas Instruments Inc.', sector: 'Technology' },
  { symbol: 'UPS', name: 'United Parcel Service', sector: 'Industrial' },
  { symbol: 'NEE', name: 'NextEra Energy Inc.', sector: 'Utilities' },
  { symbol: 'RTX', name: 'Raytheon Technologies', sector: 'Industrial' },
  { symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology' },
  { symbol: 'LLY', name: 'Eli Lilly and Co.', sector: 'Healthcare' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { symbol: 'IBM', name: 'International Business Machines', sector: 'Technology' },
  { symbol: 'AMT', name: 'American Tower Corp.', sector: 'Real Estate' },
  { symbol: 'LIN', name: 'Linde plc', sector: 'Materials' },
  { symbol: 'SBUX', name: 'Starbucks Corp.', sector: 'Consumer Goods' },
  { symbol: 'AMAT', name: 'Applied Materials Inc.', sector: 'Technology' },
  { symbol: 'GILD', name: 'Gilead Sciences Inc.', sector: 'Healthcare' },
  { symbol: 'MDLZ', name: 'Mondelez International', sector: 'Consumer Goods' },
  { symbol: 'CVX', name: 'Chevron Corp.', sector: 'Energy' },
  { symbol: 'NOW', name: 'ServiceNow Inc.', sector: 'Technology' },
  { symbol: 'GS', name: 'Goldman Sachs Group', sector: 'Finance' },
  { symbol: 'MMM', name: '3M Co.', sector: 'Industrial' },
  { symbol: 'ISRG', name: 'Intuitive Surgical Inc.', sector: 'Healthcare' },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb', sector: 'Healthcare' },
  { symbol: 'HON', name: 'Honeywell International', sector: 'Industrial' },
  { symbol: 'C', name: 'Citigroup Inc.', sector: 'Finance' },
  { symbol: 'TGT', name: 'Target Corp.', sector: 'Consumer Goods' },
  { symbol: 'BLK', name: 'BlackRock Inc.', sector: 'Finance' },
  { symbol: 'MS', name: 'Morgan Stanley', sector: 'Finance' },
  { symbol: 'SPGI', name: 'S&P Global Inc.', sector: 'Finance' },
  { symbol: 'BA', name: 'Boeing Co.', sector: 'Industrial' },
  { symbol: 'LOW', name: 'Lowe\'s Companies', sector: 'Consumer Goods' },
  { symbol: 'AXP', name: 'American Express Co.', sector: 'Finance' },
  { symbol: 'DE', name: 'Deere & Co.', sector: 'Industrial' },
  { symbol: 'GE', name: 'General Electric', sector: 'Industrial' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial' },
  { symbol: 'SCHW', name: 'Charles Schwab Corp.', sector: 'Finance' },
  { symbol: 'CHTR', name: 'Charter Communications', sector: 'Communication' },
  { symbol: 'BKNG', name: 'Booking Holdings Inc.', sector: 'Consumer Goods' },
  { symbol: 'PLD', name: 'Prologis Inc.', sector: 'Real Estate' },
  { symbol: 'ANTM', name: 'Anthem Inc.', sector: 'Healthcare' },
  { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy' },
  { symbol: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare' },
  { symbol: 'ADI', name: 'Analog Devices Inc.', sector: 'Technology' },
  { symbol: 'CB', name: 'Chubb Ltd.', sector: 'Finance' },
  { symbol: 'CI', name: 'Cigna Corp.', sector: 'Healthcare' },
  { symbol: 'CME', name: 'CME Group Inc.', sector: 'Finance' },
  { symbol: 'TMUS', name: 'T-Mobile US Inc.', sector: 'Communication' },
  { symbol: 'INTU', name: 'Intuit Inc.', sector: 'Technology' },
  { symbol: 'PGR', name: 'Progressive Corp.', sector: 'Finance' },
  { symbol: 'SO', name: 'Southern Co.', sector: 'Utilities' },
  { symbol: 'USB', name: 'U.S. Bancorp', sector: 'Finance' },
  { symbol: 'FIS', name: 'Fidelity National Information', sector: 'Technology' },
  { symbol: 'MO', name: 'Altria Group Inc.', sector: 'Consumer Goods' },
  { symbol: 'DUK', name: 'Duke Energy Corp.', sector: 'Utilities' },
  { symbol: 'ICE', name: 'Intercontinental Exchange', sector: 'Finance' },
  { symbol: 'CSX', name: 'CSX Corp.', sector: 'Industrial' },
  { symbol: 'FISV', name: 'Fiserv Inc.', sector: 'Technology' },
  { symbol: 'VRTX', name: 'Vertex Pharmaceuticals', sector: 'Healthcare' },
  { symbol: 'ITW', name: 'Illinois Tool Works', sector: 'Industrial' },
  { symbol: 'SYK', name: 'Stryker Corp.', sector: 'Healthcare' },
  { symbol: 'ATVI', name: 'Activision Blizzard', sector: 'Communication' },
  { symbol: 'LRCX', name: 'Lam Research Corp.', sector: 'Technology' },
  { symbol: 'PNC', name: 'PNC Financial Services', sector: 'Finance' },
  { symbol: 'BSX', name: 'Boston Scientific Corp.', sector: 'Healthcare' },
  { symbol: 'EQIX', name: 'Equinix Inc.', sector: 'Real Estate' },
  { symbol: 'ZTS', name: 'Zoetis Inc.', sector: 'Healthcare' },
  { symbol: 'AON', name: 'Aon plc', sector: 'Finance' },
  { symbol: 'D', name: 'Dominion Energy Inc.', sector: 'Utilities' },
  { symbol: 'EL', name: 'Estee Lauder Companies', sector: 'Consumer Goods' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals', sector: 'Healthcare' },
  { symbol: 'TJX', name: 'TJX Companies Inc.', sector: 'Consumer Goods' },
  { symbol: 'HCA', name: 'HCA Healthcare Inc.', sector: 'Healthcare' },
  { symbol: 'SHW', name: 'Sherwin-Williams Co.', sector: 'Materials' },
  { symbol: 'APD', name: 'Air Products & Chemicals', sector: 'Materials' },
  { symbol: 'KLAC', name: 'KLA Corp.', sector: 'Technology' },
  { symbol: 'WM', name: 'Waste Management Inc.', sector: 'Industrial' },
  { symbol: 'CL', name: 'Colgate-Palmolive Co.', sector: 'Consumer Goods' },
  { symbol: 'CMG', name: 'Chipotle Mexican Grill', sector: 'Consumer Goods' },
  { symbol: 'ADSK', name: 'Autodesk Inc.', sector: 'Technology' },
  { symbol: 'ADP', name: 'Automatic Data Processing', sector: 'Technology' },
  { symbol: 'NOC', name: 'Northrop Grumman Corp.', sector: 'Industrial' },
  { symbol: 'MCO', name: 'Moody\'s Corp.', sector: 'Finance' },
  { symbol: 'ILMN', name: 'Illumina Inc.', sector: 'Healthcare' },
  { symbol: 'EW', name: 'Edwards Lifesciences', sector: 'Healthcare' },
  { symbol: 'ECL', name: 'Ecolab Inc.', sector: 'Materials' },
  { symbol: 'SNPS', name: 'Synopsys Inc.', sector: 'Technology' },
  { symbol: 'ETN', name: 'Eaton Corp. plc', sector: 'Industrial' },
  { symbol: 'PSA', name: 'Public Storage', sector: 'Real Estate' },
  { symbol: 'FDX', name: 'FedEx Corp.', sector: 'Industrial' },
  { symbol: 'CCI', name: 'Crown Castle International', sector: 'Real Estate' }
];

// Function to generate a random stock price between $10 and $1000
const generateRandomPrice = (): number => {
  return Math.floor(Math.random() * 990) + 10;
};

// Function to generate a random volume between 100,000 and 10,000,000
const generateRandomVolume = (): number => {
  return Math.floor(Math.random() * 9900000) + 100000;
};

// Function to generate initial stock data
export const generateInitialStocks = (): Stock[] => {
  return companies.map((company, index) => {
    const price = generateRandomPrice();
    const volume = generateRandomVolume();
    
    return {
      id: `stock-${index}`,
      symbol: company.symbol,
      name: company.name,
      price: price,
      previousPrice: price,
      change: 0,
      changePercent: 0,
      volume: volume,
      marketCap: price * (volume * 10), // Simplified market cap calculation
      sector: company.sector,
      logoUrl: `/logos/${company.symbol.toLowerCase()}.png` // Placeholder for logo URLs
    };
  });
};

// Function to generate initial price history (24 data points)
export const generateInitialPriceHistory = (stock: Stock): PriceHistoryPoint[] => {
  const now = Date.now();
  const history: PriceHistoryPoint[] = [];
  
  // Generate 24 data points going back in time (one per hour)
  for (let i = 24; i >= 0; i--) {
    const timestamp = now - (i * 3600000); // i hours ago
    let priceVariation = 0;
    
    if (i > 0) {
      // Random price variation between -5% and +5%
      priceVariation = (Math.random() * 10 - 5) / 100;
    }
    
    const price = i === 0 
      ? stock.price // Current price
      : stock.price * (1 + priceVariation);
      
    history.push({
      timestamp,
      price
    });
  }
  
  return history;
};

// Function to enhance stock data with price history
export const enhanceStocksWithHistory = (stocks: Stock[]): StockWithHistory[] => {
  return stocks.map(stock => ({
    ...stock,
    priceHistory: generateInitialPriceHistory(stock)
  }));
};

// Export initial stock data
export const initialStocks = generateInitialStocks();
export const initialStocksWithHistory = enhanceStocksWithHistory(initialStocks);
