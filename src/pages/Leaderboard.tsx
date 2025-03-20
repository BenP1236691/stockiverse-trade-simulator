
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Users,
  ArrowUp,
  ArrowDown,
  Clock,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { Portfolio, Player } from '@/utils/types';

// Generate mock players for the leaderboard
const generateMockPlayers = (): Player[] => {
  const playerNames = [
    'WallStreetWiz', 'StockSurfer', 'BullBaron', 'TradeTitan',
    'MarketMaster', 'WealthWhiz', 'StockSage', 'PortfolioPro',
    'InvestorIQ', 'AssetAce', 'GainsGuru', 'TradingTycoon',
    'CashCaptain', 'MoneyMogul', 'DividendDiva', 'ProfitPundit'
  ];
  
  return playerNames.map((name, index) => {
    // Random portfolio value between 80,000 and 150,000
    const portfolioValue = 80000 + Math.random() * 70000;
    const cash = 10000 + Math.random() * 50000;
    const stockValue = portfolioValue - cash;
    const gain = portfolioValue - 100000;
    const gainPercent = (gain / 100000) * 100;
    
    const portfolio: Portfolio = {
      cash,
      holdings: [], // We don't need detailed holdings for leaderboard
      totalValue: portfolioValue,
      totalGain: gain,
      totalGainPercent: gainPercent
    };
    
    return {
      id: `player-${index}`,
      name,
      portfolio,
      trades: [],
      joinedAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000) // Random join date within the last week
    };
  });
};

const mockPlayers = generateMockPlayers();

const Leaderboard: React.FC = () => {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [sortField, setSortField] = useState<'totalValue' | 'totalGainPercent'>('totalValue');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPlayer, setUserPlayer] = useState<Player | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  // Initialize leaderboard data
  useEffect(() => {
    // Sort players
    const sortedPlayers = [...mockPlayers].sort((a, b) => {
      return b.portfolio[sortField] - a.portfolio[sortField];
    });
    
    setPlayers(sortedPlayers);
    
    // Try to get user's portfolio from localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    const savedPlayerName = localStorage.getItem('playerName');
    
    if (savedPortfolio) {
      const portfolio = JSON.parse(savedPortfolio) as Portfolio;
      
      // Create player object
      const player: Player = {
        id: 'user',
        name: savedPlayerName || 'You',
        portfolio,
        trades: [],
        joinedAt: Date.now()
      };
      
      setUserPlayer(player);
      
      // Add user to leaderboard if not already there
      if (!sortedPlayers.find(p => p.id === 'user')) {
        const updatedPlayers = [...sortedPlayers, player].sort((a, b) => {
          return b.portfolio[sortField] - a.portfolio[sortField];
        });
        
        setPlayers(updatedPlayers);
      }
    }
    
    // Show toast
    toast({
      title: "Leaderboard Updated",
      description: "Compete with other traders to reach the top"
    });
    
    setLastUpdateTime(new Date());
  }, [toast, sortField]);
  
  // Handle search
  useEffect(() => {
    if (!searchQuery) {
      const allPlayers = [...mockPlayers];
      
      // Add user player if exists
      if (userPlayer && !allPlayers.find(p => p.id === userPlayer.id)) {
        allPlayers.push(userPlayer);
      }
      
      const sortedPlayers = allPlayers.sort((a, b) => {
        return b.portfolio[sortField] - a.portfolio[sortField];
      });
      
      setPlayers(sortedPlayers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filteredPlayers = mockPlayers
      .filter(player => player.name.toLowerCase().includes(query));
    
    // Add user player if it matches search and exists
    if (userPlayer && userPlayer.name.toLowerCase().includes(query)) {
      filteredPlayers.push(userPlayer);
    }
    
    const sortedPlayers = filteredPlayers.sort((a, b) => {
      return b.portfolio[sortField] - a.portfolio[sortField];
    });
    
    setPlayers(sortedPlayers);
  }, [searchQuery, userPlayer, sortField]);
  
  // Set player name
  const handleSetName = (name: string) => {
    if (!name.trim()) return;
    
    localStorage.setItem('playerName', name.trim());
    
    // Update user player
    if (userPlayer) {
      const updatedPlayer = { ...userPlayer, name: name.trim() };
      setUserPlayer(updatedPlayer);
      
      // Update in players list
      setPlayers(prev => {
        const updatedPlayers = prev.map(p => 
          p.id === 'user' ? updatedPlayer : p
        );
        return updatedPlayers;
      });
    }
    
    toast({
      title: "Name Updated",
      description: `You are now competing as "${name.trim()}"`
    });
  };
  
  // Toggle sort field
  const toggleSortField = () => {
    setSortField(prev => prev === 'totalValue' ? 'totalGainPercent' : 'totalValue');
  };
  
  // Get user's rank
  const getUserRank = (): number => {
    if (!userPlayer) return 0;
    
    return players.findIndex(p => p.id === 'user') + 1;
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-3xl font-semibold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Compete with other traders and climb to the top
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Trophy size={18} className="mr-2" />
                  Your Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userPlayer ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <span className="font-semibold text-lg">
                            {userPlayer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-lg">{userPlayer.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock size={12} className="mr-1" />
                            Joined {new Date(userPlayer.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="text-lg h-8 px-2">#{getUserRank()}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Wallet size={14} className="mr-1" />
                          Net Worth
                        </p>
                        <p className="text-xl font-semibold">
                          {formatCurrency(userPlayer.portfolio.totalValue)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Gain/Loss</p>
                        <div className="flex items-center">
                          {userPlayer.portfolio.totalGain >= 0 ? (
                            <ArrowUp size={14} className="text-success mr-1" />
                          ) : (
                            <ArrowDown size={14} className="text-destructive mr-1" />
                          )}
                          <span className={`text-xl font-semibold ${userPlayer.portfolio.totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatPercent(userPlayer.portfolio.totalGainPercent)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Input
                        placeholder="Change your display name"
                        defaultValue={userPlayer.name}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSetName(e.currentTarget.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Start trading to appear on the leaderboard
                    </p>
                    <Button asChild>
                      <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users size={18} className="mr-2" />
                  Leaderboard Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Traders</p>
                    <p className="text-2xl font-semibold">{players.length}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Average Portfolio Value</p>
                    <p className="text-2xl font-semibold">
                      {formatCurrency(
                        players.reduce((sum, p) => sum + p.portfolio.totalValue, 0) / players.length
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Profitable Traders</p>
                    <p className="text-2xl font-semibold">
                      {players.filter(p => p.portfolio.totalGain > 0).length} 
                      <span className="text-sm text-muted-foreground ml-1">
                        ({Math.round(players.filter(p => p.portfolio.totalGain > 0).length / players.length * 100)}%)
                      </span>
                    </p>
                  </div>
                  
                  <div className="text-sm text-muted-foreground flex items-center">
                    <RefreshCw size={12} className="mr-1" />
                    Last updated: {lastUpdateTime.toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="animate-fade-in">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  <Trophy size={18} className="mr-2" />
                  Top Traders
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Input
                      placeholder="Search traders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[180px] pl-8"
                    />
                    <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleSortField}
                    className="text-xs"
                  >
                    Sort by: {sortField === 'totalValue' ? 'Net Worth' : 'Return %'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Trader</TableHead>
                      <TableHead className="text-right">Net Worth</TableHead>
                      <TableHead className="text-right">Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player, index) => (
                      <TableRow 
                        key={player.id} 
                        className={player.id === 'user' ? 'bg-muted/50' : ''}
                      >
                        <TableCell className="font-medium">
                          {index === 0 ? (
                            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-600">
                              <Trophy size={14} />
                            </div>
                          ) : (
                            <div className="font-medium">#{index + 1}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`h-8 w-8 flex items-center justify-center rounded-full ${player.id === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                              <span className="font-semibold text-sm">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {player.name}
                                {player.id === 'user' && (
                                  <Badge variant="outline" className="ml-2 h-5 text-xs">You</Badge>
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Joined {new Date(player.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(player.portfolio.totalValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {player.portfolio.totalGain >= 0 ? (
                              <ArrowUp size={14} className="text-success mr-1" />
                            ) : (
                              <ArrowDown size={14} className="text-destructive mr-1" />
                            )}
                            <span className={player.portfolio.totalGain >= 0 ? 'text-success' : 'text-destructive'}>
                              {formatPercent(player.portfolio.totalGainPercent)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {players.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">No traders found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
