
import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  AlertTriangle,
  Save,
  RefreshCw,
  HelpCircle,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Navbar from '@/components/Navbar';
import { simulationEngine } from '@/utils/simulationEngine';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [updateInterval, setUpdateInterval] = useState<string>('5');
  const [volatility, setVolatility] = useState<string>('0.015');
  const [playerName, setPlayerName] = useState<string>('');
  const [autoSave, setAutoSave] = useState<boolean>(true);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    // Theme setting
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      setTheme(savedTheme);
    } else {
      // Default to system
      setTheme('system');
    }
    
    // Player name
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
    
    // Simulation settings
    const savedUpdateInterval = localStorage.getItem('updateInterval');
    if (savedUpdateInterval) {
      setUpdateInterval(savedUpdateInterval);
    }
    
    const savedVolatility = localStorage.getItem('volatility');
    if (savedVolatility) {
      setVolatility(savedVolatility);
    }
    
    // Auto save
    const savedAutoSave = localStorage.getItem('autoSave');
    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === 'true');
    }
  }, []);
  
  // Update theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous classes
    root.classList.remove('light', 'dark');
    
    // Apply new theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Handle saving simulation settings
  const handleSaveSimulationSettings = () => {
    const intervalMs = parseInt(updateInterval) * 1000;
    const volatilityFactor = parseFloat(volatility);
    
    // Update simulation engine options
    simulationEngine.updateOptions({
      updateInterval: intervalMs,
      volatilityFactor: volatilityFactor
    });
    
    // Save to localStorage
    localStorage.setItem('updateInterval', updateInterval);
    localStorage.setItem('volatility', volatility);
    
    toast({
      title: "Settings Saved",
      description: "Simulation settings have been updated"
    });
  };
  
  // Handle saving player name
  const handleSavePlayerName = () => {
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName.trim());
      
      toast({
        title: "Name Saved",
        description: `Your display name has been set to "${playerName.trim()}"`
      });
    }
  };
  
  // Handle auto save toggle
  const handleAutoSaveToggle = (checked: boolean) => {
    setAutoSave(checked);
    localStorage.setItem('autoSave', checked.toString());
    
    toast({
      title: checked ? "Auto Save Enabled" : "Auto Save Disabled",
      description: checked 
        ? "Your portfolio will be automatically saved" 
        : "You'll need to manually save your progress"
    });
  };
  
  // Handle reset simulation
  const handleResetSimulation = () => {
    // Reset portfolio
    const initialPortfolio = {
      cash: 100000,
      holdings: [],
      totalValue: 100000,
      totalGain: 0,
      totalGainPercent: 0
    };
    
    localStorage.setItem('portfolio', JSON.stringify(initialPortfolio));
    localStorage.setItem('trades', JSON.stringify([]));
    
    // Reset simulation engine (restart with initial conditions)
    simulationEngine.stop();
    simulationEngine.start();
    
    toast({
      title: "Simulation Reset",
      description: "Your portfolio has been reset to $100,000",
      variant: "destructive"
    });
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-3xl font-semibold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your trading simulation experience
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw size={18} className="mr-2" />
                  Simulation Settings
                </CardTitle>
                <CardDescription>
                  Configure how the stock simulation behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="update-interval">Update Interval (seconds)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle size={14} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often stock prices update</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={updateInterval}
                    onValueChange={setUpdateInterval}
                  >
                    <SelectTrigger id="update-interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 second (fast)</SelectItem>
                      <SelectItem value="3">3 seconds</SelectItem>
                      <SelectItem value="5">5 seconds (default)</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds (slow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volatility">Price Volatility</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle size={14} className="text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How much prices can change in each update</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={volatility}
                    onValueChange={setVolatility}
                  >
                    <SelectTrigger id="volatility">
                      <SelectValue placeholder="Select volatility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.005">Very Low (0.5%)</SelectItem>
                      <SelectItem value="0.01">Low (1%)</SelectItem>
                      <SelectItem value="0.015">Medium (1.5% - default)</SelectItem>
                      <SelectItem value="0.025">High (2.5%)</SelectItem>
                      <SelectItem value="0.05">Very High (5%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleSaveSimulationSettings}
                  className="w-full"
                >
                  <Save size={16} className="mr-2" />
                  Save Simulation Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon size={18} className="mr-2" />
                  Display Settings
                </CardTitle>
                <CardDescription>
                  Configure the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center gap-1 h-auto py-4"
                      onClick={() => setTheme('light')}
                    >
                      <Sun size={18} />
                      <span className="text-xs">Light</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center gap-1 h-auto py-4"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon size={18} />
                      <span className="text-xs">Dark</span>
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      className="flex flex-col items-center justify-center gap-1 h-auto py-4"
                      onClick={() => setTheme('system')}
                    >
                      <Laptop size={18} />
                      <span className="text-xs">System</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  User Profile
                </CardTitle>
                <CardDescription>
                  Configure your trader profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player-name">Display Name</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="player-name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                    <Button onClick={handleSavePlayerName}>Save</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-save">Auto Save Progress</Label>
                    <Switch
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={handleAutoSaveToggle}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your portfolio and trades as you play
                  </p>
                </div>
                
                <Separator />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Reset Simulation
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                        Reset Simulation
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset your portfolio back to $100,000 and remove all your
                        current holdings and trade history. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetSimulation}>
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  About Stockiverse
                </CardTitle>
                <CardDescription>
                  Stock Trading Simulation Game
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Stockiverse is a realistic stock market simulator that lets you practice
                  trading with virtual money. Buy and sell stocks from over 120 companies,
                  compete with other traders, and learn investment strategies without risking
                  real money.
                </p>
                
                <p className="text-sm text-muted-foreground">
                  Stock prices update every few seconds to provide a dynamic trading environment.
                  The simulation uses realistic market behavior algorithms, but all data is
                  simulated for educational purposes.
                </p>
                
                <div className="text-sm flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">1.0.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
